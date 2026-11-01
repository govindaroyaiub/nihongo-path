import JpText from '../JpText'
import { Example } from './TeachCard'

export default function GrammarTeach({ item }) {
  return (
    <div className="flex flex-col gap-5 animate-pop-in">
      <div className="rounded-3xl p-6 text-white" style={{ background: 'linear-gradient(135deg, oklch(45% 0.09 260), oklch(38% 0.08 280))' }}>
        <p className="text-xs font-extrabold uppercase tracking-wider text-white/60">Pattern</p>
        <JpText text={item.pattern} className="block text-3xl font-bold mt-2 leading-snug" />
        <p className="mt-2 text-white/80">{item.meaning}</p>
      </div>
      <p className="text-[16px] leading-relaxed text-ink/80">{item.explanation}</p>
      {item.notes?.length > 0 && (
        <ul className="flex flex-col gap-2">
          {item.notes.map((n) => (
            <li key={n} className="flex gap-2.5 text-[15px] text-ink/70 leading-relaxed">
              <span className="text-indigo mt-0.5">●</span>
              <SmartNote text={n} />
            </li>
          ))}
        </ul>
      )}
      <div className="flex flex-col gap-2.5">
        <p className="text-xs font-extrabold uppercase tracking-wider text-ink/40">Examples</p>
        {item.examples.map((e) => (
          <Example key={e.jp} jp={e.jp} en={e.en} />
        ))}
      </div>
    </div>
  )
}

// Notes mix English with Japanese snippets; render the Japanese in the JP font.
function SmartNote({ text }) {
  return <JpText text={text} className="font-sans" />
}
