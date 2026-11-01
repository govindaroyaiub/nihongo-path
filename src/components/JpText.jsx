import { parseFurigana } from '../lib/furigana'
import { useStore } from '../lib/store'

// Renders content markup (私[わたし]は…) with furigana above kanji. Furigana
// follows the Settings toggle unless `furigana` is passed explicitly.
export default function JpText({ text, furigana, className = '', as: Tag = 'span' }) {
  const showSetting = useStore((s) => s.settings.furigana)
  const show = furigana ?? showSetting
  return (
    <Tag className={`font-jp ${className}`} lang="ja">
      {parseFurigana(text).map((seg, i) =>
        seg.reading && show ? (
          <ruby key={i}>
            {seg.text}
            <rt>{seg.reading}</rt>
          </ruby>
        ) : (
          <span key={i}>{seg.text}</span>
        )
      )}
    </Tag>
  )
}

const JP_RE = /[぀-ヿ㐀-鿿]/

// Option / answer labels can be English or Japanese; pick the right renderer.
export function SmartText({ text, className = '' }) {
  return JP_RE.test(text) ? <JpText text={text} className={className} /> : <span className={className}>{text}</span>
}
