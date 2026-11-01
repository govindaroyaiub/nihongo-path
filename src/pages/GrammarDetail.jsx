import { useParams, Navigate } from 'react-router-dom'
import { getItem, getUnit } from '../lib/curriculum'
import { toPlain } from '../lib/furigana'
import GrammarTeach from '../components/lesson/GrammarTeach'
import PageHeader from '../components/PageHeader'

export default function GrammarDetail() {
  const { itemId } = useParams()
  const item = getItem(itemId)
  if (!item || item.type !== 'grammar') return <Navigate to="/practice/library/grammar" replace />
  const unit = getUnit(item.unitId)
  return (
    <div className="flex-1 overflow-y-auto pb-10">
      <PageHeader eyebrow={`${item.level} · Unit ${unit.number}`} title={toPlain(item.title)} />
      <div className="px-5">
        <GrammarTeach item={item} />
      </div>
    </div>
  )
}
