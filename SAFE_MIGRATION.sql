-- SAFE MIGRATION: Handle existing policies gracefully

-- 1. Create the images storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'images',
  'images',
  false,
  52428800, -- 50MB in bytes
  ARRAY['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO NOTHING;

-- 2. Enable RLS on the storage.objects table
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. Drop existing policies if they exist (ignore errors if they don't exist)
DROP POLICY IF EXISTS "Admins can upload to images bucket" ON storage.objects;
DROP POLICY IF EXISTS "Admins can read from images bucket" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update images in images bucket" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete from images bucket" ON storage.objects;
DROP POLICY IF EXISTS "Public can view images" ON storage.objects;

-- 4. Create fresh policies
CREATE POLICY "Admins can upload to images bucket"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'images'
  AND is_admin()
);

CREATE POLICY "Admins can read from images bucket"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'images'
  AND is_admin()
);

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

CREATE POLICY "Admins can delete from images bucket"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'images'
  AND is_admin()
);

CREATE POLICY "Public can view images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'images');

-- 5. Add image fields to user_introduction table (safe with IF NOT EXISTS equivalent)
DO $$
BEGIN
    -- Add columns only if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_introduction' AND column_name = 'left_column_image_url') THEN
        ALTER TABLE public.user_introduction ADD COLUMN left_column_image_url TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_introduction' AND column_name = 'left_column_image_position') THEN
        ALTER TABLE public.user_introduction ADD COLUMN left_column_image_position VARCHAR(10) DEFAULT 'above' CHECK (left_column_image_position IN ('above', 'below'));
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_introduction' AND column_name = 'right_column_image_url') THEN
        ALTER TABLE public.user_introduction ADD COLUMN right_column_image_url TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_introduction' AND column_name = 'right_column_image_position') THEN
        ALTER TABLE public.user_introduction ADD COLUMN right_column_image_position VARCHAR(10) DEFAULT 'above' CHECK (right_column_image_position IN ('above', 'below'));
    END IF;
END $$;

-- 6. Add comments for clarity
COMMENT ON COLUMN public.user_introduction.left_column_image_url IS 'URL path to the image in the images storage bucket for left column';
COMMENT ON COLUMN public.user_introduction.left_column_image_position IS 'Position of image relative to text: above or below';
COMMENT ON COLUMN public.user_introduction.right_column_image_url IS 'URL path to the image in the images storage bucket for right column';
COMMENT ON COLUMN public.user_introduction.right_column_image_position IS 'Position of image relative to text: above or below';