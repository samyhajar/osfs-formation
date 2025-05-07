-- Migration: Add storage policy for formees to read workshop files
-- Description: Adds a policy allowing formees to read files from the workshops bucket

-- Add formee read access policy
CREATE POLICY "workshop_files_formee_read_policy" ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'workshops' AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'formee'
    )
  );