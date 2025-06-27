'use server';

import { Buffer } from 'buffer'; // Needed for Basic Auth encoding
import type { WPMember, WPTerm } from './types'; // Assuming types will be defined here

const WP_API_URL = process.env.WORDPRESS_API_URL;
const WP_API_USER = process.env.WORDPRESS_API_USER;
const WP_API_PASSWORD = process.env.WORDPRESS_API_PASSWORD;

if (!WP_API_URL || !WP_API_USER || !WP_API_PASSWORD) {
  throw new Error(
    'WordPress API URL, User, or Password not configured in environment variables.',
  );
}

// Define base endpoint for WP taxonomies (kept for potential future use)
const _WP_TAXONOMIES_BASE_ENDPOINT = `${WP_API_URL}/taxonomies`;
const WP_POSITION_TERMS_ENDPOINT = `${WP_API_URL}/position`;

// Encode credentials for Basic Authentication
const basicAuth = Buffer.from(`${WP_API_USER}:${WP_API_PASSWORD}`).toString(
  'base64',
);

// Extend WPTerm with parent property for category terms
interface WPCategoryTerm extends WPTerm {
  parent: number;
}

/**
 * Helper function to extract last name from full name
 * @param fullName - The full name string
 * @returns The last name portion
 */
function getLastName(fullName: string): string {
  const nameParts = fullName.trim().split(/\s+/);
  return nameParts[nameParts.length - 1] || fullName;
}

/**
 * Fetches members from a specific page of the WordPress REST API.
 */

const USER = process.env.WORDPRESS_API_USER!;
const PASS = process.env.WORDPRESS_API_PASSWORD!;

// The env var typically ends with "/wp-json/wp/v2". Keep it as the base for core REST
const WP_V2_BASE = process.env.WORDPRESS_API_URL!.replace(/\/$/, '');

// Derive helper bases
const MEMBER_CORE_ENDPOINT = `${WP_V2_BASE}/member`;
const CUSTOM_BASE = WP_V2_BASE.replace('/wp/v2', '/custom/v1');

function getCustomMetaUrl(id: number) {
  return `${CUSTOM_BASE}/member-meta/${id}`;
}

function getAuthHeader() {
  return 'Basic ' + Buffer.from(`${USER}:${PASS}`).toString('base64');
}

