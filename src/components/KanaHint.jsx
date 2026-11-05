import { toRomaji } from 'wanakana'
import SpeakButton from './SpeakButton'

// "Remember it": a kana's picture word, like an あいうえお chart (あ → あり 🐜),
// and for base kana a shape story (き looks like a key → ki).
// Voiced and combo kana also show the pieces they're built from (か + ゛ → が);
// the few with no everyday word show only that.
export default function KanaHint({ item, compact = false, className = '' }) {
  const hint = item?.hint
  if (!hint) return null
  const box = `flex items-center gap-3 rounded-2xl bg-sun/25 border-2 border-outline text-left ${compact ? 'px-3 py-2' : 'px-4 py-3'} ${className}`

  if (!hint.word) {
    return (
      <div className={box}>
        <span className={`font-jp font-bold leading-none shrink-0 whitespace-nowrap ${compact ? 'text-xl' : 'text-2xl'}`} lang="ja">
          {hint.parts.join(' + ')}
        </span>
        <div className="min-w-0">
          {!compact && <p className="eyebrow text-ink/45 text-[10px]">Built from</p>}
          <p className={`font-bold leading-snug ${compact ? 'text-sm' : 'text-[15px]'}`}>
            <SoundText text={hint.text} />
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={box}>
      <span className={`leading-none shrink-0 ${compact ? 'text-3xl' : 'text-6xl'}`} aria-hidden>
        {hint.emoji}
      </span>
      <div className="min-w-0 flex-1">
        {!compact && (
          <p className="eyebrow text-ink/45 text-[10px]">
            <span className="font-jp normal-case" lang="ja">
              {item.char}
            </span>{' '}
            as in
          </p>
        )}
        <p className="flex items-baseline flex-wrap gap-x-2">
          <Word word={hint.word} char={item.char} className={compact ? 'text-xl' : 'text-3xl'} />
          <span className="text-xs font-bold text-ink/45">{toRomaji(hint.word)}</span>
          <span className={`font-bold text-ink/75 ${compact ? 'text-sm' : 'text-[15px]'}`}>({hint.meaning})</span>
        </p>
        {hint.shape && (
          <p className={`font-bold text-ink/70 mt-1 leading-snug ${compact ? 'text-[12px]' : 'text-[13px]'}`}>
            <span aria-hidden>👀 </span>
            <SoundText text={hint.shape} />
          </p>
        )}
        {!compact && hint.built && (
          <p className="text-[12px] font-bold text-ink/60 mt-0.5">
            <SoundText text={hint.built} />
          </p>
        )}
        {!compact && (hint.note || hint.origin) && (
          <p className="text-[11px] font-bold text-ink/45 mt-0.5">
            {hint.note ?? (
              <>
                Written from the kanji{' '}
                <span className="font-jp text-ink/70" lang="ja">
                  {hint.origin}
                </span>
              </>
            )}
          </p>
        )}
      </div>
      {!compact && <SpeakButton text={hint.word} size="sm" />}
    </div>
  )
}

// The word with the character being learned picked out in red.
function Word({ word, char, className }) {
  const parts = word.split(char)
  return (
    <span className={`font-jp font-bold leading-tight ${className}`} lang="ja">
      {parts.map((part, i) => (
        <span key={i}>
          {part}
          {i < parts.length - 1 && <span className="text-torii">{char}</span>}
        </span>
      ))}
    </span>
  )
}

// {braces} mark a sound: shown bold in red so the ear finds it.
function SoundText({ text }) {
  return text.split(/(\{[^}]+\})/).map((part, i) =>
    part.startsWith('{') ? (
      <span key={i} className="text-torii font-extrabold">
        {part.slice(1, -1)}
      </span>
    ) : (
      part
    )
  )
}
