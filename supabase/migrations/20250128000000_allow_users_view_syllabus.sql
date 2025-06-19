-- Migration: Allow users and editors to view syllabus documents
-- Description: Adds RLS policies to allow users and editors to view (but not modify) syllabus documents

-- Add policy for all authenticated users to view syllabus documents
CREATE POLICY "All authenticated users can view syllabus documents" ON public.syllabus_documents
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'editor', 'user')
      AND profiles.is_approved = true
    )
  );

-- Add policy for editors to insert syllabus documents (same as admins)
CREATE POLICY "Editors can insert syllabus documents" ON public.syllabus_documents
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'editor')
      AND profiles.is_approved = true
    )
  );

-- Add policy for editors to update syllabus documents (same as admins)
CREATE POLICY "Editors can update syllabus documents" ON public.syllabus_documents
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'editor')
      AND profiles.is_approved = true
    )
  );

-- Add policy for editors to delete syllabus documents (same as admins)
CREATE POLICY "Editors can delete syllabus documents" ON public.syllabus_documents
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'editor')
      AND profiles.is_approved = true
    )
  );

-- Drop the old admin-only view policy since we're replacing it with the broader one above
DROP POLICY "Admins can view all syllabus documents" ON public.syllabus_documents;