# The Misattribution Crisis

A running log of misattributed quotes: who gets the credit, who actually said it, and the sources to prove it.

Built with Next.js 16 and Postgres. Hosted on Vercel, database on Supabase, CAPTCHA by Cloudflare Turnstile. All three have free tiers that cover a site this size.

---

## Run it on your computer

You need Node.js 20 or newer.

```bash
npm install
cp .env.example .env.local
npm run db:local        # leave this running: a local Postgres with your starter entries
```

In a second terminal:

```bash
npm run dev             # http://localhost:3000
```

The local database lives in the `.pglite` folder. Delete that folder to start over from the starter entries. Locally the CAPTCHA is off, and the form says so.

To try the admin pages locally, put `ADMIN_PASSWORD=` plus any 12+ character password in `.env.local`, restart `npm run dev`, and go to http://localhost:3000/admin.

---

## Going live

### 1. Database (Supabase)

1. Create a free project at supabase.com. Save the database password it asks you to set.
2. Open the project's **Connect** panel and copy the **Transaction pooler** connection string (port `6543`). Put your password into it.
3. Load the tables and starter entries from your computer:

   ```bash
   DATABASE_URL="<that connection string>" npm run db:setup
   ```

   It creates the tables, then loads the entries from `db/seed-data.ts`. It never deletes anything and skips steps that are already done, so running it twice is harmless.

Every table has row level security on with no policies. That means Supabase's public API can't read or write anything; only the site's server can, using the connection string. Don't add policies unless you mean to open something up.

### 2. CAPTCHA (Cloudflare Turnstile)

In the Cloudflare dashboard, add a Turnstile widget for your domain (and `localhost` if you want to test it locally). You get a **site key** and a **secret key**.

### 3. Hosting (Vercel)

1. Push this folder to a GitHub repository.
2. In Vercel, import the repository. It detects Next.js automatically.
3. Add these environment variables before the first deploy:

   | Name | Value |
   |---|---|
   | `DATABASE_URL` | The Supabase transaction pooler string |
   | `TURNSTILE_SITE_KEY` | Turnstile site key |
   | `TURNSTILE_SECRET_KEY` | Turnstile secret key |
   | `IP_HASH_SALT` | Any long random string |
   | `NEXT_PUBLIC_SITE_URL` | Your site's address, e.g. `https://yourdomain.com` |

4. Deploy. After that, every push to GitHub redeploys.

If the Turnstile secret is missing on the live site, the form refuses all submissions rather than letting unchecked ones through.

### 4. Email alerts for new submissions (optional)

1. Sign up at resend.com with the email address you want alerts sent to, and create an API key.
2. In Vercel, add `RESEND_API_KEY` (the key) and `NOTIFY_EMAIL` (your address), then redeploy.

Each new submission then emails you the quote, credit and evidence. Hitting Reply goes to the submitter, if they left an email. Until you verify your own domain in Resend, alerts come from Resend's test sender, which can only email the address you signed up with. That's fine, since that's you. If an email ever fails, the submission is still saved; check the `submissions` table.

### 5. Admin password

In Vercel, add `ADMIN_PASSWORD`: a password of at least 12 characters that only you know (a password manager can make one). Redeploy, then log in at `/admin`. Until it's set, `/admin` stays locked.

To log out everywhere (say you logged in on a shared computer), change `ADMIN_PASSWORD` and redeploy. Every existing login stops working.

### 6. Domain

Buy a domain and add it under the Vercel project's Domains settings. Then update `NEXT_PUBLIC_SITE_URL`.

---

## Running the site day to day

Everything is done at **`/admin`** on the live site. Changes show up immediately; there's nothing to rebuild.

**Reviewing submissions.** The Inbox lists pending submissions (you also get an email for each one, if alerts are on). Open one to see everything they sent. Then either:
- **Write up as entry**: opens the entry form already filled in from the submission (quote, who it's credited to, their links, their credit name). Do your research, write your findings, pick a verdict, and save. Saving marks the submission approved.
- **Reject**: moves it to the Rejected tab. Nothing is deleted, so you can move it back to pending.

Submissions are never shown publicly.

**Publishing an entry.** Under Entries, open one (or start a New entry), set Status to **Published** and save. Set it back to **Draft** to take it off the site.

**Editing.** Any entry can be edited the same way. Its "Updated" date on the site changes automatically.

**Drafts.** Your unfinished log items (Voltaire, Marie Antoinette, Disraeli and so on) were loaded as drafts. Find them under Entries → Drafts.

Supabase's Table Editor and `db/new-entry-template.sql` still work too, if you ever want to fix something in bulk.

### How the data fits together

| Table | What's in it |
|---|---|
| `entries` | One investigated quote: the quote, verdict, who actually said it, findings, `draft` or `published` |
| `people` | Everyone a quote gets credited to |
| `attributions` | Links entries to the people they're credited to (often several) |
| `sources` | Links per entry: `evidence` (backs the finding) or `spreading` (repeats the misquote) |
| `submissions` | What visitors send. Private. |

The five verdicts are `misattributed`, `paraphrased`, `contested`, `unverified` and `accurate`. Their public definitions are in `src/lib/verdicts.ts`.

### Updating an existing database

When the schema changes after you've set up Supabase, the change comes as a numbered file in `db/migrations/`. Paste it into the Supabase SQL editor and run it once. Each file is a single transaction: it either fully applies or changes nothing.

Run them in order; each one expects the ones before it.

- `001-remove-borrowed-verdict.sql`: removes the Borrowed verdict and moves the Newton entry to Accurate.
- `002-add-contested-verdict.sql`: adds the Contested verdict and moves "God helps those who help themselves" and Newton's "shoulders of giants" into it.

---

## Spam protection on the submit form

1. **Honeypot:** a hidden field people never see. If a bot fills it in, the submission is quietly dropped.
2. **CAPTCHA:** Cloudflare Turnstile, checked on the server, not just in the browser.
3. **Rate limit:** at most 5 submissions per hour from one connection. IP addresses are stored only as a salted hash.
4. **Review:** everything lands as `pending`. Nothing reaches the site without you.

---

## Still to fill in

- `src/lib/site.ts`: `CONTACT_EMAIL`, once you have one for the site.
- `src/app/info/page.tsx`: the "Who runs it" section.
- `src/app/how-i-verify/page.tsx`: draft copy, so rewrite it in your own words.
- `db/seed-data.ts`: the verdicts on the starter entries are a first pass. Check them before launch, or fix them in Supabase after.

## Where things are

```
db/schema.sql              tables, search index, row level security
db/seed-data.ts            starter entries from the original quote log
db/new-entry-template.sql  paste-and-fill SQL for publishing an entry
scripts/setup.mts          npm run db:setup  (tables + starter entries)
scripts/local-db.mts       npm run db:local  (local Postgres)
src/lib/data.ts            every database read the site does
src/app/submit/actions.ts  the submit form's server-side checks
src/app/admin/             the admin pages (inbox, entry editor, login)
src/lib/admin-data.ts      every database read and write the admin does
src/app/globals.css        all the styling
```

## Notes for later

- Pages read the database on every request, so edits are instant. If traffic ever grows, the reads in `src/lib/data.ts` can be cached with Next.js's `'use cache'` directive.
