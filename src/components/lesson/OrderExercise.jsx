import { useMemo, useState } from 'react'
import Prompt from './Prompt'
import JpText from '../JpText'
import { shuffle } from '../../lib/exercises'

// Tap word tiles into the answer line; tap a placed tile to send it back.
export default function OrderExercise({ exercise, onAnswer, answered }) {
  const tiles = useMemo(() => {
    let order = shuffle(exercise.tokens.map((t, i) => ({ t, i })))
    // Never start already solved.
    if (order.every((x, k) => x.i === k) && order.length > 1) order = [...order.slice(1), order[0]]
    return order
  }, [exercise])
  const [placed, setPlaced] = useState([])

  const bank = tiles.filter((x) => !placed.includes(x))

  function check() {
    const sentence = placed.map((x) => x.t).join('')
    onAnswer(sentence === exercise.tokens.join(''), exercise.tokens.join(''))
  }

  return (
    <div className="flex flex-col gap-4">
      <Prompt prompt={exercise.prompt} />
      <div
        className={`min-h-[84px] rounded-2xl border-[2.5px] border-dashed p-3 flex flex-wrap gap-2 content-start ${
          answered ? (answered.correct ? 'border-matcha-deep bg-matcha/15' : 'border-torii-deep bg-torii/10 animate-shake') : 'border-outline/30'
        }`}
      >
        {placed.map((x) => (
          <Tile key={x.i} onClick={() => !answered && setPlaced(placed.filter((p) => p !== x))} text={x.t} />
        ))}
      </div>
      <div className="flex flex-wrap gap-2 justify-center min-h-[52px]">
        {bank.map((x) => (
          <Tile key={x.i} onClick={() => !answered && setPlaced([...placed, x])} text={x.t} />
        ))}
      </div>
      {!answered && (
        <button
          type="button"
          disabled={bank.length > 0}
          onClick={check}
          className="btn-sky w-full py-4"
        >
          Check
        </button>
      )}
    </div>
  )
}

function Tile({ text, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="tile px-3.5 py-2 text-lg font-bold"
    >
      <JpText text={text} />
    </button>
  )
}
