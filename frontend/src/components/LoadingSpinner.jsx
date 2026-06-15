export default function LoadingSpinner({ label = "Loading..." }) {
  return (
    <div className="inline-flex items-center gap-3 text-sm font-semibold text-white">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
      <span>{label}</span>
    </div>
  )
}
