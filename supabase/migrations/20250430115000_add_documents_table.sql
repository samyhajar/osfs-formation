-- Create types for document categories and purposes
CREATE TYPE document_category AS ENUM (
  'Articles',
  'Source materials',
  'Presentations',
  'Formation Programs',
  'Miscellaneous',
  'Videos',
  'Reflections 4 Dimensions'
);

CREATE TYPE document_purpose AS ENUM (
  'General',
  'Novitiate',
  'Postulancy',
  'Scholasticate',
  'Ongoing Formation'
);

-- Create the documents table
CREATE TABLE public.documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  content_url TEXT,
  file_type TEXT,
  file_size BIGINT,
  category document_category NOT NULL,
  author_id UUID REFERENCES auth.users(id),
  author_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  region TEXT,
  language TEXT,
  topics TEXT[],
  purpose document_purpose[],
  keywords TEXT[],
  is_public BOOLEAN DEFAULT FALSE
);

-- Enable RLS
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Create policies
-- 1. Admins can view and manage all documents
CREATE POLICY "Admins can view all documents" ON public.documents
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can insert documents" ON public.documents
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update documents" ON public.documents
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete documents" ON public.documents
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- 2. Formants and editors can view public documents
CREATE POLICY "Users can view public documents" ON public.documents
  FOR SELECT
  USING (is_public = TRUE);

-- 3. Authors can view, update and delete their own documents
CREATE POLICY "Authors can view their documents" ON public.documents
  FOR SELECT
  USING (author_id = auth.uid());

CREATE POLICY "Authors can update their documents" ON public.documents
  FOR UPDATE
  USING (author_id = auth.uid());

CREATE POLICY "Authors can delete their documents" ON public.documents
  FOR DELETE
  USING (author_id = auth.uid());

-- Add some sample documents for development
INSERT INTO public.documents (title, description, file_type, category, author_name, region, language, topics, purpose, keywords, is_public)
VALUES
  (
    'Community Guidelines',
    'Guidelines for community living',
    'PDF',
    'Articles'::document_category,
    'Francis Danella',
    'North America',
    'English',
    ARRAY['Community', 'Spirituality'],
    ARRAY['General']::document_purpose[],
    ARRAY['community', 'guidelines'],
    TRUE
  ),
  (
    'Formation Handbook',
    'Comprehensive handbook for formation',
    'DOCX',
    'Source materials'::document_category,
    'Herbert Winklehner',
    'Europe',
    'English',
    ARRAY['Formation', 'Directory'],
    ARRAY['Novitiate', 'Postulancy']::document_purpose[],
    ARRAY['formation', 'handbook'],
    TRUE
  ),
  (
    'Annual Retreat Materials',
    'Materials for the annual retreat',
    'PPTX',
    'Presentations'::document_category,
    'Maria Johnson',
    'North America',
    'English',
    ARRAY['Spirituality', 'Prayer'],
    ARRAY['Ongoing Formation']::document_purpose[],
    ARRAY['retreat', 'annual'],
    TRUE
  ),
  (
    'Initial Formation Program',
    'Program for initial formation',
    'PDF',
    'Formation Programs'::document_category,
    'Thomas Clark',
    'Europe',
    'English',
    ARRAY['Formation', 'Vows'],
    ARRAY['Novitiate']::document_purpose[],
    ARRAY['initial', 'formation'],
    TRUE
  ),
  (
    'Prayer Guide',
    'Guide for prayer and meditation',
    'PDF',
    'Miscellaneous'::document_category,
    'Francis Danella',
    'North America',
    'English',
    ARRAY['Prayer', 'Spirituality'],
    ARRAY['General']::document_purpose[],
    ARRAY['prayer', 'guide'],
    TRUE
  );