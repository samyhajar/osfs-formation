-- Migration: Add Storage Policies for 'workshops' Bucket
-- Description: Sets up RLS policies for the private 'workshops' storage bucket.
-- Mirrors the policies from the 'documents' bucket.

-- Allow authenticated users to upload files to the 'workshops' bucket
CREATE POLICY "Allow authenticated uploads to workshops" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'workshops');

-- Allow owners or admins to view/download files
CREATE POLICY "Allow owner or admin select workshops" ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'workshops' AND
    (auth.uid() = owner OR public.is_admin(auth.uid()))
  );

-- Allow owners or admins to update files
CREATE POLICY "Allow owner or admin update workshops" ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'workshops' AND
    (auth.uid() = owner OR public.is_admin(auth.uid()))
  );

-- Allow owners or admins to delete files
CREATE POLICY "Allow owner or admin delete workshops" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'workshops' AND
    (auth.uid() = owner OR public.is_admin(auth.uid()))
  );

-- Allow any authenticated user to read (SELECT) objects from the 'workshops' bucket
CREATE POLICY "Allow authenticated read access to workshops"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'workshops' AND
  auth.role() = 'authenticated'
);