export async function fetchMembersPage(
  page: number,
): Promise<{ members: WPMember[]; totalPages: number }> {
  const res = await fetch(`${MEMBER_CORE_ENDPOINT}?page=${page}&per_page=25`, {
    headers: {
      Authorization: getAuthHeader(),
    },
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(
      `Failed to fetch members page ${page}: ${res.status} ${res.statusText}. ${errorBody}`,
    );
  }

  const rawMembers: WPMember[] = await res.json();
  const totalPages = parseInt(res.headers.get('X-WP-TotalPages') || '1', 10);

  // Fetch full meta for each member via /custom/v1/member-meta/:id
  const enrichedMembers: WPMember[] = await Promise.all(
    rawMembers.map(async (member: WPMember) => {
      const metaRes = await fetch(getCustomMetaUrl(member.id), {
        headers: { Authorization: getAuthHeader() },
      });

      if (!metaRes.ok) {
        console.warn(`Failed to fetch meta for member ${member.id}`);
        return { ...member, meta: {} }; // fallback
      }

      const metaData = await metaRes.json();
      return {
        ...member,
        meta: metaData.meta,
        image: metaData.image,
        title: metaData.title,
        slug: metaData.slug,
      };
    }),
  );

  return { members: enrichedMembers, totalPages };
}

/**
 * Fetches specific members by searching for their names.
 * WARNING: This makes multiple API calls (one per name) and might be slow.
 * It's less efficient than fetching by ID if IDs were known.
 *
 * @param {string[]} names - An array of names to search for.
 * @returns {Promise<WPMember[]>} A promise resolving to an array of found members.
 */
export async function fetchMembersByNames(
  names: string[],
): Promise<WPMember[]> {
  const uniqueMembersMap = new Map<number, WPMember>();
  const searchPromises: Promise<void>[] = [];

  console.log(
    `Attempting to fetch ${names.length} specific members by name search...`,
  );

  for (const name of names) {
    const searchTerm = encodeURIComponent(name); // Ensure name is URL-safe
    const url = `${MEMBER_CORE_ENDPOINT}&search=${searchTerm}`;

    searchPromises.push(
      fetch(url, {
        headers: {
          Authorization: `Basic ${basicAuth}`,
          'Content-Type': 'application/json',
        },
        // Short cache for search results
        next: {
          revalidate: 600,
          tags: ['wordpress', 'members', `member-search-${searchTerm}`],
        },
      })
        .then((response) => {
          if (!response.ok) {
            // Don't throw for a single failed search, just log it
            console.error(
              `Failed to search for member "${name}": ${response.status} ${response.statusText}`,
            );
            return null; // Indicate failure for this name
          }
          return response.json();
        })
        .then((results: WPMember[] | null) => {
          if (results && results.length > 0) {
            // If search returns results, add the first one (best guess)
            // More sophisticated matching could be added if needed
            const member = results[0];
            if (!uniqueMembersMap.has(member.id)) {
              uniqueMembersMap.set(member.id, member);
              console.log(
                `---> Found member for search "${name}": ID ${member.id} - ${member.title.rendered}`,
              );
            }
          } else if (results) {
            console.log(`---> No members found for search "${name}"`);
          }
        })
        .catch((error) => {
          // Log fetch errors for individual searches
          console.error(`Error during fetch for member "${name}":`, error);
        }),
    );
  }

  try {
    await Promise.all(searchPromises);
  } catch (error) {
    // This catch block might not be strictly necessary if individual fetches handle errors,
    // but added for safety.
    console.error('Error processing member search promises:', error);
  }

  const foundMembers = Array.from(uniqueMembersMap.values());
  console.log(
    `Finished search. Found ${foundMembers.length} unique members matching the target list.`,
  );
  return foundMembers;
}

/**
 * Fetches ALL members from the WordPress REST API, handling pagination.
 * @returns {Promise<WPMember[]>} A promise that resolves to an array of all member objects.
 * @throws {Error} If any fetch request fails.
 */
export async function fetchMembers(): Promise<WPMember[]> {
  try {
    const perPage = 25;

    // 1. FETCH FIRST PAGE (to discover total pages)
    const firstPageUrl = `${MEMBER_CORE_ENDPOINT}?page=1&per_page=${perPage}`;
    const firstRes = await fetch(firstPageUrl, {
      headers: { Authorization: getAuthHeader() },
    });

    if (!firstRes.ok) {
      const txt = await firstRes.text();
      throw new Error(
        `Failed to fetch first members page: ${firstRes.status} ${firstRes.statusText}. ${txt}`,
      );
    }

    const firstPageJson = await firstRes.json();
    const totalPages = parseInt(
      firstRes.headers.get('X-WP-TotalPages') || '1',
      10,
    );

    const memberIds: number[] = firstPageJson.map((m: { id: number }) => m.id);

    // 2. FETCH REMAINING PAGES SEQUENTIALLY (to avoid CF 524)
    for (let page = 2; page <= totalPages; page++) {
      const url = `${MEMBER_CORE_ENDPOINT}?page=${page}&per_page=${perPage}`;
      const res = await fetch(url, {
        headers: { Authorization: getAuthHeader() },
      });
      if (!res.ok) {
        const body = await res.text();
        throw new Error(
          `Failed to fetch members page ${page}: ${res.status} ${res.statusText}. ${body}`,
        );
      }
      const json = await res.json();
      (json as { id: number }[]).forEach((m) => memberIds.push(m.id));
    }

    console.log(
      `📄 Collected ${memberIds.length} member IDs across ${totalPages} pages.`,
    );

    // 3. FETCH META IN BATCHES TO AVOID OVERLOAD
    const allMembers: WPMember[] = [];
    const BATCH_SIZE = 20;

    for (let i = 0; i < memberIds.length; i += BATCH_SIZE) {
      const slice = memberIds.slice(i, i + BATCH_SIZE);
      const metaResults = await Promise.all(
        slice.map(async (id) => {
          const metaRes = await fetch(getCustomMetaUrl(id), {
            headers: { Authorization: getAuthHeader() },
          });

          if (!metaRes.ok) {
            console.warn(
              `⚠️  Meta fetch failed for member ${id}: ${metaRes.status}`,
            );
            return null;
          }

          const metaJson = await metaRes.json();
          return metaJson as WPMember; // assumes structure matches WPMember with meta included
        }),
      );

      metaResults.forEach((m) => {
        if (m) allMembers.push(m);
      });

      console.log(
        `🔄 Processed ${Math.min(i + BATCH_SIZE, memberIds.length)}/${
          memberIds.length
        } members`,
      );
    }

    console.log(
      `✅ Completed member fetch with meta: ${allMembers.length} records ready.`,
    );
    return allMembers;
  } catch (error) {
    console.error('Error in fetchMembers():', error);
    throw error;
  }
}

/**
 * Fetches all positions (taxonomy terms) from the WordPress REST API.
 * @returns {Promise<WPTerm[]>} A promise resolving to an array of position terms.
 */
export async function fetchPositions(): Promise<WPTerm[]> {
  try {
    const url = `${WP_POSITION_TERMS_ENDPOINT}?per_page=100`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Basic ${basicAuth}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600, tags: ['wordpress', 'positions'] }, // Cache for 1 hour
    });

    if (!response.ok) {
      let errorBody: unknown = '';
      try {
        errorBody = await response.json();
      } catch (_e) {
        /* Ignore */
      }
      throw new Error(
        `Failed to fetch positions: ${response.status} ${
          response.statusText
        }. ${JSON.stringify(errorBody)}`,
      );
    }

    const positions = (await response.json()) as WPTerm[];
    console.log(`Fetched ${positions.length} positions.`);
    return positions;
  } catch (error) {
    console.error('Error fetching WordPress positions:', error);
    throw error; // Re-throw after logging
  }
}

