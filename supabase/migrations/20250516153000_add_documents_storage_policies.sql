-- Migration: Add Storage Policies for 'documents' Bucket
-- Description: Sets up RLS policies for the private 'documents' storage bucket.
-- Allows authenticated users to upload.
-- Allows owners or admins to select, update, and delete.

-- Allow authenticated users to upload files to the 'documents' bucket
CREATE POLICY "Allow authenticated uploads" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'documents');

-- Allow owners or admins to view/download files
-- Supabase automatically sets the 'owner' column to the uploader's user ID
CREATE POLICY "Allow owner or admin select" ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'documents' AND
    (auth.uid() = owner OR public.is_admin(auth.uid())) -- Check if user is owner OR admin
  );

-- Allow owners or admins to update files (e.g., replace)
CREATE POLICY "Allow owner or admin update" ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'documents' AND
    (auth.uid() = owner OR public.is_admin(auth.uid())) -- Check if user is owner OR admin
  );

-- Allow owners or admins to delete files
CREATE POLICY "Allow owner or admin delete" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'documents' AND
    (auth.uid() = owner OR public.is_admin(auth.uid())) -- Check if user is owner OR admin
  );