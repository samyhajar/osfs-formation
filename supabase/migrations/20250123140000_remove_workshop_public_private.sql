-- Migration: Remove public/private functionality from workshops
-- Description: Remove is_public column and simplify RLS policies

-- Drop ALL existing policies first (including old ones that reference is_public)
DROP POLICY IF EXISTS "Users can view workshop files if they can view the parent workshop" ON public.workshop_files;
DROP POLICY IF EXISTS "Workshop owners and admins can add files" ON public.workshop_files;
DROP POLICY IF EXISTS "Workshop owners and admins can update files" ON public.workshop_files;
DROP POLICY IF EXISTS "Workshop owners and admins can delete files" ON public.workshop_files;
DROP POLICY IF EXISTS "Authenticated users can view all workshop files" ON public.workshop_files;
DROP POLICY IF EXISTS "Authenticated users can insert workshop files" ON public.workshop_files;
DROP POLICY IF EXISTS "Authenticated users can update workshop files" ON public.workshop_files;
DROP POLICY IF EXISTS "Authenticated users can delete workshop files" ON public.workshop_files;

-- Drop workshop table policies that might reference is_public
DROP POLICY IF EXISTS "Public workshops are visible to authenticated users" ON public.workshops;
DROP POLICY IF EXISTS "Authenticated users can view all workshops" ON public.workshops;
DROP POLICY IF EXISTS "Authenticated users can insert workshops" ON public.workshops;
DROP POLICY IF EXISTS "Authenticated users can update workshops" ON public.workshops;
DROP POLICY IF EXISTS "Authenticated users can delete workshops" ON public.workshops;

-- Now remove the is_public column from the workshops table
ALTER TABLE public.workshops DROP COLUMN IF EXISTS is_public;

-- Drop more workshop policies that might exist
DROP POLICY IF EXISTS "Editors and admins can create workshops" ON public.workshops;
DROP POLICY IF EXISTS "Workshop owners, editors, and admins can update workshops" ON public.workshops;
DROP POLICY IF EXISTS "Workshop owners, editors, and admins can delete workshops" ON public.workshops;
DROP POLICY IF EXISTS "Authenticated users can view workshops" ON public.workshops;

-- Create simplified policies for workshops table
-- All authenticated users can view workshops
CREATE POLICY "Authenticated users can view workshops" ON public.workshops
    FOR SELECT
    USING (auth.role() = 'authenticated');

-- Editors and admins can create workshops
CREATE POLICY "Editors and admins can create workshops" ON public.workshops
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid()
            AND p.role IN ('admin', 'editor')
        )
    );

-- Workshop owners, editors, and admins can update workshops
CREATE POLICY "Workshop owners, editors, and admins can update workshops" ON public.workshops
    FOR UPDATE
    USING (
        created_by = auth.uid()
        OR EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid()
            AND p.role IN ('admin', 'editor')
        )
    );

-- Workshop owners, editors, and admins can delete workshops
CREATE POLICY "Workshop owners, editors, and admins can delete workshops" ON public.workshops
    FOR DELETE
    USING (
        created_by = auth.uid()
        OR EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid()
            AND p.role IN ('admin', 'editor')
        )
    );

-- Create simplified policies for workshop_files
-- All authenticated users can view workshop files
CREATE POLICY "Authenticated users can view workshop files" ON public.workshop_files
    FOR SELECT
    USING (auth.role() = 'authenticated');

-- Workshop owners, editors, and admins can add files
CREATE POLICY "Workshop owners, editors, and admins can add files" ON public.workshop_files
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.workshops w
            WHERE w.id = workshop_files.workshop_id
            AND (
                w.created_by = auth.uid()
                OR EXISTS (
                    SELECT 1 FROM public.profiles p
                    WHERE p.id = auth.uid()
                    AND p.role IN ('admin', 'editor')
                )
            )
        )
    );

-- Workshop owners, editors, and admins can update files
CREATE POLICY "Workshop owners, editors, and admins can update files" ON public.workshop_files
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.workshops w
            WHERE w.id = workshop_files.workshop_id
            AND (
                w.created_by = auth.uid()
                OR EXISTS (
                    SELECT 1 FROM public.profiles p
                    WHERE p.id = auth.uid()
                    AND p.role IN ('admin', 'editor')
                )
            )
        )
    );

-- Workshop owners, editors, and admins can delete files
CREATE POLICY "Workshop owners, editors, and admins can delete files" ON public.workshop_files
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.workshops w
            WHERE w.id = workshop_files.workshop_id
            AND (
                w.created_by = auth.uid()
                OR EXISTS (
                    SELECT 1 FROM public.profiles p
                    WHERE p.id = auth.uid()
                    AND p.role IN ('admin', 'editor')
                )
            )
        )
    );