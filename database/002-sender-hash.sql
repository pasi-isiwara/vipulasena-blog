-- Rate limiting for the "Ask a question" form.
-- Adds a one-way hash of the sender's address to each question, so repeated
-- sends can be counted without storing anyone's IP address in the clear.
-- Run after neon-schema.sql. It is safe to run again.

alter table questions
  add column if not exists sender_hash text not null default '';

create index if not exists questions_sender_recent
  on questions (sender_hash, created_at desc);