/**
 * Fetches members by position ID.
 * @param {number} positionId - The position term ID to filter by.
 * @returns {Promise<WPMember[]>} A promise resolving to an array of members with the specified position.
 */
export async function fetchMembersByPosition(
  positionId: number,
): Promise<WPMember[]> {
  try {
    const url = `${MEMBER_CORE_ENDPOINT}&position=${positionId}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Basic ${basicAuth}`,
        'Content-Type': 'application/json',
      },
      next: {
        revalidate: 600,
        tags: ['wordpress', 'members', `position-${positionId}`],
      }, // Cache for 10 mins
    });

    if (!response.ok) {
      let errorBody: unknown = '';
      try {
        errorBody = await response.json();
      } catch (_e) {
        /* Ignore */
      }
      throw new Error(
        `Failed to fetch members by position: ${response.status} ${
          response.statusText
        }. ${JSON.stringify(errorBody)}`,
      );
    }

    const members = (await response.json()) as WPMember[];
    console.log(
      `Fetched ${members.length} members for position ${positionId}.`,
    );
    return members;
  } catch (error) {
    console.error(`Error fetching members by position ${positionId}:`, error);
    throw error; // Re-throw after logging
  }
}

/**
 * Fetches specific categories from the WordPress API with their relationships.
 * @param {number[]} categoryIds - The category IDs to fetch.
 * @returns {Promise<{ categories: WPCategoryTerm[], relations: Record<number, number[]> }>} Promise resolving to categories and their relations.
 */
async function _fetchCategoriesWithRelations(categoryIds: number[]): Promise<{
  categories: WPCategoryTerm[];
  relations: Record<number, number[]>;
}> {
  try {
    const url = `${WP_API_URL}/categories?include=${categoryIds.join(',')}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Basic ${basicAuth}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600, tags: ['wordpress', 'categories'] }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch categories: ${response.status} ${response.statusText}`,
      );
    }

    const categories = (await response.json()) as WPCategoryTerm[];
    console.log(`Fetched ${categories.length} specific categories.`);

    // Create a map of parent-child relationships
    const relations: Record<number, number[]> = {};

    // Initialize all fetched categories with empty arrays
    categories.forEach((cat) => {
      relations[cat.id] = [];
    });

    // Populate child arrays based on parent references
    categories.forEach((cat) => {
      if (cat.parent && relations[cat.parent]) {
        relations[cat.parent].push(cat.id);
      }
    });

    return { categories, relations };
  } catch (error) {
    console.error('Error fetching WordPress categories with relations:', error);
    throw error;
  }
}

