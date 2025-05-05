-- Migration: Add Storage Policies for 'common-syllabus' Bucket
-- Description: Sets up RLS policies for the private 'common-syllabus' storage bucket.
-- Mirrors policies from the 'documents' bucket.

-- Allow authenticated users to upload files to the 'common-syllabus' bucket
-- Note: This assumes any authenticated user can upload syllabus files. Adjust if needed.
CREATE POLICY "Allow authenticated syllabus uploads" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'common-syllabus');

-- Allow owners or admins to view/download syllabus files
CREATE POLICY "Allow owner or admin syllabus select" ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'common-syllabus' AND
    (auth.uid() = owner OR public.is_admin(auth.uid())) -- Check if user is owner OR admin
  );

-- Allow owners or admins to update syllabus files
CREATE POLICY "Allow owner or admin syllabus update" ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'common-syllabus' AND
    (auth.uid() = owner OR public.is_admin(auth.uid())) -- Check if user is owner OR admin
  );

-- Allow owners or admins to delete syllabus files
CREATE POLICY "Allow owner or admin syllabus delete" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'common-syllabus' AND
    (auth.uid() = owner OR public.is_admin(auth.uid())) -- Check if user is owner OR admin
  );