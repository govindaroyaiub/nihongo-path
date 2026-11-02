import { useEffect } from 'react'
import JpText from '../JpText'
import SpeakButton, { SpeakPair } from '../SpeakButton'
import { speak } from '../../lib/speech'
import { speechText, wordRomaji, hasKanji } from '../../lib/furigana'
import { useStore } from '../../lib/store'

// One "meet this item" card, shown before practice. Auto-plays its audio.
export default function TeachCard({ item }) {
  const autoplay = useStore((s) => s.settings.autoplay)
  const audio = item.type === 'kana' ? item.char : item.type === 'kanji' ? speechText(item.words?.[0]?.word ?? '') : speechText(item.word)

  useEffect(() => {
    if (autoplay && audio) speak(audio)
  }, [item.id, audio, autoplay])

  return (
    <div className="animate-pop-in panel p-6 relative overflow-hidden">
      {item.type === 'kana' && <Kana item={item} />}
      {item.type === 'vocab' && <Vocab item={item} />}
      {item.type === 'kanji' && <Kanji item={item} />}
    </div>
  )
}

function Kana({ item }) {
  return (
    <div className="flex flex-col items-center text-center gap-2 py-4">
      {/* manga spotlight: speed lines behind the character */}
      <div className="relative w-56 h-56 flex items-center justify-center">
        <div className="absolute inset-0 speedlines animate-spin-slow rounded-full" aria-hidden />
        {/* Solid (not translucent) so the spinning rays don't show through; sun softened toward the card colour. */}
        <div
          className="absolute inset-6 rounded-full border-[2.5px] border-outline"
          style={{ background: 'color-mix(in srgb, rgb(var(--sun)) 55%, rgb(var(--surface)))' }}
          aria-hidden
        />
        <span className="relative font-jp font-bold text-[132px] leading-none" lang="ja">
          {item.char}
        </span>
      </div>
      <WritingForms char={item.char} />
      <span className="sfx text-4xl text-torii mt-1" style={{ WebkitTextStroke: '1.5px rgb(var(--outline))', textShadow: '2px 2px 0 rgb(var(--outline))' }}>
        {item.romaji}
      </span>
      <p className="eyebrow text-ink/45 mt-1">{item.script === 'katakana' ? 'Katakana' : 'Hiragana'} · say it out loud!</p>
      <div className="mt-4">
        <SpeakPair text={item.char} size="lg" />
      </div>
    </div>
  )
}

function Vocab({ item }) {
  const romajiOn = useStore((s) => s.settings.romaji)
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col items-center text-center gap-1 pt-2">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-ink/35">{item.pos}</span>
        <JpText text={item.word} furigana className="text-5xl font-bold leading-snug mt-2" />
        {hasKanji(item.word) && <JpText text={item.word.replace(/\[[^\]]+\]/g, '')} className="sr-only" />}
        {romajiOn && <p className="text-ink/40 text-sm mt-1">{wordRomaji(item.word)}</p>}
        <p className="font-title text-2xl mt-3">{item.meaning}</p>
        <div className="mt-4">
          <SpeakPair text={speechText(item.word)} />
        </div>
      </div>
      {item.example && <Example jp={item.example.jp} en={item.example.en} />}
    </div>
  )
}

function Kanji({ item }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-5">
        <div className="w-32 h-32 rounded-2xl bg-paper border border-ink/[0.07] flex items-center justify-center relative shrink-0">
          {/* faint practice-grid guides, like a kanji workbook square */}
          <div className="absolute inset-0 pointer-events-none" aria-hidden>
            <div className="absolute left-1/2 top-2 bottom-2 border-l border-dashed border-ink/10" />
            <div className="absolute top-1/2 left-2 right-2 border-t border-dashed border-ink/10" />
          </div>
          <span className="font-jp font-bold text-[88px] leading-none relative" lang="ja">
            {item.char}
          </span>
        </div>
        <div className="min-w-0">
          <p className="font-title text-2xl leading-tight">{item.meanings.join(', ')}</p>
          <p className="text-xs text-ink/40 mt-1">{item.strokes} strokes</p>
          <dl className="mt-3 text-sm grid grid-cols-[auto,1fr] gap-x-3 gap-y-1">
            <dt className="text-ink/40">On</dt>
            <dd className="font-jp">{item.on.join('、') || '—'}</dd>
            <dt className="text-ink/40">Kun</dt>
            <dd className="font-jp">{item.kun.join('、') || '—'}</dd>
          </dl>
        </div>
      </div>
      <WritingForms char={item.char} />
      {item.mnemonic && <p className="text-[15px] text-ink/65 leading-relaxed bg-accent-soft/60 rounded-2xl px-4 py-3">💡 {item.mnemonic}</p>}
      <ul className="flex flex-col divide-y divide-line">
        {item.words?.map((w) => (
          <li key={w.word} className="flex items-center gap-3 py-2.5">
            <JpText text={w.word} furigana className="text-xl" />
            <span className="flex-1 text-sm text-ink/55">{w.meaning}</span>
            <SpeakButton text={speechText(w.word)} size="sm" />
          </li>
        ))}
      </ul>
    </div>
  )
}

// Printed (what you read on screens and signs) vs handwritten (how it's written
// by pen). Some characters — ふ さ き り そ や — look noticeably different.
function WritingForms({ char }) {
  return (
    <div className="flex justify-center gap-3 mt-2">
      {[
        ['Printed', 'font-jp font-bold'],
        ['Handwritten', 'font-hand'],
      ].map(([label, font]) => (
        <div key={label} className="flex flex-col items-center gap-1 rounded-2xl border-[2.5px] border-outline bg-sunken px-4 py-2 min-w-[96px]">
          <span className={`${font} text-4xl leading-none`} lang="ja">
            {char}
          </span>
          <span className="eyebrow text-ink/50 text-[10px]">{label}</span>
        </div>
      ))}
    </div>
  )
}

export function Example({ jp, en, speaker }) {
  return (
    <div className="rounded-2xl bg-paper border border-ink/[0.06] p-4 flex items-start gap-3">
      <div className="flex-1 min-w-0">
        <JpText text={jp} className="text-lg leading-loose" />
        <p className="text-sm text-ink/50 mt-1">{en}</p>
      </div>
      <SpeakButton text={speechText(jp)} speaker={speaker} size="sm" />
    </div>
  )
}
