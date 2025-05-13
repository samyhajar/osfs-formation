/**
 * Represents a Term object as returned by the WordPress REST API (often within _embedded).
 */
export interface WPTerm {
  id: number;
  link: string;
  name: string;
  slug: string;
  taxonomy: string; // e.g., 'category', 'post_tag', 'province', 'state'
  // Add other fields if needed, like description, parent, count, etc.
}

/**
 * Represents the _embedded field structure.
 */
interface WPEmbeddedData {
  // Contains arrays of term objects, keyed by taxonomy slug
  'wp:term'?: WPTerm[][]; // Array of arrays: first level groups by taxonomy, second is terms in that taxonomy
  'wp:featuredmedia'?: {
    id: number;
    source_url: string;
    alt_text?: string;
    media_details?: {
      width: number;
      height: number;
      sizes?: Record<
        string,
        { source_url: string; width: number; height: number }
      >;
    };
  }[]; // Array containing one featured media object if available
  // Add other embedded types if needed (e.g., author)
}

/**
 * Updated structure for a WordPress Member Custom Post Type based on API response.
 */
export interface WPMember {
  id: number;
  date: string;
  date_gmt: string;
  guid: {
    rendered: string;
  };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: 'publish' | 'draft' | 'pending' | 'private';
  type: 'member';
  link: string;
  title: {
    rendered: string; // Member's name
  };
  featured_media: number; // ID of the featured media (0 if none)
  template: string;
  // Taxonomy IDs (actual names/details are in _embedded['wp:term'])
  position: number[];
  ministry: number[];
  state: number[]; // Holds Term IDs for the 'state' taxonomy (e.g., Postulant, Novice)
  province: number[]; // Holds Term IDs for the 'province' taxonomy
  // Custom fields like acf or meta are not present in the sample
  acf?: Record<string, unknown>; // Use Record<string, unknown> instead of any

  // Embedded data (available when using ?_embed=true)
  _embedded?: WPEmbeddedData;

  // We are omitting _links and class_list for simplicity unless needed
}
