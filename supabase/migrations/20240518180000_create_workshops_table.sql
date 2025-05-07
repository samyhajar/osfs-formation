-- Migration: Create workshops table
-- Description: Adds a workshops table for managing workshop folders and metadata, with RLS policies mirroring the documents table.

CREATE TABLE IF NOT EXISTS public.workshops (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL, -- The name of the workshop (serves as the folder name)
  description TEXT,
  folder_path TEXT NOT NULL UNIQUE,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_by_name TEXT NOT NULL,
  region TEXT,
  language TEXT,
  topics TEXT[],
  keywords TEXT[],
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.workshops ENABLE ROW LEVEL SECURITY;

-- Admins can view and manage all workshops
CREATE POLICY "Admins can view all workshops" ON public.workshops
  FOR SELECT
  USING (auth.jwt()->>'role' = 'admin');

CREATE POLICY "Admins can insert workshops" ON public.workshops
  FOR INSERT
  WITH CHECK (auth.jwt()->>'role' = 'admin');

CREATE POLICY "Admins can update workshops" ON public.workshops
  FOR UPDATE
  USING (auth.jwt()->>'role' = 'admin');

CREATE POLICY "Admins can delete workshops" ON public.workshops
  FOR DELETE
  USING (auth.jwt()->>'role' = 'admin');

-- Workshop owners can view and manage their own workshops
CREATE POLICY "Workshop owners can view their workshops" ON public.workshops
  FOR SELECT
  USING (auth.uid() = created_by);

CREATE POLICY "Workshop owners can update their workshops" ON public.workshops
  FOR UPDATE
  USING (auth.uid() = created_by);

CREATE POLICY "Workshop owners can delete their workshops" ON public.workshops
  FOR DELETE
  USING (auth.uid() = created_by);

-- Public workshops are visible to all authenticated users
CREATE POLICY "Public workshops are visible to authenticated users" ON public.workshops
  FOR SELECT
  USING (is_public = true AND auth.role() = 'authenticated');

-- Add updated_at trigger
CREATE TRIGGER set_workshops_updated_at
  BEFORE UPDATE ON public.workshops
  FOR EACH ROW
  EXECUTE FUNCTION public.set_current_timestamp_updated_at();