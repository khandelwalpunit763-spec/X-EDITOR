-- X-EDITOR Supabase Schema
-- Isko Supabase Dashboard -> SQL Editor me paste karke Run karo

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- profiles table (auto-created via trigger on auth.users)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default now()
);

-- projects table - har project ka data (layers + tracks + timeline)
create table if not exists projects (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  type text check (type in ('photo','video')) not null,
  width int not null,
  height int not null,
  fps int default 30,
  aspect_ratio text,
  background jsonb,
  data jsonb, -- { layers, tracks, currentTime }
  thumbnail text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- templates table
create table if not exists templates (
  id text primary key,
  user_id uuid references auth.users(id) on delete set null,
  title text not null,
  category text not null,
  preview_image text not null,
  width int not null,
  height int not null,
  type text check (type in ('photo','video')) not null,
  tags text[] default '{}',
  is_public boolean default true,
  likes int default 0,
  downloads int default 0,
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table profiles enable row level security;
alter table projects enable row level security;
alter table templates enable row level security;

-- Policies: profiles
create policy "Public profiles are viewable by everyone" on profiles for select using (true);
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- Policies: projects
create policy "Users can view own projects" on projects for select using (auth.uid() = user_id);
create policy "Users can insert own projects" on projects for insert with check (auth.uid() = user_id);
create policy "Users can update own projects" on projects for update using (auth.uid() = user_id);
create policy "Users can delete own projects" on projects for delete using (auth.uid() = user_id);
-- Public read for collab (invite link)
create policy "Anyone can view project by id for collab" on projects for select using (true);

-- Policies: templates
create policy "Templates are viewable by everyone" on templates for select using (true);
create policy "Authenticated users can insert templates" on templates for insert with check (auth.role() = 'authenticated');
create policy "Users can update own templates" on templates for update using (auth.uid() = user_id);
create policy "Users can delete own templates" on templates for delete using (auth.uid() = user_id);

-- Trigger to auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Storage buckets (create via Dashboard -> Storage, or via SQL)
-- Bucket: project-thumbnails (public), template-previews (public), project-exports (private via user_id)
-- You can create them manually in Dashboard -> Storage -> New Bucket

-- Realtime enabled for projects and templates (Dashboard -> Database -> Realtime -> Enable)
alter publication supabase_realtime add table projects;
alter publication supabase_realtime add table templates;