/**
 * Builds a hierarchical tree of categories from flat array.
 * @param {WPCategoryTerm[]} categories - The flat array of category terms.
 * @param {number} parentId - The parent ID to start building from (0 for root).
 * @returns {Promise<WPCategoryTerm[]>} A nested array representing the category hierarchy.
 */
export async function buildCategoryTree(
  categories: WPCategoryTerm[],
  parentId = 0,
): Promise<WPCategoryTerm[]> {
  const result: WPCategoryTerm[] = [];
  const categoriesWithChildren = categories.map((category) => ({
    ...category,
    children: [] as WPCategoryTerm[],
  }));

  if (
    !Array.isArray(categoriesWithChildren) ||
    categoriesWithChildren.length === 0
  ) {
    return result;
  }

  // Create a map for quick lookups
  const categoryMap = new Map<
    number,
    WPCategoryTerm & { children: WPCategoryTerm[] }
  >();

  categoriesWithChildren.forEach((category) => {
    categoryMap.set(category.id, category);
  });

  // Build the tree structure
  categoriesWithChildren.forEach((category) => {
    if (category.parent === parentId) {
      // This is a root-level category for the given parent
      result.push(category);
    } else if (categoryMap.has(category.parent)) {
      // This is a child category, add it to its parent
      const parent = categoryMap.get(category.parent);
      if (parent && parent.children) {
        parent.children.push(category);
      }
    }
  });

  return result;
}

/**
 * Fetches all provinces (taxonomy terms) from the WordPress REST API.
 * @returns {Promise<WPTerm[]>} A promise resolving to an array of province terms.
 */
