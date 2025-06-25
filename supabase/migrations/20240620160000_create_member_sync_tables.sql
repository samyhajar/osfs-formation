-- Migration: Create tables for synced WordPress member data
-- Creates two tables to cache WordPress data for faster queries in the app.

-- 1. formation_personnel ----------------------------------------------------
create table if not exists public.formation_personnel (
  wp_id integer primary key,
  name text not null,
  slug text not null,
  email text,
  profile_image text,
  bio text,
  deceased boolean not null default false,
  positions jsonb not null,
  active_positions jsonb not null,
  total_active integer not null,
  last_synced timestamptz not null default now()
);

-- 2. confreres_in_formation --------------------------------------------------
create table if not exists public.confreres_in_formation (
  wp_id integer primary key,
  name text not null,
  slug text not null,
  email text,
  profile_image text,
  bio text,
  deceased boolean not null default false,
  status text,
  positions jsonb not null,
  total_active integer not null default 0,
  last_synced timestamptz not null default now()
);

-- Enable Row-Level Security --------------------------------------------------
alter table public.formation_personnel enable row level security;
alter table public.confreres_in_formation enable row level security;

-- Allow public (anon) read-only access. Writes are restricted to service role.
create policy "Public read formation_personnel" on public.formation_personnel
  for select to public using (true);

create policy "Public read confreres_in_formation" on public.confreres_in_formation
  for select to public using (true);