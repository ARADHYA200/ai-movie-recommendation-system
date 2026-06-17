export default function ErrorState({ message = "Something went wrong.", onRetry }) {
  return (
    <div className="rounded-2xl border border-rose-500/30 bg-rose-500/5 p-8 text-center">
      <p className="text-4xl mb-4">⚠</p>
      <h3 className="text-lg font-semibold text-white mb-2">Error</h3>
      <p className="text-zinc-400 mb-6">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-xl bg-purple-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-purple-500 transition"
        >
          Try Again
        </button>
      )}
    </div>
  )
}