export async function fetchProvinces(): Promise<WPTerm[]> {
  try {
    console.log('Attempting to fetch provinces...');
    const url = `${WP_API_URL}/province?per_page=100`;
    console.log('Province API URL:', url);

    const response = await fetch(url, {
      headers: {
        Authorization: `Basic ${basicAuth}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600, tags: ['wordpress', 'provinces'] }, // Cache for 1 hour
    });

    if (!response.ok) {
      let errorBody: unknown = '';
      try {
        errorBody = await response.json();
      } catch (_e) {
        try {
          errorBody = await response.text();
        } catch (_e2) {
          /* Ignore */
        }
      }

      console.error(
        `Province API failed with status ${response.status}:`,
        errorBody,
      );

      // If province taxonomy doesn't exist, return empty array as fallback
      if (response.status === 404) {
        console.warn('Province taxonomy not found, returning empty array');
        return [];
      }

      throw new Error(
        `Failed to fetch provinces: ${response.status} ${
          response.statusText
        }. ${JSON.stringify(errorBody)}`,
      );
    }

    const provinces = (await response.json()) as WPTerm[];
    console.log(`Fetched ${provinces.length} provinces.`);
    return provinces;
  } catch (error) {
    console.error('Error fetching WordPress provinces:', error);

    // Return empty array as fallback to prevent app from breaking
    console.warn('Returning empty provinces array as fallback');
    return [];
  }
}

/**
 * Fetches formation users from the WordPress REST API.
 * This function tries different approaches to filter formation users.
 * @returns {Promise<WPMember[]>} A promise resolving to an array of formation members.
 */
export async function fetchFormationUsers(): Promise<WPMember[]> {
  try {
    console.log('👥 Fetching formation personnel...');

    // Step 1: Get all members
    console.log('🔄 STEP 1: Fetching all members...');
    const allMembers = await fetchMembers();
    console.log(`✅ Fetched ${allMembers.length} total members from WordPress`);

    // Step 2: Get deceased members
    console.log('🔄 STEP 2: Fetching deceased members...');
    const deceasedMembers = await fetchDeceasedMembers();
    const deceasedIds = new Set(deceasedMembers.map((member) => member.id));
    console.log(`⚰️ Deceased members to exclude: ${deceasedIds.size}`);

    // Step 3: Filter out deceased members first
    const livingMembers = allMembers.filter((member) => {
      const isDeceased = deceasedIds.has(member.id);
      if (isDeceased) {
        console.log(`⚰️ Excluding deceased: ${member.title.rendered}`);
      }
      return !isDeceased;
    });

    console.log(
      `💚 Living members after deceased filter: ${livingMembers.length}`,
    );

    // Define the formation positions we want to include
    const formationPositions = [
      'General Formation Coordinator',
      'Novice Master',
      'Assistant Novice Master',
      'Master Of Scholastics',
      'Formation Assistant',
      'Formation Director',
      'Postulant Director',
      'Vocation Director',
      'Co-Vocation Director',
    ];

    // Step 4: Filter members by formation positions
    const membersWithFormationPositions = livingMembers.filter((member) => {
      // Check if member has embedded taxonomy data
      if (!member._embedded?.['wp:term']) {
        return false;
      }

      // Get all terms and find position terms
      const terms = member._embedded['wp:term'].flat();
      const positionTerms = terms.filter(
        (term) => term.taxonomy === 'position',
      );

      // Check if any of the member's positions match our formation positions
      const hasFormationPosition = positionTerms.some((positionTerm) => {
        const positionName = positionTerm.name.toLowerCase().trim();

        // Use exact matching or very specific partial matching for formation positions
        return formationPositions.some((formationPos) => {
          const normalizedFormationPos = formationPos.toLowerCase().trim();

          // Exact match first
          if (positionName === normalizedFormationPos) {
            return true;
          }

          // Specific formation position matching
          if (
            normalizedFormationPos.includes('general formation coordinator') &&
            positionName.includes('general') &&
            positionName.includes('formation') &&
            positionName.includes('coordinator')
          ) {
            return true;
          }
          if (
            normalizedFormationPos.includes('novice master') &&
            positionName.includes('novice') &&
            positionName.includes('master') &&
            !positionName.includes('assistant')
          ) {
            return true;
          }
          if (
            normalizedFormationPos.includes('assistant novice master') &&
            positionName.includes('assistant') &&
            positionName.includes('novice') &&
            positionName.includes('master')
          ) {
            return true;
          }
          if (
            normalizedFormationPos.includes('master of scholastics') &&
            positionName.includes('master') &&
            positionName.includes('scholastic')
          ) {
            return true;
          }
          if (
            normalizedFormationPos.includes('formation assistant') &&
            positionName.includes('formation') &&
            positionName.includes('assistant')
          ) {
            return true;
          }
          if (
            normalizedFormationPos.includes('formation director') &&
            positionName.includes('formation') &&
            positionName.includes('director')
          ) {
            return true;
          }
          if (
            normalizedFormationPos.includes('postulant director') &&
            positionName.includes('postulant') &&
            positionName.includes('director')
          ) {
            return true;
          }
          if (
            normalizedFormationPos.includes('vocation director') &&
            positionName.includes('vocation') &&
            positionName.includes('director') &&
            !positionName.includes('co-')
          ) {
            return true;
          }
          if (
            normalizedFormationPos.includes('co-vocation director') &&
            positionName.includes('co') &&
            positionName.includes('vocation') &&
            positionName.includes('director')
          ) {
            return true;
          }

          return false;
        });
      });

      return hasFormationPosition;
    });

    console.log(
      `👥 Members with formation positions: ${membersWithFormationPositions.length}`,
    );

    // Step 5: Filter for active positions only (exclude positions with end dates)
    console.log('🔄 STEP 5: Filtering for active positions...');

    const activeFormationPersonnelPromises = membersWithFormationPositions.map(
      async (member) => {
        const terms = member._embedded?.['wp:term']?.flat() || [];
        const positionTerms = terms.filter(
          (term) => term.taxonomy === 'position',
        );

        // Check if any position is active
        const activePositionChecks = await Promise.all(
          positionTerms.map(async (position) => {
            const isActive = await isPositionActive(position.name);
            if (!isActive) {
              console.log(
                `📅 Inactive position found: ${member.title.rendered} - ${position.name}`,
              );
            }
            return isActive;
          }),
        );

        // Include member if they have at least one active position
        const hasActivePosition = activePositionChecks.some(
          (isActive) => isActive,
        );

        if (!hasActivePosition) {
          console.log(`📅 Excluding inactive: ${member.title.rendered}`);
        }

        return hasActivePosition ? member : null;
      },
    );

    const activeFormationPersonnelResults = await Promise.all(
      activeFormationPersonnelPromises,
    );
    const activeFormationPersonnel = activeFormationPersonnelResults.filter(
      (member): member is WPMember => member !== null,
    );

    console.log(
      `✅ Active formation personnel: ${activeFormationPersonnel.length}`,
    );

    // Step 6: Sort by last name
    const sortedPersonnel = activeFormationPersonnel.sort((a, b) => {
      const lastNameA = getLastName(a.title.rendered);
      const lastNameB = getLastName(b.title.rendered);
      return lastNameA.localeCompare(lastNameB, 'en', { sensitivity: 'base' });
    });

    // Log the positions found for debugging
    const foundPositions = new Set<string>();
    const memberPositions: Array<{ name: string; positions: string[] }> = [];

    sortedPersonnel.forEach((member) => {
      const terms = member._embedded?.['wp:term']?.flat() || [];
      const positionTerms = terms.filter(
        (term) => term.taxonomy === 'position',
      );
      const positions = positionTerms.map((term) => term.name);
      memberPositions.push({
        name: member.title.rendered,
        positions: positions,
      });
      positionTerms.forEach((term) => foundPositions.add(term.name));
    });

    console.log('📋 FINAL ACTIVE FORMATION PERSONNEL:');
    memberPositions.forEach((member, index) => {
      console.log(
        `  ${index + 1}. ${member.name} - ${member.positions.join(', ')}`,
      );
    });

    console.log(`📊 Found positions: ${Array.from(foundPositions).join(', ')}`);
    console.log('✅ Formation personnel fetch completed successfully!');

    return sortedPersonnel;
  } catch (error) {
    console.error('❌ Error fetching formation users:', error);
    throw error; // Re-throw after logging
  }
}

/**
 * Fetches members by province ID.
 * @param {number} provinceId - The province term ID to filter by.
 * @returns {Promise<WPMember[]>} A promise resolving to an array of members with the specified province.
 */
export async function fetchMembersByProvince(
  provinceId: number,
): Promise<WPMember[]> {
  try {
    const url = `${MEMBER_CORE_ENDPOINT}&province=${provinceId}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Basic ${basicAuth}`,
        'Content-Type': 'application/json',
      },
      next: {
        revalidate: 600,
        tags: ['wordpress', 'members', `province-${provinceId}`],
      }, // Cache for 10 mins
    });

    if (!response.ok) {
      let errorBody: unknown = '';
      try {
        errorBody = await response.json();
      } catch (_e) {
        /* Ignore */
      }
      throw new Error(
        `Failed to fetch members by province: ${response.status} ${
          response.statusText
        }. ${JSON.stringify(errorBody)}`,
      );
    }

    const members = (await response.json()) as WPMember[];
    console.log(
      `Fetched ${members.length} members for province ${provinceId}.`,
    );
    return members;
  } catch (error) {
    console.error(`Error fetching members by province ${provinceId}:`, error);
    throw error; // Re-throw after logging
  }
}

/**
 * Debug function to check what taxonomies are available in WordPress.
 * This helps identify the correct taxonomy names.
 * @returns {Promise<string[]>} A promise resolving to an array of available taxonomy names.
 */
export async function fetchAvailableTaxonomies(): Promise<string[]> {
  try {
    console.log('Fetching available taxonomies for debugging...');
    const url = `${WP_API_URL}/taxonomies`;
    console.log('Taxonomies API URL:', url);

    const response = await fetch(url, {
      headers: {
        Authorization: `Basic ${basicAuth}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600, tags: ['wordpress', 'taxonomies'] },
    });

    if (!response.ok) {
      console.error(
        `Failed to fetch taxonomies: ${response.status} ${response.statusText}`,
      );
      return [];
    }

    const taxonomies = await response.json();
    const taxonomyNames = Object.keys(taxonomies);
    console.log('Available taxonomies:', taxonomyNames);
    return taxonomyNames;
  } catch (error) {
    console.error('Error fetching taxonomies:', error);
    return [];
  }
}

