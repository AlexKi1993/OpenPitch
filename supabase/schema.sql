-- OpenPitch.eu Database Schema
-- Run this in the Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- PROFILES
-- ============================================
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  bio text,
  avatar_url text,
  website text,
  skills text[] default '{}',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by everyone" on public.profiles
  for select using (true);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================
-- TAGS
-- ============================================
create table public.tags (
  id uuid default uuid_generate_v4() primary key,
  name text not null unique,
  slug text not null unique,
  color text not null default '#6366f1'
);

alter table public.tags enable row level security;

create policy "Tags are viewable by everyone" on public.tags
  for select using (true);

-- Insert default tags
insert into public.tags (name, slug, color) values
  ('SaaS', 'saas', '#6366f1'),
  ('E-Commerce', 'e-commerce', '#f59e0b'),
  ('FinTech', 'fintech', '#10b981'),
  ('HealthTech', 'healthtech', '#ef4444'),
  ('EdTech', 'edtech', '#3b82f6'),
  ('GreenTech', 'greentech', '#22c55e'),
  ('Social Impact', 'social-impact', '#ec4899'),
  ('AI / ML', 'ai-ml', '#8b5cf6'),
  ('Hardware', 'hardware', '#f97316'),
  ('Marketplace', 'marketplace', '#14b8a6'),
  ('Mobile App', 'mobile-app', '#06b6d4'),
  ('Developer Tools', 'developer-tools', '#64748b'),
  ('Other', 'other', '#9ca3af');

-- ============================================
-- IDEAS
-- ============================================
create table public.ideas (
  id uuid default uuid_generate_v4() primary key,
  author_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  slug text not null unique,
  summary text not null,
  description text not null,
  problem text not null default '',
  solution text not null default '',
  target_audience text not null default '',
  category text not null default 'Other',
  status text not null default 'open' check (status in ('open', 'in_progress', 'implemented', 'archived')),
  vote_count int not null default 0,
  comment_count int not null default 0,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.ideas enable row level security;

create policy "Ideas are viewable by everyone" on public.ideas
  for select using (true);

create policy "Authenticated users can create ideas" on public.ideas
  for insert with check (auth.uid() = author_id);

create policy "Users can update own ideas" on public.ideas
  for update using (auth.uid() = author_id);

create policy "Users can delete own ideas" on public.ideas
  for delete using (auth.uid() = author_id);

-- Index for search
create index ideas_title_idx on public.ideas using gin (to_tsvector('german', title || ' ' || summary || ' ' || description));
create index ideas_category_idx on public.ideas (category);
create index ideas_status_idx on public.ideas (status);
create index ideas_created_at_idx on public.ideas (created_at desc);
create index ideas_vote_count_idx on public.ideas (vote_count desc);

-- ============================================
-- IDEA_TAGS
-- ============================================
create table public.idea_tags (
  idea_id uuid references public.ideas(id) on delete cascade,
  tag_id uuid references public.tags(id) on delete cascade,
  primary key (idea_id, tag_id)
);

alter table public.idea_tags enable row level security;

create policy "Idea tags are viewable by everyone" on public.idea_tags
  for select using (true);

create policy "Idea authors can manage tags" on public.idea_tags
  for insert with check (
    exists (select 1 from public.ideas where id = idea_id and author_id = auth.uid())
  );

create policy "Idea authors can delete tags" on public.idea_tags
  for delete using (
    exists (select 1 from public.ideas where id = idea_id and author_id = auth.uid())
  );

-- ============================================
-- VOTES
-- ============================================
create table public.votes (
  id uuid default uuid_generate_v4() primary key,
  idea_id uuid references public.ideas(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamptz default now() not null,
  unique(idea_id, user_id)
);

alter table public.votes enable row level security;

create policy "Votes are viewable by everyone" on public.votes
  for select using (true);

create policy "Authenticated users can vote" on public.votes
  for insert with check (auth.uid() = user_id);

create policy "Users can remove own votes" on public.votes
  for delete using (auth.uid() = user_id);

-- Trigger to update vote count
create or replace function public.update_vote_count()
returns trigger as $$
begin
  if TG_OP = 'INSERT' then
    update public.ideas set vote_count = vote_count + 1 where id = new.idea_id;
    return new;
  elsif TG_OP = 'DELETE' then
    update public.ideas set vote_count = vote_count - 1 where id = old.idea_id;
    return old;
  end if;
end;
$$ language plpgsql security definer;

create trigger on_vote_change
  after insert or delete on public.votes
  for each row execute procedure public.update_vote_count();

-- ============================================
-- COMMENTS
-- ============================================
create table public.comments (
  id uuid default uuid_generate_v4() primary key,
  idea_id uuid references public.ideas(id) on delete cascade not null,
  author_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.comments enable row level security;

create policy "Comments are viewable by everyone" on public.comments
  for select using (true);

create policy "Authenticated users can comment" on public.comments
  for insert with check (auth.uid() = author_id);

create policy "Users can update own comments" on public.comments
  for update using (auth.uid() = author_id);

create policy "Users can delete own comments" on public.comments
  for delete using (auth.uid() = author_id);

-- Trigger to update comment count
create or replace function public.update_comment_count()
returns trigger as $$
begin
  if TG_OP = 'INSERT' then
    update public.ideas set comment_count = comment_count + 1 where id = new.idea_id;
    return new;
  elsif TG_OP = 'DELETE' then
    update public.ideas set comment_count = comment_count - 1 where id = old.idea_id;
    return old;
  end if;
end;
$$ language plpgsql security definer;

create trigger on_comment_change
  after insert or delete on public.comments
  for each row execute procedure public.update_comment_count();

-- ============================================
-- COLLABORATORS
-- ============================================
create table public.collaborators (
  id uuid default uuid_generate_v4() primary key,
  idea_id uuid references public.ideas(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  role text not null default 'developer',
  message text not null default '',
  status text not null default 'pending' check (status in ('pending', 'accepted', 'rejected')),
  created_at timestamptz default now() not null,
  unique(idea_id, user_id)
);

alter table public.collaborators enable row level security;

create policy "Collaborators are viewable by everyone" on public.collaborators
  for select using (true);

create policy "Authenticated users can apply" on public.collaborators
  for insert with check (auth.uid() = user_id);

create policy "Idea authors can update collaborator status" on public.collaborators
  for update using (
    exists (select 1 from public.ideas where id = idea_id and author_id = auth.uid())
  );

create policy "Users can withdraw own applications" on public.collaborators
  for delete using (auth.uid() = user_id);
