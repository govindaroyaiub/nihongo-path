export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  danger = false,
  onConfirm,
  onCancel,
}) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-4"
      style={{ animation: 'fade-in 200ms ease-out' }}
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm bg-paper rounded-3xl p-6 flex flex-col gap-4 shadow-xl"
        style={{ animation: 'dialog-in 300ms cubic-bezier(0.16, 1, 0.3, 1)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-display text-lg font-medium text-ink">{title}</h2>
        <p className="text-sm text-ink/60">{message}</p>
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 rounded-2xl border-2 border-ink/10 font-medium active:scale-[0.98] active:bg-ink/5 transition-transform"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`flex-1 py-3 rounded-2xl font-medium text-white active:scale-[0.98] active:opacity-90 transition-transform ${
              danger ? 'bg-danger' : 'bg-accent'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
