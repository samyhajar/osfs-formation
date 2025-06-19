-- Migration: Fix storage policies for common-syllabus bucket
-- Description: Allow all authenticated users to view syllabus files, while restricting upload/edit/delete to admins and editors

-- Drop the old restrictive select policy
DROP POLICY IF EXISTS "Allow owner or admin syllabus select" ON storage.objects;

-- Create new policy allowing all authenticated users to view syllabus files
CREATE POLICY "Allow all authenticated users to view syllabus files" ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'common-syllabus' AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'editor', 'user')
      AND profiles.is_approved = true
    )
  );

-- Drop and recreate upload policy to restrict to admins and editors only
DROP POLICY IF EXISTS "Allow authenticated syllabus uploads" ON storage.objects;

CREATE POLICY "Allow admin and editor syllabus uploads" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'common-syllabus' AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'editor')
      AND profiles.is_approved = true
    )
  );

-- Update the update policy to allow admins and editors (not just owners)
DROP POLICY IF EXISTS "Allow owner or admin syllabus update" ON storage.objects;

CREATE POLICY "Allow admin and editor syllabus update" ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'common-syllabus' AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'editor')
      AND profiles.is_approved = true
    )
  );

-- Update the delete policy to allow admins and editors (not just owners)
DROP POLICY IF EXISTS "Allow owner or admin syllabus delete" ON storage.objects;

CREATE POLICY "Allow admin and editor syllabus delete" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'common-syllabus' AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'editor')
      AND profiles.is_approved = true
    )
  );