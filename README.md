# Vipulasena Pathirajage: personal blog

Bilingual (English / Sinhala) blog for **Vipulasena Pathirajage** (BSc, PGDE, MA),
former Director of Science Education, Ministry of Education, Sri Lanka.

Next.js (App Router) · Neon Postgres · Auth.js with username and password · Vercel Blob · Vercel.

---

## Setting it up

### 1. Install

```bash
npm install
cp .env.example .env.local
```

### 2. Neon

Create a project at [console.neon.tech](https://console.neon.tech) and copy the
**pooled** connection string into `DATABASE_URL` in `.env.local`. Then:

```bash
npm run db:schema    # creates the tables
npm run db:migrate   # the later changes: question rate limit, admin login
npm run db:seed      # optional: the sample articles and albums
```

### 3. The admin account

Sign-in is a username and password kept in the `site_admins` table. There is no
sign-up form: an account can only be made from the command line.

```bash
npx auth secret          # writes AUTH_SECRET into .env.local
npm run admin:add        # asks for a username and password
```

The password is typed hidden, so it never reaches the shell history or any file.
Only a scrypt hash of it is stored, with its own random salt.

```bash
npm run admin:list                 # who can sign in
npm run admin:add -- vipulasena    # change that account's password
npm run admin:remove -- olduser    # take an account away
```

A password must be at least 10 characters and contain a number. After 10 wrong
passwords in 15 minutes an account stops accepting sign-ins, right password
included, until the 15 minutes are up.

### 4. File storage

Uploaded photos and PDFs go to **Vercel Blob**. On Vercel, add a Blob store to the
project and `BLOB_READ_WRITE_TOKEN` is set for you. To upload while developing
locally, copy that token into `.env.local`.

### 5. Run

```bash
npm run dev        # http://localhost:3000
npm run build      # production build
npm run lint
npm run typecheck
```

---

## How it is put together

| Path | What it is |
|---|---|
| `app/layout.tsx` | The page shell: fonts, language and theme, header, footer |
| `app/page.tsx`, `app/home-content.tsx` | Home: introduction, collection cards, citation notice, question form |
| `app/education`, `app/academic-posts`, `app/childrens-books` | The three article pages, one `TopicPage` each |
| `app/media`, `app/media/[album]` | Albums, and the photos in one album with the lightbox |
| `app/admin` | The admin area, its sign-in and its server actions |
| `app/api/questions`, `app/api/visits` | The question form and the visitor counter |
| `lib/queries.ts` | Every database query, in one place |
| `lib/auth.ts`, `lib/password.ts` | Sign-in, and scrypt password hashing |
| `lib/i18n.ts`, `lib/i18n-si.json` | All user-facing text. The Sinhala file is generated — see below |
| `lib/prefs.tsx` | Language and theme, shared by the client components |
| `components/art/` | The hand-drawn SVG artwork, one component per drawing |
| `reference/` | The original single-file prototype, kept for comparison |
| `database/` | The SQL to create the tables and seed sample content |
| `scripts/` | Small build and setup helpers |

### Language and theme

Both are kept in cookies (`vp-lang`, `vp-theme`) and read on the server, so the
first paint is already in the right language and the right theme — no flash, and
no swapping text after the page loads. Switching is instant in the browser
because every page is given both languages' text up front.

Pages are rendered per request: the language comes from a cookie and the content
from the database, so there is nothing to prerender. Admin changes call
`revalidatePath`, so the public pages update as soon as something is saved.

### Generated files

Two files are generated rather than written by hand, so the prototype's artwork
and the already-drafted Sinhala are carried over exactly:

```bash
node scripts/extract-i18n.mjs   # lib/i18n-si.json, from the prototype's dictionaries
node scripts/build-home.mjs     # app/home-content.tsx, from the prototype's home markup
```

Both read from `reference/`. Edit the script, not the generated file.

---

## Still to do

- **Sinhala review.** The translations were drafted by Claude and need a native
  speaker to check them, especially the official job titles.
- **Real content.** The articles and albums from `seed-sample-content.sql` are
  placeholders, to be replaced through the admin area.
- **Spam protection** on the question form. It is rate-limited to five questions
  an hour per sender; adding Cloudflare Turnstile would be the next step if
  spam becomes a problem.
- **Domain**, and `AUTH_URL` set to it in the production environment.

## Content rules from the client

- The introduction comes first, the collections below it. The name stays small;
  the photo is small and square with a gold offset frame.
- The phone number and email appear **only** in the "Ask a question" section.
- Questions are **private to the author** and are never shown to other visitors.
- All content is free to use with citation.
- Media is about **life today**, not past career photos.
