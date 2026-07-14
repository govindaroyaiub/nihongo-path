let cachedVoice
let cacheReady = false

// Voice name fragments that tend to sound harsh/robotic on a given platform,
// ranked worst-first so we steer away from them when a better ja-JP voice exists.
const AVOID_HINTS = ['compact', 'espeak', 'novelty']

function scoreVoice(voice) {
  const name = voice.name.toLowerCase()
  if (AVOID_HINTS.some((hint) => name.includes(hint))) return 0
  if (name.includes('premium') || name.includes('enhanced') || name.includes('natural')) return 3
  if (voice.localService === false) return 2 // network voices (e.g. Google's) are usually smoother
  return 1
}

function pickJapaneseVoice() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null
  if (cacheReady) return cachedVoice

  const voices = window.speechSynthesis.getVoices()
  if (voices.length === 0) return null // voice list not loaded yet, try again next call

  const japanese = voices.filter((v) => v.lang === 'ja-JP' || v.lang?.startsWith('ja'))
  cachedVoice = [...japanese].sort((a, b) => scoreVoice(b) - scoreVoice(a))[0] || null
  cacheReady = true
  return cachedVoice
}

if (typeof window !== 'undefined' && window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => {
    cacheReady = false
  }
}

export const NORMAL_RATE = 0.8
export const SLOW_RATE = 0.5 // "tortoise mode" — roughly half speed, for picking apart individual sounds

function utteranceFor(text, rate) {
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'ja-JP'
  // Slower and slightly lower-pitched than default reads as calmer and more
  // deliberate, easier to follow when you're still learning the sounds.
  utterance.rate = rate
  utterance.pitch = 0.92
  const voice = pickJapaneseVoice()
  if (voice) utterance.voice = voice
  return utterance
}

// Speaks a single string of Japanese text.
export function speakJapanese(text, { rate = NORMAL_RATE } = {}) {
  if (!text || typeof window === 'undefined' || !window.speechSynthesis) return
  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(utteranceFor(text, rate))
}

// Speaks a list of strings back to back (e.g. a word, then its example sentence).
// speechSynthesis queues consecutive speak() calls automatically.
export function speakSequence(texts, { rate = NORMAL_RATE } = {}) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  const list = (texts || []).filter(Boolean)
  if (list.length === 0) return
  window.speechSynthesis.cancel()
  list.forEach((text) => window.speechSynthesis.speak(utteranceFor(text, rate)))
}
