import { useState } from 'react'
import { Play, Square, Eye, EyeOff } from 'lucide-react'
import JpText from '../JpText'
import { speak, speakLines, stopSpeaking } from '../../lib/speech'
import { speechText, splitSentences } from '../../lib/furigana'

export default function ReadingTeach({ reading }) {
  const sentences = splitSentences(reading.text)
  const [active, setActive] = useState(-1)
  const [playing, setPlaying] = useState(false)
  const [showEn, setShowEn] = useState(false)

  async function playAll() {
    if (playing) {
      stopSpeaking()
      setPlaying(false)
      setActive(-1)
      return
    }
    setPlaying(true)
    await speakLines(sentences.map((s) => ({ text: speechText(s) })), { onLine: setActive })
    setPlaying(false)
  }

  return (
    <div className="flex flex-col gap-4 animate-pop-in">
      <p className="text-sm text-ink/50">Read it once on your own, then listen. Tap any sentence to hear it.</p>
      <article className="panel p-5 text-xl leading-[2.4]">
        {sentences.map((s, i) => (
          <span
            key={i}
            onClick={() => {
              setActive(i)
              speak(speechText(s)).then(() => setActive(-1))
            }}
            className={`cursor-pointer rounded-md transition-colors ${active === i ? 'bg-gold/25' : ''}`}
          >
            <JpText text={s} />
          </span>
        ))}
      </article>
      <div className="flex gap-2">
        <button type="button" onClick={playAll} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-indigo text-white font-extrabold">
          {playing ? <Square size={16} /> : <Play size={16} />}
          {playing ? 'Stop' : 'Listen to all'}
        </button>
        <button type="button" onClick={() => setShowEn(!showEn)} className="flex items-center gap-2 px-4 py-3 rounded-2xl border-[2.5px] border-outline font-bold text-ink/70">
          {showEn ? <EyeOff size={16} /> : <Eye size={16} />}
          English
        </button>
      </div>
      {showEn && <p className="text-[15px] text-ink/60 leading-relaxed bg-sunken rounded-2xl p-4">{reading.en}</p>}
    </div>
  )
}
