# Nihongo Path

A mobile-first Japanese learning app: hiragana, katakana, grammar, vocabulary and kanji,
each with flashcards + quizzes scheduled by a simple SM-2 (Anki-style) spaced repetition
algorithm. Accounts are real (Supabase Auth, email + password), installable as a PWA so it
feels native on your phone.

**Live demo:** [nihongo-path-nine.vercel.app](https://nihongo-path-nine.vercel.app)

## Demo access

To explore the app without registering, sign in with the shared demo account:

| Email             | Password   |
| ----------------- | ---------- |
| `govinda@admin.com` | `password` |

> This is a read-and-explore demo account for reviewers. Please don't rely on it for saving
> personal progress — anyone with these credentials shares the same account. To keep your own
> progress separate, register a fresh account from the **Sign up** screen.

## 1. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com) (or use an existing one).
2. Open **SQL Editor** in your project dashboard, paste the contents of
   [`supabase/schema.sql`](supabase/schema.sql), and run it. This creates two tables:
   - `progress` — one row per card per user, tracking SM-2 scheduling state
     (`ease_factor`, `interval_days`, `next_review_date`, `status`, correct/incorrect counts).
   - `study_log` — one row per day studied, used to compute your streak on the home screen.
   Row Level Security is scoped to `auth.uid()`, so each account only ever sees its own rows.

   **Already ran the old single-user version of this schema?** Don't run `schema.sql` again —
   use [`supabase/migrate-to-auth.sql`](supabase/migrate-to-auth.sql) instead, after registering
   your first account in the app (it walks you through reassigning your existing data to that
   account's real user id).
3. In **Project Settings → API**, copy your **Project URL** and **anon public** key.
4. Optional: in **Authentication → Providers → Email**, "Confirm email" is on by default —
   registering will require clicking a link sent to that address before you can log in. Turn it
   off there if you'd rather skip that step for a personal project.
5. Run [`supabase/add-admin-and-settings.sql`](supabase/add-admin-and-settings.sql) — adds a
   `profiles` table (per-user admin flag) and an `app_settings` table (the global "registration
   open/closed" switch you control from the in-app Admin page). After registering your own
   account, run the one-time bootstrap query at the bottom of that file (with your email) to
   make yourself admin — this can only be done via SQL, on purpose, so no one can grant
   themselves admin through the app.

## 2. Run locally

```bash
npm install
cp .env.example .env
# edit .env and paste in your Supabase URL + anon key
npm run dev
```

Open the printed local URL. For phone testing on your local network, run `npm run dev -- --host`
and open `http://<your-computer-ip>:5173` from your phone's browser (same Wi-Fi network).

## 3. Deploy to Vercel

1. Push this project to a GitHub repo.
2. In Vercel, **Add New Project** → import the repo. Framework preset: **Vite** (auto-detected).
3. Under **Environment Variables**, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy. Vercel builds with `npm run build` and serves the `dist` folder automatically.

## 4. Install on your phone

Open the deployed URL in Safari (iOS) or Chrome (Android) → **Share → Add to Home Screen**
(iOS) or the install prompt (Android/Chrome). The app installs with its own icon and opens
full-screen without browser chrome.

## How it works

- **Accounts**: `src/context/AuthContext.jsx` wraps the app with Supabase Auth (email + password).
  `src/components/RequireAuth.jsx` redirects signed-out visitors to `/login`; `/register` creates
  a new account. Every `progress`/`study_log` row is tagged with the real authenticated user id,
  so multiple people can use the same deployment with fully separate progress.
- **Content**: each module's cards live in `src/data/*.json` — plain arrays you can edit or
  extend directly (add a new hiragana variant, more grammar points, more kanji, etc.) without
  touching any code.
- **Scheduling**: `src/lib/sm2.js` implements SM-2. Swiping a flashcard right (or answering a
  quiz question correctly) counts as quality 5; left/incorrect counts as quality 2. Ease factor,
  interval, and next review date update per the standard SM-2 formula.
- **Reset Progress** (per module) permanently deletes that module's `progress` rows in Supabase —
  you restart from zero.
- **Redo Module** sets `next_review_date` to today for all of that module's cards without
  touching ease factor or correct/incorrect counts — useful for a refresher pass.
- **Streak** counts consecutive calendar days with at least one review, read from `study_log`.

## Tech stack

React + Vite, Tailwind CSS, React Router, lucide-react icons, Supabase (`@supabase/supabase-js`),
`vite-plugin-pwa` for the installable manifest + service worker.
# nihongo-path