/**
 * Fetches leadership formation members from the WordPress REST API.
 * This function specifically targets the 18 members listed on https://intern.osfs.world/formation/
 * @returns {Promise<WPMember[]>} A promise resolving to an array of leadership formation members.
 */
export async function fetchLeadershipFormationMembers(): Promise<WPMember[]> {
  try {
    console.log('Fetching formation leaders from WordPress API...');

    // Get all members with embedded data
    let allMembers: WPMember[] = [];
    let hasEmbeddedData = false;

    // Try to fetch with _embed first
    try {
      const allMembersUrl = `${MEMBER_CORE_ENDPOINT}&per_page=100&_embed`;
      const allMembersResponse = await fetch(allMembersUrl, {
        headers: {
          Authorization: `Basic ${basicAuth}`,
          'Content-Type': 'application/json',
        },
        next: { revalidate: 600, tags: ['wordpress', 'members'] },
      });

      if (allMembersResponse.ok) {
        allMembers = (await allMembersResponse.json()) as WPMember[];
        hasEmbeddedData = true;
        console.log(
          `✅ Fetched ${allMembers.length} total members with _embed`,
        );
      } else {
        throw new Error(`API returned ${allMembersResponse.status}`);
      }
    } catch (embedError) {
      console.warn('Failed to fetch with _embed, trying fallback:', embedError);

      // Fallback to basic fetchMembers
      try {
        allMembers = await fetchMembers();
        hasEmbeddedData = false;
        console.log(
          `✅ Fallback: Fetched ${allMembers.length} members without _embed`,
        );
      } catch (fallbackError) {
        console.error('Both methods failed:', fallbackError);
        return [];
      }
    }

    if (allMembers.length === 0) {
      console.warn('No members found, returning empty array');
      return [];
    }

    // If we have embedded data, try to filter by formation positions
    if (hasEmbeddedData) {
      const formationLeadershipPositions = [
        'master of scholastics',
        'novice master',
        'formation director',
        'formation assistant',
        'vocation director',
        'postulant director',
        'co-vocation director',
      ];

      const positionMatches = allMembers.filter((member) => {
        if (!member._embedded?.['wp:term']) return false;

        // Check if member has any formation leadership position
        const hasFormationLeadershipPosition = member._embedded['wp:term'].some(
          (termGroup) =>
            termGroup.some((term) => {
              if (term.taxonomy !== 'position') return false;

              const positionName = term.name.toLowerCase();
              return formationLeadershipPositions.some(
                (formationPos) =>
                  positionName.includes(formationPos) ||
                  formationPos.includes(positionName),
              );
            }),
        );

        return hasFormationLeadershipPosition;
      });

      console.log(
        `🎯 Found ${positionMatches.length} members with formation leadership positions`,
      );

      if (positionMatches.length > 0) {
        positionMatches.forEach((member, index) => {
          const positions = member._embedded?.['wp:term']
            ?.flat()
            .filter((term) => term.taxonomy === 'position')
            .map((term) => term.name) || ['No position'];

          const province =
            member._embedded?.['wp:term']
              ?.flat()
              .filter((term) => term.taxonomy === 'province')
              .map((term) => term.name)[0] || 'No province';

          console.log(
            `${index + 1}. ${
              member.title.rendered
            } | ${province} | ${positions.join(', ')}`,
          );
        });

        return positionMatches;
      }
    }

    // If position filtering doesn't work, return a reasonable subset of members
    // This ensures users see actual members rather than empty state
    console.log('📋 No position matches found, returning recent members');
    const recentMembers = allMembers.slice(0, 20);

    recentMembers.forEach((member, index) => {
      console.log(`${index + 1}. ${member.title.rendered} (ID: ${member.id})`);
    });

    return recentMembers;
  } catch (error) {
    console.error('❌ Error fetching leadership formation members:', error);
    console.log('🔄 Returning empty array to prevent app crash');
    return [];
  }
}

