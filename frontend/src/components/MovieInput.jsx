import { useState } from "react"

export default function MovieInput({ movies, onMoviesChange }) {
  const [touchedIndex, setTouchedIndex] = useState(-1)

  const updateMovie = (index, value) => {
    const next = [...movies]
    next[index] = value
    onMoviesChange(next)
  }

  const addMovie = () => onMoviesChange([...movies, ""])
  const removeMovie = (index) => onMoviesChange(movies.filter((_, idx) => idx !== index))

  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-sm shadow-purple-500/5">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-pink-400">Favorite movies</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Tell us what you love watching.</h2>
        </div>
        <button
          type="button"
          onClick={addMovie}
          className="rounded-2xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-500"
        >
          Add Movie
        </button>
      </div>

      <div className="space-y-4">
        {movies.map((movie, index) => {
          const hasError = touchedIndex === index && !movie.trim()
          return (
            <div key={`movie-${index}`} className="space-y-2 rounded-3xl border border-zinc-800 bg-zinc-900 p-4">
              <div className="flex items-center justify-between gap-3">
                <label className="text-sm font-semibold text-white">Movie #{index + 1}</label>
                {movies.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => removeMovie(index)}
                    className="text-sm text-zinc-400 transition hover:text-white"
                  >
                    Remove
                  </button>
                ) : null}
              </div>

              <input
                value={movie}
                onChange={(event) => updateMovie(index, event.target.value)}
                onBlur={() => setTouchedIndex(index)}
                placeholder="Enter movie title"
                className={`w-full rounded-2xl border px-4 py-3 text-white outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 ${
                  hasError ? "border-rose-500 bg-rose-500/10" : "border-zinc-800 bg-zinc-950"
                }`}
              />
              {hasError ? (
                <p className="text-sm text-rose-400">This field cannot be empty.</p>
              ) : null}
            </div>
          )
        })}
      </div>

      <p className="mt-5 text-sm text-zinc-400">
        Use clear movie titles for the best AI matches. Add at least one movie to generate your profile.
      </p>
    </div>
  )
}
