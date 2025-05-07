export type DocumentCategory =
  | 'Articles'
  | 'Source materials'
  | 'Presentations'
  | 'Formation Programs'
  | 'Miscellaneous'
  | 'Videos'
  | 'Reflections 4 Dimensions';
export type DocumentPurpose =
  | 'General'
  | 'Novitiate'
  | 'Postulancy'
  | 'Scholasticate'
  | 'Ongoing Formation';

// Add Sorting Types Here
export type SortKey =
  | 'title'
  | 'file_type'
  | 'category'
  | 'created_at'
  | 'language'
  | 'region'
  | null;

export type SortDirection = 'asc' | 'desc' | null;

export interface Document {
  id: string;
  title: string;
  description?: string;
  category: DocumentCategory;
  file_name: string;
  file_type: string;
  file_size: number;
  file_path: string;
  file_url?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  created_by_name?: string;
  author_name?: string;
  content_url?: string;
  region?: string;
  language?: string;
}

// Type for data fetched from the syllabus_documents table
export interface SyllabusDocument {
  id: string; // uuid
  title: string;
  description?: string | null;
  file_path: string | null; // Allow null to match DB schema
  file_type?: string | null;
  file_size?: number | null; // bigint maps to number or string in JS
  category: DocumentCategory;
  author_id?: string | null; // uuid
  author_name?: string | null;
  created_at: string; // timestamp with time zone
  updated_at?: string | null; // timestamp with time zone
  region?: string | null;
  language?: string | null;
  topics?: string[] | null;
  purpose?: DocumentPurpose[] | null;
  keywords?: string[] | null;
  is_public?: boolean | null;
}
