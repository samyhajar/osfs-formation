-- Migration: Add province column to confreres_in_formation table
-- Adds a new nullable text column `province` so we can query/filter without parsing JSON on every request.
-- -----------------------------------------------------------------------------

alter table public.confreres_in_formation
  add column if not exists province text;

comment on column public.confreres_in_formation.province is
  'Current province for the confrere – extracted from the first item in `positions` array';

-- Optional back-fill for existing rows.
-- This copies the province string from the first object inside the positions JSON array
-- (only if the row does not already have a province value).

update public.confreres_in_formation
set    province = positions -> 0 ->> 'province'
where  province is null;