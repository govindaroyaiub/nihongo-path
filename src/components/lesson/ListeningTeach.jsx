import { useState } from 'react'
import { Headphones, Play, Square, Turtle } from 'lucide-react'
import JpText from '../JpText'
import { speakLines, stopSpeaking } from '../../lib/speech'
import { speechText } from '../../lib/furigana'

// Dialogue player. The transcript stays hidden until `showTranscript`, so the
// learner trains their ear first.
export default function ListeningTeach({ listening, showTranscript = false, compact = false }) {
  const [playing, setPlaying] = useState(false)
  const [active, setActive] = useState(-1)
  const [plays, setPlays] = useState(0)

  async function play(slow) {
    if (playing) {
      stopSpeaking()
      setPlaying(false)
      setActive(-1)
      return
    }
    setPlaying(true)
    setPlays((n) => n + 1)
    await speakLines(
      listening.lines.map((l) => ({ text: speechText(l.jp), speaker: l.speaker === 'B' ? 'B' : 'A' })),
      { slow, onLine: setActive, gap: 500 }
    )
    setPlaying(false)
  }

  return (
    <div className="flex flex-col gap-4">
      {!compact && (
        <div className="flex flex-col items-center text-center gap-2 pt-4">
          <div className="w-20 h-20 rounded-full bg-indigo-soft text-indigo flex items-center justify-center">
            <Headphones size={34} />
          </div>
          <p className="text-sm text-ink/50 max-w-xs">Listen to the conversation. Play it as many times as you like — the questions come next.</p>
        </div>
      )}
      <div className="flex gap-2">
        <button type="button" onClick={() => play(false)} className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-indigo text-white font-extrabold">
          {playing ? <Square size={16} /> : <Play size={16} />}
          {playing ? 'Stop' : plays ? 'Play again' : 'Play conversation'}
        </button>
        <button type="button" aria-label="Play slowly" onClick={() => play(true)} className="px-4 rounded-2xl border-[2.5px] border-outline text-ink/60">
          <Turtle size={18} />
        </button>
      </div>
      {!showTranscript && playing && (
        <div className="flex justify-center gap-1.5 py-2" aria-hidden>
          {listening.lines.map((l, i) => (
            <span key={i} className={`h-1.5 rounded-full transition-all ${i === active ? 'w-6 bg-indigo' : 'w-1.5 bg-ink/15'}`} />
          ))}
        </div>
      )}
      {showTranscript && (
        <ol className="flex flex-col gap-2">
          {listening.lines.map((l, i) => (
            <li key={i} className={`flex gap-3 ${l.speaker === 'B' ? 'flex-row-reverse text-right' : ''}`}>
              <span className={`w-7 h-7 rounded-full text-xs font-extrabold flex items-center justify-center shrink-0 ${l.speaker === 'B' ? 'bg-accent-soft text-accent' : 'bg-indigo-soft text-indigo'}`}>
                {l.speaker}
              </span>
              <div className={`rounded-2xl px-3.5 py-2 max-w-[80%] transition-colors ${i === active ? 'bg-gold/20' : 'bg-surface border-[2.5px] border-outline'}`}>
                <JpText text={l.jp} className="text-[17px] leading-loose" />
                <p className="text-xs text-ink/45">{l.en}</p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
