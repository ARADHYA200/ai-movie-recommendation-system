import { useState } from "react"
import { useNavigate } from "react-router-dom"
import MovieInput from "../components/MovieInput"
import LoadingSpinner from "../components/LoadingSpinner"
import Toast from "../components/Toast"
import { analyzeMovies } from "../services/api"
import useToast from "../hooks/useToast"
import { addRecommendationHistory } from "../hooks/useUserStorage"

export default function Analyzer() {
  const navigate = useNavigate()
  const [movieList, setMovieList] = useState([""])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { toast, showToast, clearToast } = useToast()

  const validMovies = movieList.map((movie) => movie.trim()).filter(Boolean)

  const handleSubmit = async () => {
    if (validMovies.length < 1) {
      const message = "Add at least one favorite movie before submitting."
      showToast(message, "error")
      setError("Please add one or more movies.")
      return
    }

    setLoading(true)
    setError("")

    try {
      const analysis = await analyzeMovies(validMovies)
      sessionStorage.setItem(
        "movieTasteDNA",
        JSON.stringify({ analysis, movies: validMovies })
      )
      showToast("Analysis completed. Redirecting to dashboard.", "success")
      addRecommendationHistory({
        source: validMovies.join(", "),
        recommendations: analysis.recommendations?.slice(0, 5).map((r) => r.title) || [],
      })
      navigate("/dashboard", { state: { analysis, movies: validMovies } })
    } catch (err) {
      const message = err?.message ?? "Unable to analyze movies."
      setError(message)
      showToast(message, "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="max-w-4xl mx-auto py-16 px-6">
      <div className="mb-12 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-pink-400">
          Movie taste analyzer
        </p>
        <h1 className="mt-4 text-4xl md:text-5xl font-semibold text-white">
          Build your cinematic DNA from favorite movies.
        </h1>
        <p className="mt-4 text-zinc-400 max-w-3xl mx-auto">
          Add multiple films, submit them to the AI backend, and explore your personality
          profile and curated movie recommendations.
        </p>
      </div>

      <div className="space-y-8">
        <MovieInput movies={movieList} onMoviesChange={setMovieList} />

        {error ? (
          <div className="rounded-2xl border border-rose-500 bg-rose-500/10 px-4 py-3 text-rose-100">
            {error}
          </div>
        ) : null}

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 text-base font-semibold text-white transition hover:from-purple-500 hover:to-pink-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? <LoadingSpinner label="Analyzing..." /> : "Analyze My Taste"}
          </button>
          <p className="text-sm text-zinc-400 max-w-xl">
            You can add as many favorite titles as you want. The AI will use the full
            list to calculate your movie personality DNA.
          </p>
        </div>
      </div>

      <Toast toast={toast} onClose={clearToast} />
    </section>
  )
}
