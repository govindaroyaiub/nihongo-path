let ctx

function getCtx() {
  if (typeof window === 'undefined') return null
  const AudioContextClass = window.AudioContext || window.webkitAudioContext
  if (!AudioContextClass) return null
  if (!ctx) ctx = new AudioContextClass()
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

function tone(audioCtx, freq, startTime, duration, gainPeak = 0.2, type = 'sine') {
  const osc = audioCtx.createOscillator()
  const gain = audioCtx.createGain()
  osc.type = type
  osc.frequency.value = freq
  gain.gain.setValueAtTime(0, startTime)
  gain.gain.linearRampToValueAtTime(gainPeak, startTime + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration)
  osc.connect(gain)
  gain.connect(audioCtx.destination)
  osc.start(startTime)
  osc.stop(startTime + duration)
}

// Quick two-note chime for a correct answer.
export function playDing() {
  const audioCtx = getCtx()
  if (!audioCtx) return
  const now = audioCtx.currentTime
  tone(audioCtx, 880, now, 0.18)
  tone(audioCtx, 1318.5, now + 0.06, 0.2)
}

// Four-note ascending run for finishing a regular session.
export function playChime() {
  const audioCtx = getCtx()
  if (!audioCtx) return
  const now = audioCtx.currentTime
  ;[523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => tone(audioCtx, freq, now + i * 0.09, 0.3))
}

// Bigger run + held chord for a hard win (card mastered, module completed).
export function playFanfare() {
  const audioCtx = getCtx()
  if (!audioCtx) return
  const now = audioCtx.currentTime
  const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5]
  notes.forEach((freq, i) => tone(audioCtx, freq, now + i * 0.11, 0.35, 0.22, 'triangle'))
  const chordStart = now + notes.length * 0.11 + 0.05
  ;[659.25, 830.61, 1046.5].forEach((freq) => tone(audioCtx, freq, chordStart, 0.7, 0.18, 'triangle'))
}
