-- Adds the "contested" verdict and moves two entries into it.
--
-- Run once in the Supabase SQL editor, AFTER 001-remove-borrowed-verdict.sql.
-- (New databases created from schema.sql don't need it.)
-- It runs as one transaction: if anything fails, nothing changes.

begin;

-- Rebuild the verdict type with "contested" in its place in the list.
-- (Adding an enum value in place can't be used in the same transaction,
-- so swap the type instead, the same way 001 did.)
alter type verdict rename to verdict_old;
create type verdict as enum ('misattributed', 'paraphrased', 'contested', 'unverified', 'accurate');
alter table entries alter column verdict type verdict using verdict::text::verdict;
drop type verdict_old;

update entries
set verdict = 'contested'
where slug in ('god-helps-those-who-help-themselves', 'standing-on-the-shoulders-of-giants');

commit;
