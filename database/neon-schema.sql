-- Vipulasena Pathirajage blog: database tables for Neon Postgres
-- Run this once in the Neon SQL Editor. It is safe to run again.
-- Photos, preview images and PDFs are kept in file storage;
-- these tables store their web addresses (image_url, doc_url).

-- Articles for Education, General thoughts and Children's books
create table if not exists articles (
  id          uuid primary key default gen_random_uuid(),
  section     text not null check (section in ('education', 'general', 'kids')),
  title_en    text not null,
  desc_en     text not null default '',
  title_si    text not null default '',
  desc_si     text not null default '',
  image_url   text not null default '',     -- preview image
  doc_url     text not null default '',     -- PDF or link to the document
  published   boolean not null default true,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists articles_section_order on articles (section, sort_order);

-- Media albums
create table if not exists albums (
  id          text primary key,             -- used in the address, e.g. #album-workshops
  title_en    text not null,
  desc_en     text not null default '',
  title_si    text not null default '',
  desc_si     text not null default '',
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Photos inside albums (the first photo is the album cover)
create table if not exists photos (
  id          uuid primary key default gen_random_uuid(),
  album_id    text not null references albums (id) on delete cascade,
  image_url   text not null,
  caption_en  text not null default '',
  caption_si  text not null default '',
  ratio       real not null default 1.333,  -- width / height, for the gallery layout
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);
create index if not exists photos_album_order on photos (album_id, sort_order);

-- Questions sent from the "Ask a question" form (read only in the admin)
create table if not exists questions (
  id          uuid primary key default gen_random_uuid(),
  name        text not null default '',
  contact     text not null default '',
  question    text not null check (length(question) between 2 and 3000),
  language    text not null default 'en' check (language in ('en', 'si')),
  answered    boolean not null default false,
  created_at  timestamptz not null default now()
);
create index if not exists questions_inbox on questions (answered, created_at desc);

-- Visits, for the visitor counter and the admin overview
create table if not exists visits (
  id          bigint generated always as identity primary key,
  visitor_id  text not null,                -- random id kept in the visitor's browser
  page        text not null default '',
  visited_at  timestamptz not null default now()
);
create index if not exists visits_visitor on visits (visitor_id);

create or replace view visit_totals as
  select count(distinct visitor_id) as visitors,
         count(*)                   as page_visits
  from visits;

-- People allowed to use the admin area (filled in once the login is set up)
create table if not exists site_admins (
  user_id     text primary key,
  email       text not null,
  added_at    timestamptz not null default now()
);

-- Keep updated_at current when an article or album is edited
create or replace function touch_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end
$$;

drop trigger if exists articles_touch on articles;
create trigger articles_touch before update on articles
  for each row execute function touch_updated_at();

drop trigger if exists albums_touch on albums;
create trigger albums_touch before update on albums
  for each row execute function touch_updated_at();
