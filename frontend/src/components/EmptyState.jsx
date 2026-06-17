export default function EmptyState({ icon = "🎬", title = "Nothing here yet", message, actionLabel, onAction }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-10 text-center">
      <p className="text-4xl mb-4">{icon}</p>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      {message && <p className="text-zinc-400 mb-6 max-w-md mx-auto">{message}</p>}
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="rounded-xl bg-purple-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-purple-500 transition"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
