-- Migration: Simplify workshop permissions
-- Description: Grants all authenticated users full permissions (insert, select, update, delete) for workshops

-- ===============================
-- 1. Workshops table RLS policies
-- ===============================

-- First, drop all existing workshop table policies
DROP POLICY IF EXISTS "Admins can view all workshops" ON public.workshops;
DROP POLICY IF EXISTS "Admins can insert workshops" ON public.workshops;
DROP POLICY IF EXISTS "Admins can update workshops" ON public.workshops;
DROP POLICY IF EXISTS "Admins can delete workshops" ON public.workshops;
DROP POLICY IF EXISTS "Workshop owners can view their workshops" ON public.workshops;
DROP POLICY IF EXISTS "Workshop owners can update their workshops" ON public.workshops;
DROP POLICY IF EXISTS "Workshop owners can delete their workshops" ON public.workshops;
DROP POLICY IF EXISTS "Public workshops are visible to authenticated users" ON public.workshops;
DROP POLICY IF EXISTS "Editors and admins can create workshops" ON public.workshops;
DROP POLICY IF EXISTS "Editors can view all workshops" ON public.workshops;

-- Create new simplified policies for the workshops table
-- Any authenticated user can select, insert, update, delete
CREATE POLICY "Authenticated users can view all workshops" ON public.workshops
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert workshops" ON public.workshops
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update workshops" ON public.workshops
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete workshops" ON public.workshops
  FOR DELETE
  TO authenticated
  USING (true);

-- ===================================
-- 2. Workshop files table RLS policies
-- ===================================

-- Drop existing workshop files policies
DROP POLICY IF EXISTS "Users can view workshop files if they can view the parent workshop" ON public.workshop_files;
DROP POLICY IF EXISTS "Workshop owners and admins can add files" ON public.workshop_files;
DROP POLICY IF EXISTS "Workshop owners and admins can update files" ON public.workshop_files;
DROP POLICY IF EXISTS "Workshop owners and admins can delete files" ON public.workshop_files;

-- Create new simplified policies for workshop_files table
CREATE POLICY "Authenticated users can view all workshop files" ON public.workshop_files
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert workshop files" ON public.workshop_files
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update workshop files" ON public.workshop_files
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete workshop files" ON public.workshop_files
  FOR DELETE
  TO authenticated
  USING (true);

-- ===================================
-- 3. Workshops storage bucket policies
-- ===================================

-- First disable RLS temporarily to allow policy changes
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- Drop all existing workshop-related storage policies
DROP POLICY IF EXISTS "Admin Workshop Full Access" ON storage.objects;
DROP POLICY IF EXISTS "Formee Workshop Read Access" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads to workshops" ON storage.objects;
DROP POLICY IF EXISTS "Allow owner or admin select workshops" ON storage.objects;
DROP POLICY IF EXISTS "Allow owner or admin update workshops" ON storage.objects;
DROP POLICY IF EXISTS "Allow owner or admin delete workshops" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated read access to workshops" ON storage.objects;
DROP POLICY IF EXISTS "workshops_authenticated_uploads" ON storage.objects;
DROP POLICY IF EXISTS "workshops_owner_admin_select" ON storage.objects;
DROP POLICY IF EXISTS "workshops_owner_admin_update" ON storage.objects;
DROP POLICY IF EXISTS "workshops_owner_admin_delete" ON storage.objects;
DROP POLICY IF EXISTS "workshops_editor_read_access" ON storage.objects;
DROP POLICY IF EXISTS "workshop_files_user_read_policy" ON storage.objects;
DROP POLICY IF EXISTS "workshop_files_upload_policy" ON storage.objects;
DROP POLICY IF EXISTS "workshop_files_admin_owner_select_policy" ON storage.objects;
DROP POLICY IF EXISTS "workshop_files_admin_owner_update_policy" ON storage.objects;
DROP POLICY IF EXISTS "workshop_files_admin_owner_delete_policy" ON storage.objects;
DROP POLICY IF EXISTS "workshop_files_editor_read_policy" ON storage.objects;
DROP POLICY IF EXISTS "workshop_files_editor_admin_upload_policy" ON storage.objects;

-- Create new simplified storage policies for workshops bucket
-- Any authenticated user can insert
CREATE POLICY "workshops_authenticated_insert" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'workshops');

-- Any authenticated user can select
CREATE POLICY "workshops_authenticated_select" ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'workshops');

-- Any authenticated user can update
CREATE POLICY "workshops_authenticated_update" ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'workshops');

-- Any authenticated user can delete
CREATE POLICY "workshops_authenticated_delete" ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'workshops');

-- Re-enable RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;