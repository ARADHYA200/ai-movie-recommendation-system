import { useRef } from "react"
import MovieCard from "./MovieCard"

export default function MovieRow({ title, movies = [], onMovieClick, onFavorite, onWatchlist, getFavorite, getWatchlist }) {
  const scrollRef = useRef(null)

  const scroll = (direction) => {
    if (!scrollRef.current) return
    const amount = direction === "left" ? -320 : 320
    scrollRef.current.scrollBy({ left: amount, behavior: "smooth" })
  }

  if (!movies.length) return null

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xl md:text-2xl font-bold text-white">{title}</h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => scroll("left")}
            className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white transition flex items-center justify-center"
            aria-label="Scroll left"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white transition flex items-center justify-center"
            aria-label="Scroll right"
          >
            ›
          </button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {movies.map((movie) => (
          <div key={movie.id} className="flex-shrink-0 snap-start">
            <MovieCard
              movie={movie}
              compact
              onClick={onMovieClick}
              onFavorite={onFavorite}
              onWatchlist={onWatchlist}
              isFavorite={getFavorite?.(movie.id)}
              isInWatchlist={getWatchlist?.(movie.id)}
            />
          </div>
        ))}
      </div>
    </section>
  )
}
