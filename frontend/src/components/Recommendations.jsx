export default function Recommendations({ items = [] }) {
  return (
    <aside className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.3em] text-pink-400">Recommendations</p>
        <h2 className="mt-3 text-2xl font-semibold text-white">
          Discover Your Next Favorite
        </h2>
        <p className="mt-2 text-sm text-zinc-400">
          Movies tailored to your taste profile
        </p>
      </div>

      {items && items.length > 0 ? (
        <div className="space-y-4">
          {items.map((movie, index) => {
            const matchPercentage = Math.round((movie.match_score || 0) * 100)
            return (
              <div
                key={`${movie.title}-${index}`}
                className="group rounded-3xl border border-zinc-800 bg-zinc-900 p-5 transition hover:border-purple-500/50 hover:bg-zinc-900/80"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-semibold text-white group-hover:text-purple-300 transition flex-1 line-clamp-2">
                    {movie.title}
                  </h3>
                  <div className="flex-shrink-0 flex items-center gap-1">
                    <span className="inline-flex h-6 px-2.5 rounded-full bg-purple-500/20 text-xs font-bold text-purple-300">
                      {matchPercentage}%
                    </span>
                  </div>
                </div>
                <p className="text-sm text-zinc-400">{movie.reason}</p>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 text-center">
          <p className="text-zinc-400">
            No recommendations available yet. Submit your favorite movies to receive personalized suggestions.
          </p>
        </div>
      )}
    </aside>
  )
}
