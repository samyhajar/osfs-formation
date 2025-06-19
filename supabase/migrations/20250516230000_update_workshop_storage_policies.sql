-- First, disable RLS to allow policy changes
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- Drop existing policies for the workshops bucket
DROP POLICY IF EXISTS "Admin Workshop Full Access" ON storage.objects;
DROP POLICY IF EXISTS "Formee Workshop Read Access" ON storage.objects;
DROP POLICY IF EXISTS "workshops_authenticated_uploads" ON storage.objects;
DROP POLICY IF EXISTS "workshops_owner_admin_select" ON storage.objects;
DROP POLICY IF EXISTS "workshops_owner_admin_update" ON storage.objects;
DROP POLICY IF EXISTS "workshops_owner_admin_delete" ON storage.objects;
DROP POLICY IF EXISTS "workshops_editor_read_access" ON storage.objects;

-- Create the standard policies for the workshops bucket with unique names
CREATE POLICY "workshop_files_upload_policy" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'workshops');

CREATE POLICY "workshop_files_admin_owner_select_policy" ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'workshops' AND
    (auth.uid() = owner OR public.is_admin(auth.uid()))
  );

CREATE POLICY "workshop_files_admin_owner_update_policy" ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'workshops' AND
    (auth.uid() = owner OR public.is_admin(auth.uid()))
  );

CREATE POLICY "workshop_files_admin_owner_delete_policy" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'workshops' AND
    (auth.uid() = owner OR public.is_admin(auth.uid()))
  );

-- Add editor read access policy with unique name
CREATE POLICY "workshop_files_editor_read_policy" ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'workshops' AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'editor'
    )
  );

-- Re-enable RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;