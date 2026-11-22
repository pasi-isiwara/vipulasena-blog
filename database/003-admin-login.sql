-- Username and password sign-in for the admin area.
-- Replaces the Google sign-in the site was first built with.
-- Run after neon-schema.sql. It is safe to run again.

-- site_admins now holds the login itself. The password is never stored:
-- password_hash holds a scrypt hash with its own random salt.
alter table site_admins add column if not exists username      text;
alter table site_admins add column if not exists password_hash text not null default '';
alter table site_admins add column if not exists display_name  text not null default '';

-- An email address is no longer needed to sign in.
alter table site_admins alter column email set default '';

-- Usernames are compared without regard to case, and must be unique.
create unique index if not exists site_admins_username
  on site_admins (lower(username));

-- Failed sign-ins, so an account can be locked after repeated wrong guesses.
create table if not exists admin_login_attempts (
  id           bigint generated always as identity primary key,
  username     text not null,
  succeeded    boolean not null default false,
  attempted_at timestamptz not null default now()
);
create index if not exists admin_login_attempts_recent
  on admin_login_attempts (lower(username), attempted_at desc);
