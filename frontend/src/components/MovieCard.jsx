const GENRE_COLORS = {
  Action: "from-red-600 to-orange-500",
  Adventure: "from-amber-500 to-yellow-400",
  Animation: "from-pink-500 to-rose-400",
  Comedy: "from-yellow-500 to-lime-400",
  Crime: "from-zinc-600 to-zinc-400",
  Documentary: "from-emerald-600 to-teal-400",
  Drama: "from-purple-600 to-indigo-500",
  Family: "from-sky-400 to-blue-400",
  Fantasy: "from-violet-600 to-purple-400",
  History: "from-amber-700 to-orange-600",
  Horror: "from-red-900 to-red-600",
  Music: "from-fuchsia-500 to-pink-500",
  Mystery: "from-slate-600 to-slate-400",
  Romance: "from-rose-500 to-pink-400",
  "Science Fiction": "from-cyan-500 to-blue-500",
  Thriller: "from-zinc-700 to-zinc-500",
  War: "from-stone-600 to-stone-400",
  Western: "from-orange-700 to-amber-600",
}

export function getGenreGradient(genres = []) {
  const primary = genres[0] || "Drama"
  return GENRE_COLORS[primary] || "from-purple-600 to-pink-600"
}

export function getInitials(title = "") {
  return title
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
}

export default function MovieCard({
  movie,
  onFavorite,
  onWatchlist,
  isFavorite = false,
  isInWatchlist = false,
  compact = false,
  onClick,
}) {
  const gradient = getGenreGradient(movie.genres)
  const year = movie.release_year || ""

  return (
    <article
      className={`group relative overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-900 transition-all duration-300 hover:scale-[1.03] hover:border-purple-500/40 hover:shadow-xl hover:shadow-purple-500/10 cursor-pointer ${
        compact ? "w-36 sm:w-40" : "w-full"
      }`}
      onClick={() => onClick?.(movie)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick?.(movie)}
    >
      <div className={`aspect-[2/3] bg-gradient-to-br ${gradient} flex items-center justify-center p-3`}>
        <span className="text-center text-lg font-bold text-white/90 drop-shadow-lg line-clamp-3">
          {getInitials(movie.title)}
        </span>
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80" />
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <p className="text-xs font-semibold text-white line-clamp-2">{movie.title}</p>
          {year && <p className="text-[10px] text-zinc-300 mt-0.5">{year}</p>}
        </div>
      </div>

      {!compact && (
        <div className="p-3 space-y-2">
          <h3 className="font-semibold text-white text-sm line-clamp-1">{movie.title}</h3>
          <div className="flex items-center justify-between">
            <span className="text-xs text-yellow-400">★ {movie.vote_average?.toFixed(1) || "N/A"}</span>
            {year && <span className="text-xs text-zinc-500">{year}</span>}
          </div>
          {movie.genres?.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {movie.genres.slice(0, 2).map((g) => (
                <span key={g} className="text-[10px] px-1.5 py-0.5 rounded-full bg-zinc-800 text-zinc-400">
                  {g}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {(onFavorite || onWatchlist) && (
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onFavorite && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onFavorite(movie) }}
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs backdrop-blur-sm ${
                isFavorite ? "bg-red-500/80 text-white" : "bg-black/50 text-zinc-300 hover:bg-black/70"
              }`}
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              ♥
            </button>
          )}
          {onWatchlist && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onWatchlist(movie) }}
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs backdrop-blur-sm ${
                isInWatchlist ? "bg-purple-500/80 text-white" : "bg-black/50 text-zinc-300 hover:bg-black/70"
              }`}
              aria-label={isInWatchlist ? "Remove from watchlist" : "Add to watchlist"}
            >
              +
            </button>
          )}
        </div>
      )}
    </article>
  )
}
