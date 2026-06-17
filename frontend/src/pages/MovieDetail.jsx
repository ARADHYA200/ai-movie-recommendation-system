import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import LoadingSpinner from "../components/LoadingSpinner"
import ErrorState from "../components/ErrorState"
import MovieCard from "../components/MovieCard"
import { fetchMovieById, getRecommendations } from "../services/api"
import {
  addRecentlyViewed,
  toggleFavorite,
  toggleWatchlist,
  isFavorite,
  isInWatchlist,
  addRecommendationHistory,
} from "../hooks/useUserStorage"
import { getGenreGradient } from "../components/MovieCard"

export default function MovieDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [movie, setMovie] = useState(null)
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)
  const [recLoading, setRecLoading] = useState(false)
  const [error, setError] = useState("")
  const [fav, setFav] = useState(false)
  const [watch, setWatch] = useState(false)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError("")
      try {
        const data = await fetchMovieById(id)
        setMovie(data)
        addRecentlyViewed(data)
        setFav(isFavorite(data.id))
        setWatch(isInWatchlist(data.id))

        setRecLoading(true)
        try {
          const recData = await getRecommendations([data.title], 6)
          setRecommendations(recData.recommendations || [])
          addRecommendationHistory({
            source: data.title,
            recommendations: recData.recommendations?.slice(0, 3).map((r) => r.title) || [],
          })
        } catch {
          setRecommendations([])
        } finally {
          setRecLoading(false)
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner label="Loading movie..." />
      </div>
    )
  }

  if (error || !movie) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-6">
        <ErrorState message={error || "Movie not found"} onRetry={() => navigate(0)} />
        <div className="mt-6 text-center">
          <Link to="/browse" className="text-purple-400 hover:text-purple-300">Back to Browse</Link>
        </div>
      </div>
    )
  }

  const gradient = getGenreGradient(movie.genres)

  return (
    <div className="pb-16">
      <section className={`relative bg-gradient-to-br ${gradient} bg-opacity-20`}>
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-zinc-950/40" />
        <div className="relative max-w-7xl mx-auto px-6 py-16 md:py-24">
          <Link to="/browse" className="text-sm text-zinc-400 hover:text-white transition mb-6 inline-block">
            ← Back to Browse
          </Link>
          <div className="grid md:grid-cols-[1fr_2fr] gap-8 items-start">
            <div className={`aspect-[2/3] max-w-xs rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-2xl`}>
              <span className="text-4xl font-bold text-white/80">{movie.title.slice(0, 2).toUpperCase()}</span>
            </div>
            <div className="space-y-4">
              <h1 className="text-3xl md:text-5xl font-bold text-white">{movie.title}</h1>
              {movie.tagline && <p className="text-lg text-zinc-400 italic">{movie.tagline}</p>}
              <div className="flex flex-wrap gap-3 text-sm">
                <span className="text-yellow-400 font-semibold">★ {movie.vote_average}</span>
                {movie.release_year && <span className="text-zinc-400">{movie.release_year}</span>}
                <span className="text-zinc-500 uppercase">{movie.original_language}</span>
                {movie.director && <span className="text-zinc-400">Dir: {movie.director}</span>}
              </div>
              <div className="flex flex-wrap gap-2">
                {movie.genres?.map((g) => (
                  <Link
                    key={g}
                    to={`/search?genre=${encodeURIComponent(g)}`}
                    className="text-xs px-3 py-1 rounded-full bg-zinc-800 text-zinc-300 hover:bg-purple-600/30 hover:text-purple-300 transition"
                  >
                    {g}
                  </Link>
                ))}
              </div>
              <p className="text-zinc-300 leading-relaxed max-w-3xl">{movie.overview}</p>
              {movie.cast?.length > 0 && (
                <p className="text-sm text-zinc-500">
                  <span className="text-zinc-400 font-medium">Cast:</span> {movie.cast.join(", ")}
                </p>
              )}
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { toggleFavorite(movie); setFav(isFavorite(movie.id)) }}
                  className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
                    fav ? "bg-red-500/20 text-red-300 border border-red-500/40" : "bg-zinc-800 text-white hover:bg-zinc-700"
                  }`}
                >
                  {fav ? "♥ Favorited" : "♡ Add to Favorites"}
                </button>
                <button
                  type="button"
                  onClick={() => { toggleWatchlist(movie); setWatch(isInWatchlist(movie.id)) }}
                  className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
                    watch ? "bg-purple-500/20 text-purple-300 border border-purple-500/40" : "bg-zinc-800 text-white hover:bg-zinc-700"
                  }`}
                >
                  {watch ? "✓ In Watchlist" : "+ Add to Watchlist"}
                </button>
                <Link
                  to="/analyzer"
                  className="rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-5 py-2.5 text-sm font-semibold text-white hover:from-purple-500 hover:to-pink-500 transition"
                >
                  Analyze Taste
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pt-12">
        <h2 className="text-2xl font-bold text-white mb-6">Similar Movies</h2>
        {recLoading && <LoadingSpinner label="Finding similar movies..." />}
        {!recLoading && recommendations.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {recommendations.map((rec) => (
              <MovieCard
                key={rec.id}
                movie={rec}
                compact
                onClick={(m) => navigate(`/movie/${m.id}`)}
              />
            ))}
          </div>
        )}
        {!recLoading && recommendations.length === 0 && (
          <p className="text-zinc-500">No similar movies found.</p>
        )}
      </section>
    </div>
  )
}
