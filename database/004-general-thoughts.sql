-- "Academic posts" was renamed to "General thoughts" on 2026-11-22.
-- The section each article belongs to is renamed with it, so the value in the
-- database matches the name on the website and the /general-thoughts address.
-- Run after neon-schema.sql. It is safe to run again.

-- The old constraint has to go before any row can hold the new value, and the
-- new one can only be added once every row already satisfies it.
alter table articles drop constraint if exists articles_section_check;

update articles set section = 'general' where section = 'academic';

alter table articles add constraint articles_section_check
  check (section in ('education', 'general', 'kids'));
