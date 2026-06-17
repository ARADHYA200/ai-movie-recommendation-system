export function SkeletonCard({ compact = false }) {
  return (
    <div className={`animate-pulse rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden ${compact ? "w-36 sm:w-40" : "w-full"}`}>
      <div className="aspect-[2/3] bg-zinc-800" />
      {!compact && (
        <div className="p-3 space-y-2">
          <div className="h-4 bg-zinc-800 rounded w-3/4" />
          <div className="h-3 bg-zinc-800 rounded w-1/2" />
        </div>
      )}
    </div>
  )
}

export function SkeletonRow({ count = 6, compact = true }) {
  return (
    <div className="flex gap-4 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} compact={compact} />
      ))}
    </div>
  )
}

export function SkeletonGrid({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}

export default function SkeletonLoader({ variant = "grid", count = 8 }) {
  if (variant === "row") return <SkeletonRow count={count} />
  return <SkeletonGrid count={count} />
}
