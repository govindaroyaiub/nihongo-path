// Shared by the app and scripts/generate-audio.mjs: maps a voice + Japanese
// string to a stable clip filename, so the app can find a pre-generated clip.
// FNV-1a 32-bit, hex — short, deterministic, no dependencies.
export function audioKey(text, voice = 'A') {
  const input = `${voice}|${text.trim()}`
  let hash = 0x811c9dc5
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193)
  }
  return (hash >>> 0).toString(16).padStart(8, '0')
}