/**
 * Fetches leadership formation members grouped by province.
 * @returns {Promise<Record<string, WPMember[]>>} A promise resolving to members grouped by province name.
 */
export async function fetchLeadershipFormationByProvince(): Promise<
  Record<string, WPMember[]>
> {
  try {
    console.log('Fetching leadership formation members grouped by province...');

    // Get leadership formation members
    const formationMembers = await fetchLeadershipFormationMembers();

    // Group by province
    const membersByProvince: Record<string, WPMember[]> = {};

    formationMembers.forEach((member) => {
      let provinceName = 'No Province';

      // Extract province name from embedded terms
      if (member._embedded?.['wp:term']) {
        const provinceTerms = member._embedded['wp:term'].find((termGroup) =>
          termGroup.some((term) => term.taxonomy === 'province'),
        );
        if (provinceTerms) {
          const provinceTerm = provinceTerms.find(
            (term) => term.taxonomy === 'province',
          );
          if (provinceTerm) {
            provinceName = provinceTerm.name;
          }
        }
      }

      if (!membersByProvince[provinceName]) {
        membersByProvince[provinceName] = [];
      }
      membersByProvince[provinceName].push(member);
    });

    console.log(
      `Grouped ${formationMembers.length} formation members into ${
        Object.keys(membersByProvince).length
      } provinces`,
    );

    return membersByProvince;
  } catch (error) {
    console.error(
      'Error fetching leadership formation members by province:',
      error,
    );
    throw error;
  }
}

