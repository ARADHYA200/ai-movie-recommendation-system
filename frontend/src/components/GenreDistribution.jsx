export default function GenreDistribution({ genreAffinity = [] }) {
  if (!genreAffinity || genreAffinity.length === 0) {
    return (
      <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8">
        <h2 className="text-2xl font-semibold text-white mb-6">Genre Preferences</h2>
        <p className="text-zinc-400">No genre data available. Submit your movies first.</p>
      </div>
    )
  }

  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8">
      <h2 className="text-2xl font-semibold text-white mb-8">Your Genre Preferences</h2>
      
      <div className="space-y-4">
        {genreAffinity.map((item) => (
          <div key={item.genre} className="rounded-2xl bg-zinc-900 p-4">
            <div className="flex items-center justify-between gap-4 mb-2">
              <p className="font-semibold text-white">{item.genre}</p>
              <p className="text-sm text-zinc-400">{item.percentage}%</p>
            </div>
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                style={{ width: `${item.percentage}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-zinc-500">
              Found in {item.movie_count} of your movies
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
