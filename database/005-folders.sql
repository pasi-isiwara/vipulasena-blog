-- Folders, so articles in a section can be grouped.
--
-- Added 2026-11-22 for Education, which had grown enough articles to want
-- grouping. The table carries a section column so the other sections can be
-- opened up later without a migration; only Education offers folders in the
-- admin for now.
--
-- A folder is one level deep: it holds articles, not other folders.
-- An article may sit in a folder or directly in its section, so nothing has
-- to be filed before it shows up.
--
-- Run after neon-schema.sql. It is safe to run again.

create table if not exists folders (
  id          text primary key,             -- used in the address, e.g. /education/practical-work
  section     text not null check (section in ('education', 'general', 'kids')),
  title_en    text not null,
  desc_en     text not null default '',
  title_si    text not null default '',
  desc_si     text not null default '',
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists folders_section_order on folders (section, sort_order);

-- Removing a folder leaves its articles in the section rather than deleting
-- them: losing a folder should never lose the writing inside it.
alter table articles
  add column if not exists folder_id text references folders (id) on delete set null;

create index if not exists articles_folder_order on articles (folder_id, sort_order);

drop trigger if exists folders_touch on folders;
create trigger folders_touch before update on folders
  for each row execute function touch_updated_at();
