#!/usr/bin/env node
// Pre-generates natural voice clips for every Japanese string in the course.
//
//   GOOGLE_TTS_KEY=... node scripts/generate-audio.mjs          # Google Neural2 (best)
//   node scripts/generate-audio.mjs --engine say                # macOS `say` (offline)
//   node scripts/generate-audio.mjs --dry                       # just count clips
//
// Clips go to public/audio/<key>.mp3 with public/audio/manifest.json listing
// them. Existing clips are skipped, so re-running only fills in new content.
import { readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync, rmSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'
import { tmpdir } from 'node:os'
import { audioKey } from '../src/lib/audioKey.js'
import { speechText, splitSentences } from '../src/lib/furigana.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'public/audio')
const args = process.argv.slice(2)
const engine = args.includes('--engine') ? args[args.indexOf('--engine') + 1] : process.env.GOOGLE_TTS_KEY ? 'google' : 'say'
const dry = args.includes('--dry')

// Speaker A: female voice (default for everything). Speaker B: male (dialogues).
const VOICES = {
  google: { A: 'ja-JP-Neural2-B', B: 'ja-JP-Neural2-C' },
  say: { A: 'Kyoko', B: 'Kyoko' },
}

// ---- collect every string the app can speak -------------------------------

function collect() {
  const lines = new Map() // key → { text, speaker }
  const add = (markup, speaker = 'A') => {
    const text = speechText(markup ?? '')
    if (!text) return
    lines.set(audioKey(text, speaker), { text, speaker })
  }

  for (const script of ['hiragana', 'katakana']) {
    for (const k of JSON.parse(readFileSync(join(root, `src/content/kana/${script}.json`), 'utf8'))) add(k.char)
  }

  const contentDir = join(root, 'src/content')
  for (const level of readdirSync(contentDir)) {
    const dir = join(contentDir, level)
    if (level === 'kana' || level === 'places' || level === 'geo' || !existsSync(dir) || !readdirSync(dir).length) continue
    for (const file of readdirSync(dir).filter((f) => /^unit-\d+\.json$/.test(f))) {
      const unit = JSON.parse(readFileSync(join(dir, file), 'utf8'))
      for (const v of unit.vocab ?? []) {
        add(v.word)
        add(v.example?.jp)
      }
      for (const k of unit.kanji ?? []) for (const w of k.words ?? []) add(w.word)
      for (const g of unit.grammar ?? []) {
        for (const e of g.examples ?? []) add(e.jp)
        for (const d of g.drills ?? []) add(d.type === 'order' ? d.tokens.join('') : d.jp.replace('＿', d.answer))
      }
      for (const s of splitSentences(unit.reading?.text)) add(s)
      for (const l of unit.listening?.lines ?? []) add(l.jp, l.speaker === 'B' ? 'B' : 'A')
    }
  }
  const placeDir = join(root, 'src/content/places')
  if (existsSync(placeDir)) {
    for (const file of readdirSync(placeDir).filter((f) => f.endsWith('.json'))) {
      const place = JSON.parse(readFileSync(join(placeDir, file), 'utf8'))
      for (const w of place.words ?? []) add(w.word)
      for (const s of splitSentences(place.reading?.text)) add(s)
    }
  }
  return lines
}

// ---- engines ----------------------------------------------------------------

async function synthGoogle(text, speaker) {
  const res = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${process.env.GOOGLE_TTS_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      input: { text },
      voice: { languageCode: 'ja-JP', name: VOICES.google[speaker] },
      audioConfig: { audioEncoding: 'MP3', speakingRate: 0.95, sampleRateHertz: 24000 },
    }),
  })
  if (!res.ok) throw new Error(`Google TTS ${res.status}: ${await res.text()}`)
  return Buffer.from((await res.json()).audioContent, 'base64')
}

function synthSay(text, speaker) {
  const tmp = join(tmpdir(), `np-say-${process.pid}.aiff`)
  const mp3 = join(tmpdir(), `np-say-${process.pid}.mp3`)
  execFileSync('say', ['-v', VOICES.say[speaker], '-o', tmp, text])
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', tmp, '-ac', '1', '-b:a', '64k', mp3])
  const data = readFileSync(mp3)
  rmSync(tmp, { force: true })
  rmSync(mp3, { force: true })
  return data
}

const synth = { google: synthGoogle, say: synthSay }[engine]
if (!synth) {
  console.error(`Unknown engine "${engine}". Use google or say.`)
  process.exit(1)
}

// ---- run --------------------------------------------------------------------

mkdirSync(outDir, { recursive: true })
const lines = collect()
const todo = [...lines].filter(([key]) => !existsSync(join(outDir, `${key}.mp3`)))
const chars = todo.reduce((n, [, l]) => n + l.text.length, 0)
console.log(`${lines.size} clips in course, ${todo.length} to generate (${chars} characters) with ${engine}.`)

// Check the key with one tiny request first, so a bad key fails once with a
// clear message instead of once per clip.
if (!dry && engine === 'google' && todo.length) {
  try {
    await synthGoogle('テスト', 'A')
  } catch (error) {
    const reason = /API_KEY_INVALID|API key not valid/.test(error.message)
      ? 'Google rejected the API key. Check that GOOGLE_TTS_KEY is your real key (not the placeholder) and that the Cloud Text-to-Speech API is enabled for its project.'
      : /PERMISSION_DENIED|SERVICE_DISABLED|403/.test(error.message)
        ? 'The key works but the Cloud Text-to-Speech API is not enabled (or billing is not set up) for its Google Cloud project.'
        : error.message
    console.error(`\n✗ ${reason}`)
    process.exit(1)
  }
}

if (!dry) {
  let done = 0
  const concurrency = engine === 'google' ? 6 : 1
  const queue = [...todo]
  // Google allows 1,000 requests per minute per project; pace starts ~90ms
  // apart (~660/min) and, if it still says 429, wait out the minute and retry.
  const GAP_MS = engine === 'google' ? 90 : 0
  let nextSlot = 0
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
  await Promise.all(
    Array.from({ length: concurrency }, async () => {
      while (queue.length) {
        const [key, { text, speaker }] = queue.shift()
        const now = Date.now()
        const wait = Math.max(0, nextSlot - now)
        nextSlot = Math.max(now, nextSlot) + GAP_MS
        if (wait) await sleep(wait)
        try {
          writeFileSync(join(outDir, `${key}.mp3`), await synth(text, speaker))
        } catch (error) {
          if (engine === 'google' && /\b429\b|RESOURCE_EXHAUSTED/.test(error.message)) {
            queue.push([key, { text, speaker }])
            process.stdout.write('\n⏳ Google rate limit hit, pausing 60s…')
            nextSlot = Date.now() + 60_000
            continue
          }
          console.error(`\n✗ ${text}: ${error.message.split('\n')[0]}`)
          if (engine === 'google' && /40[013]|API_KEY_INVALID|PERMISSION_DENIED/.test(error.message)) process.exit(1)
        }
        done++
        if (done % 25 === 0 || done === todo.length) process.stdout.write(`\r${done}/${todo.length}`)
      }
    })
  )
  console.log()
}

// Manifest lists every clip that exists on disk and is still used by the course.
const onDisk = new Set(readdirSync(outDir).filter((f) => f.endsWith('.mp3')).map((f) => f.slice(0, -4)))
const clips = [...lines.keys()].filter((k) => onDisk.has(k))
writeFileSync(join(outDir, 'manifest.json'), JSON.stringify({ engine, voices: VOICES[engine], clips }))
console.log(`manifest.json: ${clips.length} clips.`)
