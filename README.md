# Nihongo Path

A mobile-first Japanese learning app: hiragana, katakana, grammar, vocabulary and kanji,
each with flashcards + quizzes scheduled by a simple SM-2 (Anki-style) spaced repetition
algorithm. No account needed — progress is saved on your device, and it installs as a PWA so
it feels native on your phone.

**Live demo:** [nihongo-path-nine.vercel.app](https://nihongo-path-nine.vercel.app)

## 1. Run locally

```bash
npm install
npm run dev
```

Open the printed local URL. For phone testing on your local network, run `npm run dev -- --host`
and open `http://<your-computer-ip>:5173` from your phone's browser (same Wi-Fi network).

## 2. Deploy to Vercel

1. Push this project to a GitHub repo.
2. In Vercel, **Add New Project** → import the repo. Framework preset: **Vite** (auto-detected).
3. Deploy. Vercel builds with `npm run build` and serves the `dist` folder automatically.

## 3. Install on your phone

Open the deployed URL in Safari (iOS) or Chrome (Android) → **Share → Add to Home Screen**
(iOS) or the install prompt (Android/Chrome). The app installs with its own icon and opens
full-screen without browser chrome.

## How it works

- **Storage**: `src/lib/store.js` keeps SM-2 progress and the study log in `localStorage`.
  Progress belongs to that browser on that device — clearing site data resets it, and it
  doesn't sync between devices.
- **Content**: each module's cards live in `src/data/*.json` — plain arrays you can edit or
  extend directly (add a new hiragana variant, more grammar points, more kanji, etc.) without
  touching any code.
- **Scheduling**: `src/lib/sm2.js` implements SM-2. Swiping a flashcard right (or answering a
  quiz question correctly) counts as quality 5; left/incorrect counts as quality 2. Ease factor,
  interval, and next review date update per the standard SM-2 formula.
- **Reset Progress** (per module) permanently deletes that module's saved progress —
  you restart from zero.
- **Redo Module** sets `next_review_date` to today for all of that module's cards without
  touching ease factor or correct/incorrect counts — useful for a refresher pass.
- **Streak** counts consecutive calendar days with at least one review, read from the study log.

## Tech stack

React + Vite, Tailwind CSS, React Router, lucide-react icons,
`vite-plugin-pwa` for the installable manifest + service worker.
# nihongo-path
