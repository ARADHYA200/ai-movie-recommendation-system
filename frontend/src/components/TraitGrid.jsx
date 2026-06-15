export default function TraitGrid({ traits = [] }) {
  if (!traits || traits.length === 0) {
    return (
      <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8">
        <h2 className="text-2xl font-semibold text-white mb-6">Personality Traits</h2>
        <p className="text-zinc-400">No trait data available yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {traits.map((trait) => (
        <div
          key={trait.name}
          className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 hover:border-purple-500/30 transition"
        >
          <div className="flex items-center justify-between gap-4 mb-2">
            <h3 className="text-lg font-semibold text-white">{trait.name}</h3>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-purple-400">{trait.value}%</span>
            </div>
          </div>

          <p className="text-sm text-zinc-400 mb-4">{trait.description}</p>

          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 transition-all duration-700"
              style={{ width: `${trait.value}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
