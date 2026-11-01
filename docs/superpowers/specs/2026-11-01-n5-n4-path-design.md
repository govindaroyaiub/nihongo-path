# Nihongo Path v2 — Zero to JLPT N4

## Goal

Take a learner with zero Japanese to JLPT N4 level through one guided path: N5 first, then N4.
Every lesson teaches before it tests, every learned item feeds a spaced-repetition review, and
each level ends with JLPT-style mock exams.

## Structure (hybrid)

- **Learn (path)** — the main road. Level → Stage → Unit → Lessons. Lessons unlock in order.
- **Review** — SRS queue of everything learned so far, mixed exercise types.
- **Practice** — free area: kana charts, word/kanji/grammar library (learned items only), exam prep.
- **Settings** — voice, speed, furigana, romaji, reset.

### Curriculum

```
N5
  Kana stage
    Unit K1 Hiragana   (rows あ…わ, dakuten, handakuten, combos — 10 lessons)
    Unit K2 Katakana   (same shape, plus long vowel ー / small ッ notes)
  Units 1–12           (themed: self-intro, things, time, routine, shopping, adjectives,
                        location, family, te-form, plain form, experiences, comparisons)
  N5 Exam prep         (mock tests)
N4
  Units 13–26          (built after N5 content is done)
  N4 Exam prep
```

Each unit is one content file (`src/content/<level>/unit-NN.json`) holding its vocab, kanji,
grammar points, a reading passage and a listening dialogue. Lessons are **generated** from the
unit file in a fixed interleave so every unit has the same rhythm:

`Vocab 1 → Grammar 1 → Vocab 2 → Grammar 2 → Kanji 1 → … → Reading → Listening → Checkpoint`

Vocab lessons hold 8 words, kanji lessons 5 kanji, one grammar point per grammar lesson.
A unit unlocks when the previous unit's checkpoint is passed (≥ 80%).

### Lesson flow

1. **Teach** — one card per item: big text, furigana, meaning, audio auto-play, example sentence.
   Grammar gets an explanation screen (pattern, meaning, notes, examples).
2. **Practice** — 2 exercises per item, generated from the item type, wrong answers re-queued
   at the end of the lesson.
3. **Result** — accuracy, items added to Review.

### Exercise types

| Item     | Exercises                                                               |
|----------|-------------------------------------------------------------------------|
| Kana     | char → romaji, sound → char, type romaji                                |
| Vocab    | word → meaning, meaning → word, sound → word, type reading (romaji → kana) |
| Kanji    | kanji → meaning, kanji word → reading                                   |
| Grammar  | authored drills: choose the missing part, put words in order           |
| Reading  | passage + comprehension questions                                       |
| Listening| dialogue audio (text hidden until answered) + questions                 |

## Content schema

Japanese text uses inline furigana markup: `私[わたし]は学生[がくせい]です。`
(a kanji run followed by its reading in brackets). The renderer turns it into `<ruby>`; the voice
reads the kana form so readings are always correct.

```jsonc
{
  "id": "n5-u01", "level": "N5", "number": 1,
  "title": "Hello, nice to meet you", "goal": "Introduce yourself and ask simple questions.",
  "vocab":   [{ "id": "n5-u01-v01", "word": "私[わたし]", "meaning": "I, me", "pos": "pronoun",
                "example": { "jp": "私[わたし]は学生[がくせい]です。", "en": "I am a student." } }],
  "kanji":   [{ "id": "n5-u01-k01", "char": "一", "meanings": ["one"], "on": ["イチ"], "kun": ["ひと-"],
                "strokes": 1, "mnemonic": "…", "words": [{ "word": "一[ひと]つ", "meaning": "one (thing)" }] }],
  "grammar": [{ "id": "n5-u01-g01", "title": "は — topic marker", "pattern": "A は B です",
                "meaning": "A is B", "explanation": "…", "notes": ["…"],
                "examples": [{ "jp": "…", "en": "…" }],
                "drills": [{ "type": "choice", "jp": "私[わたし]＿学生[がくせい]です。", "answer": "は",
                             "options": ["は","を","に","の"], "en": "I am a student." },
                           { "type": "order", "tokens": ["私[わたし]は","学生[がくせい]","です"], "en": "…" }] }],
  "reading":   { "title": "…", "text": "…", "en": "…", "questions": [{ "q": "…", "options": [], "answer": 0 }] },
  "listening": { "title": "…", "lines": [{ "speaker": "A", "jp": "…", "en": "…" }],
                 "questions": [{ "q": "…", "options": [], "answer": 0 }] }
}
```

## Voice

Two layers, so audio is good everywhere and great where clips exist:

1. **Pre-generated clips** — `scripts/generate-audio.mjs` collects every Japanese string from the
   content, hashes it, and writes `public/audio/<hash>.mp3` plus `public/audio/manifest.json`.
   Engines are pluggable: `google` (Neural2/WaveNet voices, needs `GOOGLE_TTS_KEY`, free tier covers
   the whole course) or `say` (macOS, offline, lower quality). Clips are cached on demand by the
   service worker, not precached.
2. **Fallback** — Web Speech API with a ranked voice pick (Google 日本語, O-ren/Kyoko Enhanced,
   Microsoft Nanami/Ayumi), user-selectable in Settings, with normal / slow speed.

## Progress & storage

Device-local (`localStorage`), as today. New keys (`np2:*`) so the old flashcard progress doesn't
clash: `np2:lessons` (completed lessons + best score), `np2:srs` (SM-2 rows keyed by item id),
`np2:log` (daily activity for streaks), `np2:settings`.

## Exam prep (after N5 content)

Timed mock exams per level in the three real JLPT sections — 言語知識 (文字・語彙),
言語知識 (文法)・読解, 聴解 — drawing questions from the level's content in JLPT question formats
(kanji reading, orthography, context word, paraphrase, sentence grammar, star-ordering, short
passages, task/point listening). Score per section with a pass estimate.

## Build order

1. Engine (content loader, lesson generator, exercise generator, progress) + voice layer.
2. New UI: Path, Lesson player, Review, Practice, Settings.
3. N5 content: kana stage + units 1–12.
4. N5 exam prep.
5. N4 content (units 13–26) + N4 exam prep.
6. End-to-end tests (requested at the end of the project).

## Non-goals (for now)

Accounts/sync, handwriting recognition, stroke-order animation, speech recognition.
