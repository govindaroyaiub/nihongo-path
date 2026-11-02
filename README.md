# Nihongo Path

A guided, anime-style path from zero Japanese to JLPT N4, framed as a journey across Japan:
each unit is an "episode" at a real place (Shibuya → Akihabara → … → Mt. Fuji) with its history,
famous sites, a travel reading in Japanese, and a goshuin stamp to collect. Every lesson teaches
before it tests, and every learned item feeds a spaced-repetition review.
It installs as a PWA and saves progress on the device, with no account.

**Live demo:** [nihongo-path-nine.vercel.app](https://nihongo-path-nine.vercel.app)

## The course

| Stage | What you learn |
|-------|----------------|
| Kana | Hiragana and katakana, 13 lessons each, from vowels up to combinations |
| N5 Units 1–12 | ~630 words, 101 kanji, ~80 grammar points, a reading, a listening and a travel reading per unit |
| Places | 14 journey stops with history, sites, fun facts, a stamp book and a Japan map (`src/content/places/`) |
| N5 exam prep | Timed mock tests in the JLPT format *(in progress)* |
| N4 Units 13+ | Builds on N5 *(next)* |

Each unit is one file, `src/content/n5/unit-NN.json`. Lessons are generated from it in a fixed rhythm
(words → grammar → words → … → kanji → reading → listening → checkpoint). The checkpoint
needs 80% to unlock the next unit.

The design spec is in `docs/superpowers/specs/2026-11-01-n5-n4-path-design.md`, and the N5 syllabus is in
`docs/superpowers/specs/n5-syllabus.md`.

## Run locally

```bash
npm install
npm run dev
```

## Voice

The app plays pre-recorded neural clips from `public/audio/` when they exist, and otherwise falls back to the
best Japanese voice the browser has. You can change the fallback voice in Settings.

Generate the clips (Google Cloud Text-to-Speech, Neural2 voices; the whole course fits in the free tier):

```bash
GOOGLE_TTS_KEY=your-key npm run audio
```

Re-running only generates clips for new or changed sentences. `npm run audio -- --dry` counts them without
generating anything.

## Content checks

```bash
npm run validate
```

This checks every unit for missing furigana, broken drills, out-of-range answers, duplicate ids and words
repeated across units.

```bash
npm test
```

The answer-key test answers every question with its own correct answer, typed several realistic ways
("noto" / "no-to" for ノート, "ji" for ぢ), and fails if the app would mark it wrong or offers two
options that sound the same. `npm run build` runs both checks before building.

## Deploy

Vercel: import the repo, framework preset **Vite**. Docker: `docker build -t nihongo-path .`
(nginx serves `dist/`, with SPA fallback).

## Tech

React 19 + Vite, Tailwind CSS, React Router, wanakana (romaji → kana typing), lucide-react,
`vite-plugin-pwa`.
