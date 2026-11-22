-- Removes the sample content, so the site starts empty and real articles,
-- albums and photos can be added through the admin area.
--
-- Run once, when you are ready to put real content in. It is safe to run
-- again: there is simply nothing left to remove.
--
-- This does NOT touch admin accounts, questions or the visitor counter.
-- Photos are removed from the database only: any files already uploaded to
-- blob storage have to be deleted from there separately, which the admin
-- area does for you when you delete a photo through it.

begin;

delete from photos;
delete from albums;
delete from articles;

commit;
