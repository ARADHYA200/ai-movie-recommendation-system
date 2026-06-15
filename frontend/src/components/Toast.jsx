export default function Toast({ toast, onClose }) {
  if (!toast) {
    return null
  }

  const accent =
    toast.type === "success"
      ? "bg-emerald-500"
      : toast.type === "error"
      ? "bg-rose-500"
      : "bg-violet-500"

  return (
    <div className="fixed bottom-6 left-1/2 z-50 w-[min(92vw,420px)] -translate-x-1/2 rounded-3xl p-4 shadow-2xl shadow-black/30">
      <div className={`flex items-start justify-between gap-4 rounded-3xl px-5 py-4 text-white ${accent}`}>
        <div>
          <p className="font-semibold">{toast.type === "error" ? "Error" : "Notice"}</p>
          <p className="mt-1 text-sm leading-6">{toast.message}</p>
        </div>
        <button
          onClick={onClose}
          className="rounded-full border border-white/20 px-3 py-1 text-sm text-white/90 transition hover:bg-white/10"
          type="button"
        >
          Close
        </button>
      </div>
    </div>
  )
}