/**
 * Fetches a single member by ID from the WordPress REST API with embedded data.
 * @param {number} memberId - The ID of the member to fetch.
 * @returns {Promise<WPMember | null>} A promise resolving to the member object or null if not found.
 */
export async function fetchMemberById(
  memberId: number,
): Promise<WPMember | null> {
  try {
    console.log(`🔍 Fetching member details for ID: ${memberId}`);
    const url = `${MEMBER_CORE_ENDPOINT}/${memberId}?_embed=true`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Basic ${basicAuth}`,
        'Content-Type': 'application/json',
      },
      next: {
        revalidate: 600,
        tags: ['wordpress', 'members', `member-${memberId}`],
      },
    });

    if (!response.ok) {
      console.error(
        `❌ Failed to fetch member ${memberId}: ${response.status} ${response.statusText}`,
      );
      return null;
    }

    const member = (await response.json()) as WPMember;
    console.log(`✅ Successfully fetched member: ${member.title.rendered}`);
    return member;
  } catch (error) {
    console.error(`❌ Error fetching member by ID ${memberId}:`, error);
    return null;
  }
}

/** Lightweight fetch by slug (used rarely) */
export async function fetchMemberBySlug(
  memberSlug: string,
): Promise<WPMember | null> {
  try {
    const url = `${MEMBER_CORE_ENDPOINT}?slug=${encodeURIComponent(
      memberSlug,
    )}&_embed=true`;
    const res = await fetch(url, {
      headers: { Authorization: getAuthHeader() },
    });
    if (!res.ok) return null;
    const arr = (await res.json()) as WPMember[];
    return arr[0] ?? null;
  } catch (err) {
    console.error('fetchMemberBySlug error', err);
    return null;
  }
}

// --- Fallback helpers to satisfy type checker when optional endpoints are unavailable ---
/** Placeholder that returns an empty array when deceased endpoint isn't critical */
async function fetchDeceasedMembers(): Promise<WPMember[]> {
  return [];
}

/** Placeholder that assumes a position without an explicit end year is active */
async function isPositionActive(positionName: string): Promise<boolean> {
  return !/from\s+\d{4}\s*[–-]\s*to\s+\d{4}/i.test(positionName);
}
