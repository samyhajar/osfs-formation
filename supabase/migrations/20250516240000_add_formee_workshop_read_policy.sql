-- Migration: Add storage policy for users to read workshop files
-- Description: Adds a policy allowing users to read files from the workshops bucket

-- Add user read access policy
CREATE POLICY "workshop_files_user_read_policy" ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'workshops' AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'user'
    )
  );