#!/usr/bin/env node
// Downloads stroke-order data for every kana and kanji in the course from
// KanjiVG (https://kanjivg.tagaini.net, CC BY-SA 3.0) and stores a compact
// JSON per character in public/strokes/<codepoint>.json:
//   { "strokes": ["M31,33c…", …], "numbers": [[22.5, 35], …] }   (109×109 grid)
//   node scripts/fetch-strokes.mjs
// Existing files are skipped, so re-running only fetches new characters.
import { readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const KANJIVG = 'https://cdn.jsdelivr.net/gh/KanjiVG/kanjivg@r20250816/kanji'
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'public/strokes')
mkdirSync(outDir, { recursive: true })

export const strokeFile = (ch) => ch.codePointAt(0).toString(16).padStart(5, '0')

// Every single character worth animating: kana (combos split into parts) and kanji.
const chars = new Set()
for (const script of ['hiragana', 'katakana']) {
  for (const k of JSON.parse(readFileSync(join(root, `src/content/kana/${script}.json`), 'utf8'))) for (const ch of k.char) chars.add(ch)
}
for (const level of readdirSync(join(root, 'src/content')).filter((d) => /^n\d$/.test(d))) {
  for (const f of readdirSync(join(root, 'src/content', level)).filter((f) => /^unit-\d+\.json$/.test(f))) {
    for (const k of JSON.parse(readFileSync(join(root, 'src/content', level, f), 'utf8')).kanji ?? []) chars.add(k.char)
  }
}

const todo = [...chars].filter((ch) => !existsSync(join(outDir, `${strokeFile(ch)}.json`)))
console.log(`${chars.size} characters, ${todo.length} to fetch.`)

let failed = 0
for (const ch of todo) {
  const res = await fetch(`${KANJIVG}/${strokeFile(ch)}.svg`)
  if (!res.ok) {
    console.error(`✗ ${ch}: ${res.status}`)
    failed++
    continue
  }
  const svg = await res.text()
  // Stroke paths come in drawing order (ids …-s1, -s2, …); numbers are their start labels.
  const strokes = [...svg.matchAll(/<path[^>]*id="kvg:[0-9a-f]+-s(\d+)"[^>]*\sd="([^"]+)"/g)]
    .sort((a, b) => Number(a[1]) - Number(b[1]))
    .map((m) => m[2])
  const numbers = [...svg.matchAll(/<text transform="matrix\(1 0 0 1 ([\d.]+) ([\d.]+)\)">\d+<\/text>/g)].map((m) => [Number(m[1]), Number(m[2])])
  if (!strokes.length) {
    console.error(`✗ ${ch}: no strokes found`)
    failed++
    continue
  }
  writeFileSync(join(outDir, `${strokeFile(ch)}.json`), JSON.stringify({ strokes, numbers }))
}
console.log(failed ? `Done with ${failed} failure(s).` : 'Done.')
