import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import MovieRow from "../components/MovieRow"
import SkeletonLoader from "../components/SkeletonLoader"
import ErrorState from "../components/ErrorState"
import { fetchTrending, fetchTopRated } from "../services/api"
import {
  getFavorites,
  getWatchlist,
  getRecentlyViewed,
  toggleFavorite,
  toggleWatchlist,
  isFavorite,
  isInWatchlist,
} from "../hooks/useUserStorage"

export default function Browse() {
  const navigate = useNavigate()
  const [trending, setTrending] = useState([])
  const [topRated, setTopRated] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [favorites, setFavorites] = useState(getFavorites())
  const [watchlist, setWatchlist] = useState(getWatchlist())
  const [recent, setRecent] = useState(getRecentlyViewed())

  const load = async () => {
    setLoading(true)
    setError("")
    try {
      const [trendingData, topRatedData] = await Promise.all([
        fetchTrending(20),
        fetchTopRated(20),
      ])
      setTrending(trendingData)
      setTopRated(topRatedData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleMovieClick = (movie) => navigate(`/movie/${movie.id}`)
  const handleFavorite = (movie) => { setFavorites(toggleFavorite(movie)) }
  const handleWatchlist = (movie) => { setWatchlist(toggleWatchlist(movie)) }

  const heroMovie = trending[0]

  return (
    <div className="space-y-10 pb-16">
      {heroMovie && !loading && (
        <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-zinc-950 to-zinc-950" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
          <div className="relative max-w-7xl mx-auto px-6 h-full flex flex-col justify-end pb-12">
            <p className="text-sm uppercase tracking-[0.3em] text-pink-400 mb-2">Featured</p>
            <h1 className="text-4xl md:text-6xl font-bold text-white max-w-3xl mb-4">{heroMovie.title}</h1>
            <p className="text-zinc-300 max-w-2xl line-clamp-3 mb-6">{heroMovie.overview}</p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => handleMovieClick(heroMovie)}
                className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-zinc-950 hover:bg-zinc-200 transition"
              >
                View Details
              </button>
              <Link
                to="/analyzer"
                className="rounded-xl bg-zinc-800/80 backdrop-blur px-6 py-3 text-sm font-semibold text-white hover:bg-zinc-700 transition"
              >
                Analyze My Taste
              </Link>
            </div>
          </div>
        </section>
      )}

      <div className="max-w-7xl mx-auto px-6 space-y-10">
        {loading && <SkeletonLoader variant="row" count={8} />}
        {error && <ErrorState message={error} onRetry={load} />}

        {!loading && !error && (
          <>
            {recent.length > 0 && (
              <MovieRow
                title="Recently Viewed"
                movies={recent}
                onMovieClick={handleMovieClick}
                onFavorite={handleFavorite}
                onWatchlist={handleWatchlist}
                getFavorite={isFavorite}
                getWatchlist={isInWatchlist}
              />
            )}
            {favorites.length > 0 && (
              <MovieRow
                title="Your Favorites"
                movies={favorites}
                onMovieClick={handleMovieClick}
                onFavorite={handleFavorite}
                onWatchlist={handleWatchlist}
                getFavorite={isFavorite}
                getWatchlist={isInWatchlist}
              />
            )}
            {watchlist.length > 0 && (
              <MovieRow
                title="Your Watchlist"
                movies={watchlist}
                onMovieClick={handleMovieClick}
                onFavorite={handleFavorite}
                onWatchlist={handleWatchlist}
                getFavorite={isFavorite}
                getWatchlist={isInWatchlist}
              />
            )}
            <MovieRow
              title="Trending Now"
              movies={trending}
              onMovieClick={handleMovieClick}
              onFavorite={handleFavorite}
              onWatchlist={handleWatchlist}
              getFavorite={isFavorite}
              getWatchlist={isInWatchlist}
            />
            <MovieRow
              title="Top Rated"
              movies={topRated}
              onMovieClick={handleMovieClick}
              onFavorite={handleFavorite}
              onWatchlist={handleWatchlist}
              getFavorite={isFavorite}
              getWatchlist={isInWatchlist}
            />
          </>
        )}
      </div>
    </div>
  )
}
