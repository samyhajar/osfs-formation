-- Add file_path and file_url columns to workshops table
ALTER TABLE public.workshops
ADD COLUMN file_path TEXT,
ADD COLUMN file_url TEXT;