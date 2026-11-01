import { useEffect, useMemo } from 'react'
import { SmartText } from '../JpText'
import SpeakButton from '../SpeakButton'
import Mascot from '../Mascot'
import { SfxBurst } from '../Anime'

const CHEERS = ['正解！', 'すごい！', 'いいね！', 'やった！', '完璧！']
const COMFORT = ['ドンマイ！', 'おしい！']

// Slides up after every answer: a manga sound effect, Kitsu's reaction, the
// correct answer, a replay button, and Continue (Enter works too).
export default function FeedbackSheet({ answered, speakText, onContinue, combo = 0 }) {
  const { correct, correctLabel } = answered
  const sfx = useMemo(() => (correct ? CHEERS : COMFORT)[Math.floor(Math.random() * (correct ? CHEERS.length : COMFORT.length))], [correct])

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Enter') {
        e.preventDefault()
        onContinue()
      }
    }
    // Defer so the Enter that submitted a typed answer doesn't also skip this sheet.
    const t = setTimeout(() => window.addEventListener('keydown', onKey), 150)
    return () => {
      clearTimeout(t)
      window.removeEventListener('keydown', onKey)
    }
  }, [onContinue])

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t-[3px] border-outline ${correct ? 'bg-matcha/25' : 'bg-torii/20'} backdrop-blur-md`}
      style={{ animation: 'sheet-up 260ms cubic-bezier(0.16, 1, 0.3, 1)' }}
    >
      <div className="max-w-2xl mx-auto px-5 pt-4 pb-[max(env(safe-area-inset-bottom),1.25rem)]">
        <div className="flex items-center gap-3">
          <Mascot pose={correct ? 'celebrate' : 'oops'} size={68} />
          <div className="flex-1 min-w-0">
            <SfxBurst text={sfx} color={correct ? 'matcha' : 'torii'} size={128} className="-ml-2 -my-2" />
            {correct && combo >= 3 && <p className="font-title text-sm text-sun-deep mt-0.5">🔥 {combo} COMBO!</p>}
            {!correct && correctLabel && (
              <p className="text-ink/80 font-bold mt-1">
                Answer: <SmartText text={correctLabel} className="font-extrabold text-ink" />
              </p>
            )}
          </div>
          {speakText && <SpeakButton text={speakText} size="sm" />}
        </div>
        <button type="button" onClick={onContinue} className={`${correct ? 'btn-matcha' : 'btn-danger'} mt-4 w-full py-4 text-base`}>
          Continue
        </button>
      </div>
    </div>
  )
}
