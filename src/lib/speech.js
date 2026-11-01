import { audioKey } from './audioKey'
import { getState } from './store'

// Two layers:
// 1. Pre-generated neural clips in /audio (see scripts/generate-audio.mjs) —
//    same natural voice on every device.
// 2. Web Speech fallback for anything without a clip, using the best
//    Japanese voice the browser offers (or the one picked in Settings).

export const SLOW_FACTOR = 0.65

// ---- clip manifest ----------------------------------------------------------

let clips = null // Set of keys, once loaded
let manifestPromise = null

export function loadAudioManifest() {
  if (!manifestPromise) {
    manifestPromise = fetch('/audio/manifest.json')
      .then((res) => (res.ok ? res.json() : { clips: [] }))
      .then((data) => {
        clips = new Set(data.clips ?? [])
        return data
      })
      .catch(() => {
        clips = new Set()
        return { clips: [] }
      })
  }
  return manifestPromise
}

export function clipCount() {
  return clips?.size ?? 0
}

// ---- Web Speech voice choice -------------------------------------------------

// Best-first. Neural/online voices (Edge's Nanami, Chrome's Google 日本語) and
// Apple's downloadable Premium/Enhanced voices sound far more natural.
const PREFERRED = [
  /nanami.*(natural|online)/i,
  /google\s*日本語/i,
  /(o-ren|kyoko).*(premium|enhanced)/i,
  /keita.*(natural|online)/i,
  /o-ren/i,
  /kyoko/i,
  /otoya/i,
  /(haruka|ayumi|sayaka|ichiro)/i,
]
// Apple's novelty voices — robotic, hard to learn from.
const AVOID = /(eddy|flo|grandma|grandpa|reed|rocko|sandy|shelley|compact|espeak)/i
const MALE = /(keita|otoya|ichiro|hattori|daichi|naoki)/i

function scoreVoice(voice) {
  if (AVOID.test(voice.name)) return -1
  const rank = PREFERRED.findIndex((re) => re.test(voice.name))
  return rank === -1 ? 0 : PREFERRED.length - rank
}

export function japaneseVoices() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return []
  const all = window.speechSynthesis
    .getVoices()
    .filter((v) => v.lang?.replace('_', '-').startsWith('ja'))
    .sort((a, b) => scoreVoice(b) - scoreVoice(a))
  const usable = all.filter((v) => scoreVoice(v) >= 0)
  return usable.length ? usable : all
}

function pickVoice(speaker) {
  const voices = japaneseVoices()
  if (voices.length === 0) return null
  const chosen = voices.find((v) => v.voiceURI === getState().settings.voiceURI) ?? voices[0]
  if (speaker !== 'B') return chosen
  // Second speaker in a dialogue: a different (ideally male) voice so the two are easy to tell apart.
  const others = voices.filter((v) => v !== chosen && scoreVoice(v) >= 0)
  return others.find((v) => MALE.test(v.name)) ?? others[0] ?? chosen
}

// ---- playback ------------------------------------------------------------------

let currentAudio = null
let playToken = 0

export function stopSpeaking() {
  playToken++
  if (currentAudio) {
    currentAudio.pause()
    currentAudio = null
  }
  if (typeof window !== 'undefined') window.speechSynthesis?.cancel()
}

function playClip(key, rate) {
  return new Promise((resolve) => {
    const audio = new Audio(`/audio/${key}.mp3`)
    audio.playbackRate = rate
    audio.preservesPitch = true
    currentAudio = audio
    audio.onended = resolve
    audio.onerror = () => resolve('error')
    audio.play().catch(() => resolve('error'))
  })
}

function playSynth(text, rate, speaker) {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return resolve()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'ja-JP'
    utterance.rate = rate
    const voice = pickVoice(speaker)
    if (voice) utterance.voice = voice
    // If only one voice exists, a pitch shift still separates the speakers.
    utterance.pitch = speaker === 'B' && (!voice || voice === pickVoice('A')) ? 0.75 : 1
    utterance.onend = () => resolve()
    utterance.onerror = () => resolve()
    window.speechSynthesis.speak(utterance)
  })
}

async function playOne(text, { speaker = 'A', slow = false } = {}, token) {
  if (!text) return
  await loadAudioManifest()
  if (token !== playToken) return
  const base = getState().settings.rate
  // Clips are recorded at natural speed, so the base rate is relative to 1.
  const rate = slow ? base * SLOW_FACTOR : base
  const key = audioKey(text, speaker)
  if (clips.has(key)) {
    const result = await playClip(key, Math.max(0.5, rate))
    if (result !== 'error') return
  }
  if (token !== playToken) return
  await playSynth(text, rate, speaker)
}

// Speaks one Japanese string (kana form recommended — readings are exact).
export function speak(text, options) {
  stopSpeaking()
  const token = playToken
  return playOne(text, options, token)
}

// Speaks lines back to back: [{ text, speaker }]. Resolves when done or stopped.
// `onLine(index)` fires as each line starts, for highlighting a transcript.
export async function speakLines(lines, { slow = false, onLine, gap = 350 } = {}) {
  stopSpeaking()
  const token = playToken
  for (let i = 0; i < lines.length; i++) {
    if (token !== playToken) return
    onLine?.(i)
    await playOne(lines[i].text, { speaker: lines[i].speaker, slow }, token)
    if (token !== playToken) return
    await new Promise((r) => setTimeout(r, gap))
  }
  onLine?.(-1)
}

if (typeof window !== 'undefined' && window.speechSynthesis) {
  // Voice lists load asynchronously in Chrome; touching getVoices() kicks it off.
  window.speechSynthesis.getVoices()
}
