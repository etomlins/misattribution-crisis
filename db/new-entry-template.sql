-- Template for publishing a new entry. Paste into the Supabase SQL editor,
-- fill in the values, and run. Everything happens in one go, so a typo
-- won't leave a half-made entry behind.
--
-- Verdicts: misattributed | paraphrased | borrowed | unverified | accurate
-- Use status 'draft' to save it without publishing.
-- In SQL, write an apostrophe inside text as two: 'don''t'. Or use curly ’ quotes.

with new_entry as (
  insert into entries (slug, quote, verdict, status, actual_author, earliest_known,
                       first_attributed, original_text, original_citation, findings, submitted_by)
  values (
    'well-behaved-women-example',          -- slug: the end of the web address, /q/<slug>
    'The quote as it circulates.',
    'misattributed',
    'published',
    'Who actually said it',                -- or null
    '1976',                                -- or null
    null,                                  -- first_attributed, or null
    null,                                  -- original_text, or null
    null,                                  -- original_citation, or null
    'Your findings. Leave a blank line between paragraphs.',
    null                                   -- submitter's credit name, or null
  )
  returning id
),
credited as (
  -- Everyone the quote is credited to, in order.
  insert into people (name, slug)
  values ('Mark Twain', 'mark-twain')
  on conflict (name) do update set name = excluded.name
  returning id, name
),
links as (
  insert into attributions (entry_id, person_id, position)
  select new_entry.id, credited.id, 0 from new_entry, credited
)
insert into sources (entry_id, kind, label, url, position)
select new_entry.id, s.kind::source_kind, s.label, s.url, s.position
from new_entry, (values
  ('evidence',  'Quote Investigator', 'https://quoteinvestigator.com/...', 0),
  ('spreading', 'Goodreads',          'https://www.goodreads.com/...',     1)
) as s(kind, label, url, position);

-- Then mark the submission it came from as approved, if any:
-- update submissions set status = 'approved' where id = 123;
