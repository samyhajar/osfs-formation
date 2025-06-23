-- Add metadata columns to workshop_files table
ALTER TABLE public.workshop_files
ADD COLUMN IF NOT EXISTS region TEXT,
ADD COLUMN IF NOT EXISTS language TEXT,
ADD COLUMN IF NOT EXISTS author TEXT,
ADD COLUMN IF NOT EXISTS topics TEXT[],
ADD COLUMN IF NOT EXISTS keywords TEXT[];