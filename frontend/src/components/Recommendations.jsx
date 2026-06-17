import { Link } from "react-router-dom"
import { getGenreGradient } from "./MovieCard"

export default function Recommendations({ items = [] }) {
  return (
    <aside className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 md:p-8">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.3em] text-pink-400">Recommendations</p>
        <h2 className="mt-3 text-2xl font-semibold text-white">Discover Your Next Favorite</h2>
        <p className="mt-2 text-sm text-zinc-400">Movies tailored to your taste profile</p>
      </div>

      {items && items.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((movie, index) => {
            const matchPercentage = Math.round((movie.match_score || 0) * 100)
            const gradient = getGenreGradient(movie.genres)
            return (
              <Link
                key={`${movie.id || movie.title}-${index}`}
                to={movie.id ? `/movie/${movie.id}` : "/browse"}
                className="group rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden transition hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10"
              >
                <div className={`h-24 bg-gradient-to-r ${gradient} opacity-60 group-hover:opacity-80 transition`} />
                <div className="p-4 -mt-6">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-white group-hover:text-purple-300 transition line-clamp-2">
                      {movie.title}
                    </h3>
                    <span className="flex-shrink-0 inline-flex h-6 px-2 rounded-full bg-purple-500/20 text-xs font-bold text-purple-300">
                      {matchPercentage}%
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {movie.genres?.slice(0, 2).map((g) => (
                      <span key={g} className="text-[10px] px-1.5 py-0.5 rounded-full bg-zinc-800 text-zinc-400">{g}</span>
                    ))}
                    {movie.release_year && (
                      <span className="text-[10px] text-zinc-500">{movie.release_year}</span>
                    )}
                    {movie.vote_average > 0 && (
                      <span className="text-[10px] text-yellow-500">★ {movie.vote_average}</span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 line-clamp-2">{movie.reason}</p>
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 text-center">
          <p className="text-zinc-400">
            No recommendations available yet. Submit your favorite movies to receive personalized suggestions.
          </p>
        </div>
      )}
    </aside>
  )
}
