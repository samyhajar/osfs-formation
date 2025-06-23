-- Migration: Remove public/private functionality from documents
-- Description: Remove is_public column from documents table if it exists

-- Remove the is_public column from the documents table (if it exists)
-- Note: This column may have already been removed in a previous migration
ALTER TABLE public.documents DROP COLUMN IF EXISTS is_public;