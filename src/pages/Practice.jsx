import { Link } from 'react-router-dom'
import { ChevronRight, BookOpen, PenTool, Puzzle, GraduationCap, Clock } from 'lucide-react'
import { useStore } from '../lib/store'
import { allItems } from '../lib/curriculum'

export default function Practice() {
  const srs = useStore((s) => s.srs)
  const learned = (type) => allItems().filter((i) => i.type === type && srs[i.id]).length
  const total = (type) => allItems().filter((i) => i.type === type).length

  return (
    <div className="pt-[max(env(safe-area-inset-top),1.5rem)] pb-8">
      <h1 className="font-title text-3xl">Practice <span className="text-matcha">練習</span></h1>
      <p className="text-sm text-ink/50 mt-1">Look things up, drill the kana, and prepare for the exam.</p>

      <Section title="Journey">
        <Link to="/map" className="tile p-4 flex items-center gap-4 bg-sakura/10">
          <span className="w-14 h-14 rounded-2xl border-[2.5px] border-outline bg-[#fffaf0] flex items-center justify-center font-hand text-2xl text-[#e23b3b]">印</span>
          <div className="flex-1">
            <p className="font-extrabold">Stamp book & map</p>
            <p className="text-sm font-bold text-ink/55">Collect a temple stamp at every stop across Japan</p>
          </div>
          <ChevronRight size={20} className="text-ink/30" />
        </Link>
      </Section>

      <Section title="Kana charts">
        <div className="grid grid-cols-2 gap-3">
          <ChartCard to="/practice/kana/hiragana" glyph="あ" title="Hiragana" />
          <ChartCard to="/practice/kana/katakana" glyph="ア" title="Katakana" />
        </div>
      </Section>

      <Section title="Library">
        <div className="panel !rounded-2xl divide-y divide-line">
          <Row to="/practice/library/vocab" icon={BookOpen} title="Words" meta={`${learned('vocab')} learned of ${total('vocab')}`} color="oklch(52% 0.10 150)" />
          <Row to="/practice/library/kanji" icon={PenTool} title="Kanji" meta={`${learned('kanji')} learned of ${total('kanji')}`} color="oklch(48% 0.11 310)" />
          <Row to="/practice/library/grammar" icon={Puzzle} title="Grammar" meta={`${learned('grammar')} learned of ${total('grammar')}`} color="oklch(50% 0.10 255)" />
        </div>
      </Section>

      <Section title="JLPT exam prep" id="exam">
        <div className="rounded-3xl border-[2.5px] border-dashed border-outline/40 p-5 flex gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gold/15 text-gold flex items-center justify-center shrink-0">
            <GraduationCap size={22} />
          </div>
          <div>
            <p className="font-bold">N5 & N4 mock exams</p>
            <p className="text-sm text-ink/50 mt-1 leading-relaxed">
              Timed tests in the three real JLPT sections: vocabulary, grammar & reading, and listening, scored by section.
            </p>
            <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-extrabold text-gold">
              <Clock size={13} /> Being built: arrives with the full N5 course
            </p>
          </div>
        </div>
      </Section>
    </div>
  )
}

function Section({ title, children, id }) {
  return (
    <section id={id} className="mt-7 scroll-mt-6">
      <h2 className="eyebrow text-ink/45 mb-3">{title}</h2>
      {children}
    </section>
  )
}

function ChartCard({ to, glyph, title }) {
  return (
    <Link to={to} className="tile p-4 flex flex-col gap-2">
      <span className="font-hand text-5xl text-torii">{glyph}</span>
      <span className="font-bold">{title}</span>
    </Link>
  )
}

function Row({ to, icon: Icon, title, meta, color }) {
  return (
    <Link to={to} className="flex items-center gap-3 p-4 active:bg-ink/[0.02]">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `color-mix(in oklch, ${color} 14%, white)`, color }}>
        <Icon size={19} />
      </div>
      <div className="flex-1">
        <p className="font-bold">{title}</p>
        <p className="text-xs text-ink/45">{meta}</p>
      </div>
      <ChevronRight size={18} className="text-ink/25" />
    </Link>
  )
}
