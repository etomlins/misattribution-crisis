-- Removes the "borrowed" verdict.
--
-- Run once in the Supabase SQL editor on a database set up before this change.
-- (New databases created from schema.sql don't need it.)
-- It runs as one transaction: if anything fails, nothing changes.

begin;

-- Move the only borrowed entry (Newton, "shoulders of giants") to accurate:
-- he did write it; the findings explain that the idea is older.
update entries
set verdict = 'accurate', actual_author = 'Isaac Newton'
where slug = 'standing-on-the-shoulders-of-giants' and verdict = 'borrowed';

-- Anything else still marked borrowed becomes unverified, to be reviewed by hand.
update entries set verdict = 'unverified' where verdict = 'borrowed';

-- Postgres can't drop a value from an enum, so swap in a new type.
alter type verdict rename to verdict_old;
create type verdict as enum ('misattributed', 'paraphrased', 'unverified', 'accurate');
alter table entries alter column verdict type verdict using verdict::text::verdict;
drop type verdict_old;

commit;
