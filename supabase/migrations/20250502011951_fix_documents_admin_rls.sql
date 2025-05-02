-- Fix RLS policies on documents table for admins
-- Replace subquery checks with is_admin() helper function to prevent read-only transaction errors.

-- Drop existing admin policies
DROP POLICY IF EXISTS "Admins can view all documents" ON public.documents;
DROP POLICY IF EXISTS "Admins can insert documents" ON public.documents;
DROP POLICY IF EXISTS "Admins can update documents" ON public.documents;
DROP POLICY IF EXISTS "Admins can delete documents" ON public.documents;

-- Recreate admin policies using the is_admin() helper function
CREATE POLICY "Admins can view all documents" ON public.documents
  FOR SELECT
  USING (public.is_admin() = true);

CREATE POLICY "Admins can insert documents" ON public.documents
  FOR INSERT
  WITH CHECK (public.is_admin() = true);

CREATE POLICY "Admins can update documents" ON public.documents
  FOR UPDATE
  USING (public.is_admin() = true);

CREATE POLICY "Admins can delete documents" ON public.documents
  FOR DELETE
  USING (public.is_admin() = true);