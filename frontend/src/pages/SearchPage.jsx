import { useEffect, useState, useCallback } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import FilterBar from "../components/FilterBar"
import MovieCard from "../components/MovieCard"
import SkeletonLoader from "../components/SkeletonLoader"
import ErrorState from "../components/ErrorState"
import EmptyState from "../components/EmptyState"
import { searchMovies, fetchGenres } from "../services/api"
import {
  toggleFavorite,
  toggleWatchlist,
  isFavorite,
  isInWatchlist,
} from "../hooks/useUserStorage"

const DEFAULT_FILTERS = {
  q: "",
  genre: null,
  min_rating: null,
  year: null,
  language: null,
  sort_by: "popularity",
  page: 1,
  limit: 20,
}

export default function SearchPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [filters, setFilters] = useState({
    ...DEFAULT_FILTERS,
    genre: searchParams.get("genre") || null,
  })
  const [genres, setGenres] = useState([])
  const [results, setResults] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [, setRefresh] = useState(0)

  useEffect(() => {
    fetchGenres()
      .then((data) => setGenres(data.genres || []))
      .catch(() => {})
  }, [])

  const doSearch = useCallback(async (currentFilters) => {
    setLoading(true)
    setError("")
    try {
      const params = {}
      Object.entries(currentFilters).forEach(([key, val]) => {
        if (val !== null && val !== "" && val !== undefined) params[key] = val
      })
      const data = await searchMovies(params)
      setResults(data.movies || [])
      setTotal(data.total || 0)
    } catch (err) {
      setError(err.message)
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => doSearch(filters), 300)
    return () => clearTimeout(timer)
  }, [filters, doSearch])

  const updateFilters = (patch) => {
    setFilters((prev) => ({ ...prev, ...patch, page: 1 }))
  }

  const resetFilters = () => setFilters(DEFAULT_FILTERS)

  const handleFavorite = (movie) => { toggleFavorite(movie); setRefresh((n) => n + 1) }
  const handleWatchlist = (movie) => { toggleWatchlist(movie); setRefresh((n) => n + 1) }

  return (
    <section className="max-w-7xl mx-auto py-10 px-6 space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-pink-400">Discover</p>
        <h1 className="mt-2 text-3xl md:text-4xl font-bold text-white">Search & Filter Movies</h1>
        <p className="mt-2 text-zinc-400">Find movies by title, genre, rating, year, and language.</p>
      </div>

      <FilterBar filters={filters} genres={genres} onChange={updateFilters} onReset={resetFilters} />

      {loading && <SkeletonLoader count={10} />}
      {error && <ErrorState message={error} onRetry={() => doSearch(filters)} />}

      {!loading && !error && results.length === 0 && (
        <EmptyState
          title="No movies found"
          message="Try adjusting your search or filters to find more results."
          actionLabel="Reset Filters"
          onAction={resetFilters}
        />
      )}

      {!loading && !error && results.length > 0 && (
        <>
          <p className="text-sm text-zinc-500">{total} movies found</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {results.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onClick={(m) => navigate(`/movie/${m.id}`)}
                onFavorite={handleFavorite}
                onWatchlist={handleWatchlist}
                isFavorite={isFavorite(movie.id)}
                isInWatchlist={isInWatchlist(movie.id)}
              />
            ))}
          </div>
          {total > filters.limit && (
            <div className="flex justify-center gap-3 pt-4">
              <button
                type="button"
                disabled={filters.page <= 1}
                onClick={() => setFilters((f) => ({ ...f, page: f.page - 1 }))}
                className="rounded-xl border border-zinc-700 px-4 py-2 text-sm text-zinc-300 disabled:opacity-40 hover:border-zinc-500 transition"
              >
                Previous
              </button>
              <span className="flex items-center text-sm text-zinc-500">Page {filters.page}</span>
              <button
                type="button"
                disabled={filters.page * filters.limit >= total}
                onClick={() => setFilters((f) => ({ ...f, page: f.page + 1 }))}
                className="rounded-xl border border-zinc-700 px-4 py-2 text-sm text-zinc-300 disabled:opacity-40 hover:border-zinc-500 transition"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </section>
  )
}
