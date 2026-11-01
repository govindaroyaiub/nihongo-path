# Places — content schema

Each journey stop has one file: `src/content/places/<unitId>.json` (e.g. `n5-u03.json`).
The app shows it as a place card, a travel-reading lesson, a goshuin stamp and a map pin.

```jsonc
{
  "unitId": "n5-u03",
  "place": "Asakusa",
  "jp": "浅草[あさくさ]",            // furigana markup, as in unit files
  "prefecture": "Tokyo",
  "region": "Kantō",
  "lat": 35.7148, "lng": 139.7967,   // real coordinates, 4 decimals
  "tagline": "Tokyo's old downtown, home of its oldest temple",   // ≤ 70 chars
  "history": "3–5 sentences of plain-English history for a curious beginner.",
  "sites": [                          // 2–3 famous sites
    {
      "name": "Sensō-ji",
      "jp": "浅草寺[せんそうじ]",
      "kind": "temple",               // temple | shrine | castle | nature | street | landmark | museum | garden
      "year": "628",                  // founding / build year as a string ("c. 1600", "1958"), or null
      "desc": "1–2 sentences."
    }
  ],
  "facts": ["2–3 short fun facts, one sentence each."],
  "words": [                          // 4–6 Japanese words tied to the place
    { "word": "お寺[てら]", "meaning": "temple" }
  ],
  "stamp": { "kanji": "浅草", "motif": "lantern" },
  // motif: torii | pagoda | castle | mountain | lantern | deer | wave | plane | train | tower | crossing | gate | onsen | octopus | shopping | game
  "reading": {                        // null for the two kana stops
    "title": "浅草[あさくさ]のお寺[てら]",
    "text": "Japanese, furigana markup, 80–200 chars, only grammar taught up to and including this unit",
    "en": "Full translation.",
    "questions": [{ "q": "English question", "options": ["4", "English", "options", "here"], "answer": 2 }]
  }
}
```

Rules
- Facts must be well-established (founding dates, heights, who built what). If unsure of an exact year, use "c." or leave the detail out — never invent.
- The reading uses only grammar from N5 units up to this stop's unit (see `docs/superpowers/specs/n5-syllabus.md`) and should mostly reuse vocab from those units; new place words must have furigana and appear in `words`.
- Vary the correct `answer` index across questions.
