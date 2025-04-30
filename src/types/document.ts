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

export interface Document {
  id: string;
  title: string;
  description?: string | null;
  content_url?: string | null;
  file_type?: string | null;
  file_size?: number | null;
  category: DocumentCategory;
  author_id?: string | null;
  author_name?: string | null;
  created_at: string;
  updated_at?: string | null;
  region?: string | null;
  language?: string | null;
  topics?: string[] | null;
  purpose?: DocumentPurpose[] | null;
  keywords?: string[] | null;
  is_public: boolean;
}
