-- Migration: Allow authenticated users to insert into documents table
-- Description: Adds an RLS policy to permit authenticated users to add new rows to the public.documents table.

CREATE POLICY "Allow authenticated insert" ON public.documents
  FOR INSERT
  TO authenticated
  WITH CHECK (true);