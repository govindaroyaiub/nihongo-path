import { useRef, useState } from 'react'
import { Check, X } from 'lucide-react'

const SWIPE_THRESHOLD = 90
const TAP_THRESHOLD = 6

export default function FlashCard({ front, back, flipped, onFlip, onSwipe }) {
  const [dragX, setDragX] = useState(0)
  const dragging = useRef(false)
  const startX = useRef(0)

  function handlePointerDown(e) {
    dragging.current = true
    startX.current = e.clientX
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  function handlePointerMove(e) {
    if (!dragging.current) return
    setDragX(e.clientX - startX.current)
  }

  function handlePointerUp() {
    if (!dragging.current) return
    dragging.current = false

    if (dragX > SWIPE_THRESHOLD) {
      onSwipe('correct')
    } else if (dragX < -SWIPE_THRESHOLD) {
      onSwipe('incorrect')
    } else if (Math.abs(dragX) < TAP_THRESHOLD) {
      onFlip()
    }
    setDragX(0)
  }

  const rotate = dragX / 14
  const tone =
    dragX > 20
      ? 'bg-success/10 border-success'
      : dragX < -20
        ? 'bg-danger/10 border-danger'
        : 'bg-white border-ink/10'

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      <div
        className={`relative w-full aspect-[3/4] max-w-sm rounded-3xl border-2 shadow-sm select-none touch-none flex items-center justify-center px-6 text-center cursor-grab active:cursor-grabbing ${tone}`}
        style={{
          transform: `translateX(${dragX}px) rotate(${rotate}deg)`,
          transition: dragging.current ? 'none' : 'transform 200ms ease, background-color 150ms ease',
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {flipped ? back : front}

        {dragX > 20 && (
          <div className="absolute top-4 right-4 text-success">
            <Check size={32} strokeWidth={3} />
          </div>
        )}
        {dragX < -20 && (
          <div className="absolute top-4 left-4 text-danger">
            <X size={32} strokeWidth={3} />
          </div>
        )}
      </div>
      <p className="text-xs text-ink/45 px-6 text-center">
        Tap to flip · swipe right if you knew it, left if you didn't
      </p>
    </div>
  )
}
