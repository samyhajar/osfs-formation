-- Migration: Remove is_public column from documents table
-- Description: Since all documents are now visible to all authenticated users, the is_public column is no longer needed

-- Remove the is_public column from the documents table
ALTER TABLE public.documents DROP COLUMN IF EXISTS is_public;

