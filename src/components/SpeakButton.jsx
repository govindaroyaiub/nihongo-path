import { useState } from 'react'
import { Volume2, Turtle } from 'lucide-react'
import { speak } from '../lib/speech'

// Round play button; the tortoise variant plays the same line slowly.
export default function SpeakButton({ text, speaker, slow = false, size = 'md', className = '', label }) {
  const [playing, setPlaying] = useState(false)
  if (!text) return null
  const Icon = slow ? Turtle : Volume2
  const dims = size === 'lg' ? 'w-16 h-16' : size === 'sm' ? 'w-9 h-9' : 'w-11 h-11'
  const icon = size === 'lg' ? 28 : size === 'sm' ? 16 : 20

  async function play(e) {
    e.stopPropagation()
    setPlaying(true)
    await speak(text, { speaker, slow })
    setPlaying(false)
  }

  return (
    <button
      type="button"
      onClick={play}
      aria-label={label ?? (slow ? 'Play slowly' : 'Play audio')}
      className={`${dims} shrink-0 rounded-full flex items-center justify-center transition-all active:scale-95 ${
        slow ? 'bg-sunken text-ink/60' : 'bg-indigo text-white shadow-sm shadow-indigo/30'
      } ${playing ? 'ring-4 ring-indigo/20' : ''} ${className}`}
    >
      <Icon size={icon} strokeWidth={2.2} />
    </button>
  )
}

export function SpeakPair({ text, speaker, size }) {
  if (!text) return null
  return (
    <div className="flex items-center gap-2">
      <SpeakButton text={text} speaker={speaker} size={size} />
      <SpeakButton text={text} speaker={speaker} size="sm" slow />
    </div>
  )
}
