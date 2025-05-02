'use server';

import { Buffer } from 'buffer'; // Needed for Basic Auth encoding
import type { WPMember } from './types'; // Assuming types will be defined here

const WP_API_URL = process.env.WORDPRESS_API_URL;
const WP_API_USER = process.env.WORDPRESS_API_USER;
const WP_API_PASSWORD = process.env.WORDPRESS_API_PASSWORD;

if (!WP_API_URL || !WP_API_USER || !WP_API_PASSWORD) {
  throw new Error(
    'WordPress API URL, User, or Password not configured in environment variables.',
  );
}

// Use singular form, request embedded data, max 100 per page
const WP_MEMBERS_BASE_ENDPOINT = `${WP_API_URL}/member?_embed=true&per_page=100`;

// Encode credentials for Basic Authentication
const basicAuth = Buffer.from(`${WP_API_USER}:${WP_API_PASSWORD}`).toString(
  'base64',
);

/**
 * Fetches members from a specific page of the WordPress REST API.
 */
async function fetchMembersPage(
  page: number,
): Promise<{ members: WPMember[]; totalPages: number }> {
  const url = `${WP_MEMBERS_BASE_ENDPOINT}&page=${page}`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Basic ${basicAuth}`,
      'Content-Type': 'application/json',
    },
    // Caching for paginated results can be complex, using short revalidate for now
    // Consider no-store or more granular tagging if updates are frequent
    next: { revalidate: 600, tags: ['wordpress', 'members'] }, // Cache 10 mins
  });

  if (!response.ok) {
    let errorBody: unknown = '';
    try {
      errorBody = await response.json();
    } catch (_e) {
      /* Ignore */
    }
    throw new Error(
      `Failed to fetch members page ${page}: ${response.status} ${
        response.statusText
      }. ${JSON.stringify(errorBody)}`,
    );
  }

  const totalPagesHeader = response.headers.get('X-WP-TotalPages');
  const totalPages = totalPagesHeader ? parseInt(totalPagesHeader, 10) : 1;
  const members = (await response.json()) as WPMember[];

  return { members, totalPages };
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
    const url = `${WP_MEMBERS_BASE_ENDPOINT}&search=${searchTerm}`;

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
    // Fetch the first page to get total pages count
    const { members: firstPageMembers, totalPages } = await fetchMembersPage(1);
    let allMembers = [...firstPageMembers];

    console.log(`Total Pages of Members: ${totalPages}`);

    // If there are more pages, fetch them concurrently
    if (totalPages > 1) {
      const pagePromises: Promise<{
        members: WPMember[];
        totalPages: number;
      }>[] = [];
      for (let page = 2; page <= totalPages; page++) {
        pagePromises.push(fetchMembersPage(page));
      }
      const subsequentPagesResults = await Promise.all(pagePromises);
      subsequentPagesResults.forEach((result) => {
        allMembers = allMembers.concat(result.members);
      });
    }

    console.log(`Fetched a total of ${allMembers.length} members.`);
    return allMembers;
  } catch (error) {
    console.error('Error fetching all WordPress members:', error);
    throw error; // Re-throw after logging
  }
}
