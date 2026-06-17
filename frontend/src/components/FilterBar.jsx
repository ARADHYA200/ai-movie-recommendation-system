export default function FilterBar({ filters, genres = [], onChange, onReset }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 md:p-6 space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <div className="sm:col-span-2 lg:col-span-3 xl:col-span-2">
          <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-1.5">Search</label>
          <input
            type="text"
            value={filters.q || ""}
            onChange={(e) => onChange({ q: e.target.value })}
            placeholder="Title, actor, director..."
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-white placeholder-zinc-500 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-1.5">Genre</label>
          <select
            value={filters.genre || ""}
            onChange={(e) => onChange({ genre: e.target.value || null })}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-white outline-none focus:border-purple-500"
          >
            <option value="">All Genres</option>
            {genres.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-1.5">Min Rating</label>
          <select
            value={filters.min_rating || ""}
            onChange={(e) => onChange({ min_rating: e.target.value ? Number(e.target.value) : null })}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-white outline-none focus:border-purple-500"
          >
            <option value="">Any</option>
            {[5, 6, 7, 8, 9].map((r) => (
              <option key={r} value={r}>{r}+</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-1.5">Year</label>
          <input
            type="number"
            value={filters.year || ""}
            onChange={(e) => onChange({ year: e.target.value ? Number(e.target.value) : null })}
            placeholder="e.g. 2010"
            min="1900"
            max="2030"
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-white placeholder-zinc-500 outline-none focus:border-purple-500"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-1.5">Language</label>
          <select
            value={filters.language || ""}
            onChange={(e) => onChange({ language: e.target.value || null })}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-white outline-none focus:border-purple-500"
          >
            <option value="">All</option>
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="ja">Japanese</option>
            <option value="ko">Korean</option>
            <option value="hi">Hindi</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div>
          <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-1.5">Sort By</label>
          <select
            value={filters.sort_by || "popularity"}
            onChange={(e) => onChange({ sort_by: e.target.value })}
            className="rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white outline-none focus:border-purple-500"
          >
            <option value="popularity">Popularity</option>
            <option value="rating">Rating</option>
            <option value="title">Title</option>
            <option value="year">Year</option>
          </select>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="mt-5 rounded-xl border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:border-zinc-500 hover:text-white transition"
        >
          Reset Filters
        </button>
      </div>
    </div>
  )
}
