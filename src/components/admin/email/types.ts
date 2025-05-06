import { DocumentCategory } from '@/types/document';

export type Document = {
  id: string;
  title: string;
  category: string;
  file_type?: string | null;
  language?: string | null;
  region?: string | null;
  created_at: string;
  author_name?: string | null;
};

export type User = {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  status?: string | null;
};

export type DocumentFilters = {
  category: DocumentCategory | '';
  language: string;
  keywords: string;
};
