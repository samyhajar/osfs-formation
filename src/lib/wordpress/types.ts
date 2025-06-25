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
 * Represents a position in the formation personnel
 */
export interface TargetPosition {
  position: string;
  startYear?: number;
  endYear?: number;
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
  title: {
    rendered: string;
  };
  slug: string;
  acf?: Record<string, unknown>;
  featured_media?: number;
  _embedded?: WPEmbeddedData;
  state?: number[];
  province?: number[];
  // Fields from the API response
  name?: string;
  email?: string;
  bio?: string;
  imageUrl?: string;
  meta?: {
    'e-mail'?: string;
    email?: string;
    about_his_life?: string;
    deceased?: string;
    [key: string]: unknown;
  };
}
