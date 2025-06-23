-- Add gallery support to user_introduction table
-- Add arrays to store multiple image URLs for each column

-- Add gallery image arrays for left and right columns
ALTER TABLE user_introduction
ADD COLUMN IF NOT EXISTS left_column_gallery_urls text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS right_column_gallery_urls text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS left_column_gallery_titles text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS right_column_gallery_titles text[] DEFAULT '{}';

-- Add comments for documentation
COMMENT ON COLUMN user_introduction.left_column_gallery_urls IS 'Array of image URLs for left column gallery';
COMMENT ON COLUMN user_introduction.right_column_gallery_urls IS 'Array of image URLs for right column gallery';
COMMENT ON COLUMN user_introduction.left_column_gallery_titles IS 'Array of titles/captions for left column gallery images';
COMMENT ON COLUMN user_introduction.right_column_gallery_titles IS 'Array of titles/captions for right column gallery images';
