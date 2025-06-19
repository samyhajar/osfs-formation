# 🚨 URGENT: Fix RLS Policy Error

## The Problem

You're getting this error: `Upload failed: new row violates row-level security policy`

This means the `images` storage bucket either doesn't exist or doesn't have proper policies configured.

## 🔧 SOLUTION: Run These SQL Commands

### STEP 1: Create Storage Bucket and Policies

**Go to your Supabase Dashboard → SQL Editor and run this:**

```sql
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
CREATE POLICY "Public can view images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'images');
```

### STEP 2: Add Image Fields to Database

**Run this second SQL command:**

```sql
-- Add image fields and position controls to user_introduction table
ALTER TABLE public.user_introduction ADD COLUMN left_column_image_url TEXT;
ALTER TABLE public.user_introduction ADD COLUMN left_column_image_position VARCHAR(10) DEFAULT 'above' CHECK (left_column_image_position IN ('above', 'below'));
ALTER TABLE public.user_introduction ADD COLUMN right_column_image_url TEXT;
ALTER TABLE public.user_introduction ADD COLUMN right_column_image_position VARCHAR(10) DEFAULT 'above' CHECK (right_column_image_position IN ('above', 'below'));

-- Add comments for clarity
COMMENT ON COLUMN public.user_introduction.left_column_image_url IS 'URL path to the image in the images storage bucket for left column';
COMMENT ON COLUMN public.user_introduction.left_column_image_position IS 'Position of image relative to text: above or below';
COMMENT ON COLUMN public.user_introduction.right_column_image_url IS 'URL path to the image in the images storage bucket for right column';
COMMENT ON COLUMN public.user_introduction.right_column_image_position IS 'Position of image relative to text: above or below';
```

## ✅ After Running Both SQL Commands

1. **Refresh your admin page**: `/en/dashboard/admin/admin`
2. **Try uploading an image**: The RLS error should be gone
3. **Verify the bucket**: Go to Storage in Supabase Dashboard to see the `images` bucket

## 🎯 What These Commands Do

- **Creates** the `images` storage bucket with 50MB limit
- **Sets up RLS policies** so admins can upload/manage images
- **Allows public viewing** of images (needed for displaying them)
- **Adds database columns** for image URLs and position controls

## 🚀 Features Now Available

✅ **Image Upload**: Both left and right columns can have images  
✅ **Position Control**: Choose "Above Text" or "Below Text"  
✅ **Image Preview**: See uploaded images with delete button  
✅ **Secure Storage**: Images stored in organized folder structure

## 🔍 Troubleshooting

If you still get errors:

1. **Check your role**: Make sure you're logged in as an admin
2. **Verify bucket**: Go to Storage → images bucket should exist
3. **Check policies**: The RLS policies should be listed in Storage settings
