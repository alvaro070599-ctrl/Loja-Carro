-- Loja K Motors: banco e segurança no Supabase
-- Execute este arquivo no SQL Editor do seu projeto Supabase.
create extension if not exists pgcrypto;

create table if not exists public.vehicles (
  id uuid primary key default gen_random_uuid(),
  brand text not null,
  model text not null,
  version text not null default '',
  year integer not null check (year between 1950 and 2099),
  km integer not null default 0 check (km >= 0),
  price numeric(12,2) not null check (price >= 0),
  fuel text not null default 'Flex',
  transmission text not null default 'Manual',
  color text not null default '',
  description text not null default '',
  photos text[] not null default '{}',
  featured boolean not null default false,
  active boolean not null default true,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.vehicles enable row level security;
drop policy if exists "Public can view active vehicles" on public.vehicles;
create policy "Public can view active vehicles" on public.vehicles for select using (active = true or auth.uid() = created_by);
drop policy if exists "Authenticated admins can insert vehicles" on public.vehicles;
create policy "Authenticated admins can insert vehicles" on public.vehicles for insert to authenticated with check (auth.uid() = created_by);
drop policy if exists "Owners can update vehicles" on public.vehicles;
create policy "Owners can update vehicles" on public.vehicles for update to authenticated using (auth.uid() = created_by) with check (auth.uid() = created_by);
drop policy if exists "Owners can delete vehicles" on public.vehicles;
create policy "Owners can delete vehicles" on public.vehicles for delete to authenticated using (auth.uid() = created_by);

-- Storage: bucket público para as fotos dos veículos.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('vehicle-photos', 'vehicle-photos', true, 8388608, array['image/jpeg','image/png','image/webp','image/avif'])
on conflict (id) do update set public = true, file_size_limit = 8388608, allowed_mime_types = array['image/jpeg','image/png','image/webp','image/avif'];

drop policy if exists "Public can view vehicle photos" on storage.objects;
create policy "Public can view vehicle photos" on storage.objects for select using (bucket_id = 'vehicle-photos');
drop policy if exists "Authenticated users upload their own vehicle photos" on storage.objects;
create policy "Authenticated users upload their own vehicle photos" on storage.objects for insert to authenticated with check (bucket_id = 'vehicle-photos' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "Authenticated users update their own vehicle photos" on storage.objects;
create policy "Authenticated users update their own vehicle photos" on storage.objects for update to authenticated using (bucket_id = 'vehicle-photos' and (storage.foldername(name))[1] = auth.uid()::text) with check (bucket_id = 'vehicle-photos' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "Authenticated users delete their own vehicle photos" on storage.objects;
create policy "Authenticated users delete their own vehicle photos" on storage.objects for delete to authenticated using (bucket_id = 'vehicle-photos' and (storage.foldername(name))[1] = auth.uid()::text);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;
drop trigger if exists vehicles_updated_at on public.vehicles;
create trigger vehicles_updated_at before update on public.vehicles for each row execute procedure public.set_updated_at();

-- IMPORTANTE: crie a conta administradora em Authentication > Users no Supabase.
-- Para que a conta possa administrar todos os veículos, use a conta criada para cadastrar
-- cada veículo (a política usa created_by). Se precisar de vários administradores,
-- configure uma tabela/claim de admins antes de ampliar as políticas.
