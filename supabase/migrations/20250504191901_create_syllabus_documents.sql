-- Migration: Create syllabus_documents table and policies
-- Description: Creates the syllabus_documents table mirroring the documents table
--              and applies admin-only RLS policies.

-- Create syllabus_documents table
CREATE TABLE public.syllabus_documents (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    title text NOT NULL,
    description text NULL,
    file_path text NULL, -- Renamed from content_url for clarity
    file_type text NULL,
    file_size bigint NULL,
    -- Assuming document_category enum already exists from the documents table migration
    category document_category NOT NULL,
    author_id uuid NULL REFERENCES auth.users(id) ON DELETE SET NULL,
    author_name text NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NULL,
    region text NULL,
    language text NULL,
    topics text[] NULL,
    -- Assuming document_purpose enum already exists
    purpose document_purpose[] NULL,
    keywords text[] NULL,
    is_public boolean DEFAULT false NULL
);

-- Add comments to columns for clarity
COMMENT ON COLUMN public.syllabus_documents.file_path IS 'Path to the file in the common-syllabus storage bucket';
COMMENT ON COLUMN public.syllabus_documents.author_id IS 'References the user who uploaded the document';

-- Enable Row Level Security
ALTER TABLE public.syllabus_documents ENABLE ROW LEVEL SECURITY;

-- Grant usage permission for the table to authenticated users
-- (RLS policies will restrict actual access)
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.syllabus_documents TO authenticated;
GRANT ALL ON TABLE public.syllabus_documents TO service_role;

-- RLS Policies (Admin only access)

CREATE POLICY "Admins can view all syllabus documents" ON public.syllabus_documents
  FOR SELECT
  USING (public.is_admin() = true);

CREATE POLICY "Admins can insert syllabus documents" ON public.syllabus_documents
  FOR INSERT
  WITH CHECK (public.is_admin() = true);

CREATE POLICY "Admins can update syllabus documents" ON public.syllabus_documents
  FOR UPDATE
  USING (public.is_admin() = true);

CREATE POLICY "Admins can delete syllabus documents" ON public.syllabus_documents
  FOR DELETE
  USING (public.is_admin() = true);

-- Trigger to update updated_at column
CREATE TRIGGER handle_updated_at
  BEFORE UPDATE ON public.syllabus_documents
  FOR EACH ROW
  EXECUTE FUNCTION moddatetime(updated_at);