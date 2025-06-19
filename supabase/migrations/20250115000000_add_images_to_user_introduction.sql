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