export default function DNACard({
  label,
  archetype = "Unknown",
  description = "",
  dnaScore = 0,
  confidenceScore = 0,
  movies = [],
}) {
  return (
    <div className="rounded-[32px] border border-zinc-800 bg-zinc-950 p-8 shadow-[0_20px_120px_-40px_rgba(124,58,237,0.35)]">
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-pink-400">Your Personality</p>
            <h2 className="mt-3 text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {label || "Cinematic Explorer"}
            </h2>
            <p className="mt-2 text-sm text-zinc-300">{archetype}</p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 mb-2">DNA Score</p>
            <p className="text-4xl font-bold text-purple-400">{Math.round(dnaScore)}%</p>
          </div>
        </div>

        <p className="mt-6 text-zinc-300 leading-relaxed">{description}</p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-zinc-900 p-3">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 mb-1">Confidence</p>
            <p className="text-2xl font-semibold text-cyan-400">{Math.round(confidenceScore * 100)}%</p>
          </div>
          <div className="rounded-2xl bg-zinc-900 p-3">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 mb-1">Movies</p>
            <p className="text-2xl font-semibold text-emerald-400">{movies.length}</p>
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-800 pt-6">
        <p className="text-xs uppercase tracking-[0.2em] text-pink-400 mb-4">Analyzed Movies</p>
        {movies.length ? (
          <ul className="space-y-2 text-sm text-zinc-100">
            {movies.map((movie, index) => (
              <li key={`${movie}-${index}`} className="rounded-2xl border border-zinc-800 bg-zinc-900 px-3 py-2 flex items-center gap-2">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-purple-600/30 text-xs font-bold text-purple-300">
                  {index + 1}
                </span>
                <span>{movie}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-zinc-400">No movies analyzed yet.</p>
        )}
      </div>
    </div>
  )
}
