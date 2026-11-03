import { speak } from '../lib/speech'
import { unitPayoff } from '../lib/readable'

// Real words the learner can read, as tappable chips (tap to hear).
export function WordChips({ words, max = 6, size, className = '' }) {
  return (
    <div className={`flex flex-wrap justify-center gap-2 ${className}`}>
      {words.slice(0, max).map((w) => (
        <button
          key={w.id}
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            speak(w.speak)
          }}
          className={`flex items-baseline gap-1.5 rounded-xl bg-surface border-2 border-outline active:translate-y-0.5 ${size === 'sm' ? 'px-2 py-0.5' : 'px-3 py-1.5'}`}
        >
          <span className={`font-jp font-bold leading-none ${size === 'sm' ? 'text-base' : 'text-lg'}`} lang="ja">
            {w.kana}
          </span>
          <span className="text-xs font-bold text-ink/55">{w.meaning}</span>
        </button>
      ))}
    </div>
  )
}

// The end goal of a kana unit, in real words: "finish this → read N words".
export function UnitGoal({ unit, className = '' }) {
  if (!unit.kana) return null
  const words = unitPayoff(unit)
  if (!words.length) return null
  const examples = [...words].sort((a, b) => a.order - b.order).filter((w) => w.kana.length >= 3).slice(0, 4)
  return (
    <p className={`text-sm font-bold ${className}`}>
      🎯 Finish it and you can read <span className="font-title">{words.length} real words</span>, like{' '}
      <span className="font-jp" lang="ja">
        {examples.map((w) => w.kana).join('、')}
      </span>
    </p>
  )
}
