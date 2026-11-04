import { useEffect } from 'react'
import JpText from '../JpText'
import SpeakButton from '../SpeakButton'
import { speak } from '../../lib/speech'
import { useStore } from '../../lib/store'

// The question part of an exercise: label, then Japanese / English / audio.
export default function Prompt({ prompt }) {
  const autoplay = useStore((s) => s.settings.autoplay)

  useEffect(() => {
    if (prompt.audio && autoplay) speak(prompt.audio)
  }, [prompt, autoplay])

  const single = prompt.big && prompt.jp && [...prompt.jp].length <= 2

  return (
    <div className="flex flex-col items-center text-center gap-3 py-4">
      {/* A label on its own is the whole question (reading/listening), so give it weight. */}
      <p className={prompt.jp || prompt.en || prompt.audio ? 'eyebrow text-ink/45 text-xs' : 'font-extrabold text-2xl leading-snug px-2'}>
        {prompt.label}
      </p>
      {prompt.audio && !prompt.jp && (
        <div className="flex items-center gap-3 py-3">
          <SpeakButton text={prompt.audio} size="lg" />
          <SpeakButton text={prompt.audio} slow />
        </div>
      )}
      {prompt.jp &&
        (prompt.cloze ? (
          <Cloze text={prompt.jp} />
        ) : (
          <JpText
            text={prompt.jp}
            className={`animate-pop-in ${
              single ? 'font-jp font-bold text-8xl sm:text-9xl leading-tight' : prompt.big ? 'text-4xl sm:text-5xl font-bold leading-relaxed' : 'text-2xl sm:text-3xl font-bold leading-relaxed'
            }`}
          />
        ))}
      {/* Tap-to-hear help for a new learner: never autoplays, so the shape stays the question. */}
      {prompt.listen && <SpeakButton text={prompt.listen} label="Hear it" />}
      {prompt.en && (
        <p className={prompt.jp ? 'text-sm font-bold text-ink/55' : 'font-extrabold text-2xl leading-snug px-4'}>{prompt.en}</p>
      )}
      {prompt.hint && <p className="text-sm font-bold text-ink/50">“{prompt.hint}”</p>}
    </div>
  )
}

function Cloze({ text }) {
  const [before, after] = text.split('＿')
  return (
    <p className="text-2xl leading-loose font-jp px-2">
      <JpText text={before} />
      <span className="inline-block w-[2.6em] h-[1.3em] mx-1 rounded-lg bg-accent-soft border-2 border-dashed border-accent/50 align-middle" aria-label="blank" />
      <JpText text={after ?? ''} />
    </p>
  )
}
