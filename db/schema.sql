-- The Misattribution Crisis: database schema
--
-- Run this once on a fresh database (Supabase SQL editor, or `npm run db:setup`).
-- Every table has row level security turned on with NO policies, which means
-- Supabase's public API (anon key) can't read or write anything. Only the
-- site's own server, connecting with the database password, can.

create type verdict as enum ('misattributed', 'paraphrased', 'contested', 'unverified', 'accurate');
create type entry_status as enum ('draft', 'published');
create type source_kind as enum ('evidence', 'spreading');
create type submission_status as enum ('pending', 'approved', 'rejected');

-- People a quote gets credited to ("Mark Twain", "The Bible").
create table people (
  id bigint generated always as identity primary key,
  name text not null unique,
  slug text not null unique,
  created_at timestamptz not null default now()
);

-- One investigated quote. Only rows with status = 'published' appear on the site.
create table entries (
  id bigint generated always as identity primary key,
  slug text not null unique,
  quote text not null,                 -- the quote as it circulates
  verdict verdict not null,
  status entry_status not null default 'draft',
  actual_author text,                  -- who really said it, if known
  earliest_known text,                 -- free text: '1894', 'c. 1159'
  first_attributed text,               -- when it got pinned on the famous name
  original_text text,                  -- the real wording, kept short
  original_citation text,              -- where the real wording comes from
  findings text not null default '',   -- your write-up; blank line = new paragraph
  submitted_by text,                   -- credit name, if it came from a submission
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  search tsvector generated always as (
    setweight(to_tsvector('english', coalesce(quote, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(actual_author, '') || ' ' || coalesce(original_text, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(findings, '')), 'C')
  ) stored
);
create index entries_search_idx on entries using gin (search);
create index entries_published_idx on entries (status, created_at desc);

-- Which people an entry is credited to (often several).
create table attributions (
  entry_id bigint not null references entries (id) on delete cascade,
  person_id bigint not null references people (id) on delete restrict,
  position smallint not null default 0,
  primary key (entry_id, person_id)
);
create index attributions_person_idx on attributions (person_id);

-- Links and citations. 'evidence' backs up the finding;
-- 'spreading' is a place that repeats the misquote.
create table sources (
  id bigint generated always as identity primary key,
  entry_id bigint not null references entries (id) on delete cascade,
  kind source_kind not null,
  label text not null,
  url text,
  position smallint not null default 0
);
create index sources_entry_idx on sources (entry_id);

-- What people send through the form. Never shown on the site.
create table submissions (
  id bigint generated always as identity primary key,
  quote text not null,
  credited_to text not null,
  actual_author text,
  evidence text not null,
  seen_at text,
  notes text,
  email text,
  credit_name text,
  status submission_status not null default 'pending',
  ip_hash text,                        -- salted hash, used only for rate limiting
  created_at timestamptz not null default now()
);
create index submissions_status_idx on submissions (status, created_at desc);
create index submissions_ip_idx on submissions (ip_hash, created_at desc);

-- Keep updated_at current whenever an entry changes.
create function set_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end
$$;
create trigger entries_set_updated_at
  before update on entries
  for each row execute function set_updated_at();

-- Lock everything down from Supabase's public API.
alter table people enable row level security;
alter table entries enable row level security;
alter table attributions enable row level security;
alter table sources enable row level security;
alter table submissions enable row level security;
