-- Remove single image columns from user_introduction table since we're now using only galleries
ALTER TABLE user_introduction
DROP COLUMN IF EXISTS left_column_image_url,
DROP COLUMN IF EXISTS left_column_image_position,
DROP COLUMN IF EXISTS right_column_image_url,
DROP COLUMN IF EXISTS right_column_image_position;

