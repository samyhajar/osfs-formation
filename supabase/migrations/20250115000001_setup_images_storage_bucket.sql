-- Create the images storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'images',
  'images',
  false,
  52428800, -- 50MB in bytes
  ARRAY['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on the storage.objects table (it should already be enabled)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy: Allow admins to upload images to the images bucket
CREATE POLICY "Admins can upload to images bucket"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'images'
  AND is_admin()
);

-- Policy: Allow admins to read images from the images bucket
CREATE POLICY "Admins can read from images bucket"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'images'
  AND is_admin()
);

-- Policy: Allow admins to update images in the images bucket
CREATE POLICY "Admins can update images in images bucket"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'images'
  AND is_admin()
)
WITH CHECK (
  bucket_id = 'images'
  AND is_admin()
);

-- Policy: Allow admins to delete images from the images bucket
CREATE POLICY "Admins can delete from images bucket"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'images'
  AND is_admin()
);

-- Policy: Allow public read access to images (for displaying them)
-- This is needed so that the images can be displayed on the public pages
CREATE POLICY "Public can view images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'images');