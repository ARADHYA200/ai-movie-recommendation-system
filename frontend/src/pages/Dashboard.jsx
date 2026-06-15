import { useEffect, useMemo, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import DNACard from "../components/DNACard"
import RadarChart from "../components/RadarChart"
import TraitGrid from "../components/TraitGrid"
import GenreDistribution from "../components/GenreDistribution"
import Recommendations from "../components/Recommendations"
import LoadingSpinner from "../components/LoadingSpinner"
import Toast from "../components/Toast"
import { getDashboardData } from "../services/api"
import useToast from "../hooks/useToast"

export default function Dashboard() {
  const { state } = useLocation()
  const [analysis, setAnalysis] = useState(state?.analysis ?? null)
  const [movies, setMovies] = useState(state?.movies ?? [])
  const [clusterData, setClusterData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { toast, showToast, clearToast } = useToast()

  useEffect(() => {
    if (!analysis) {
      const saved = sessionStorage.getItem("movieTasteDNA")
      if (saved) {
        const payload = JSON.parse(saved)
        setAnalysis(payload.analysis)
        setMovies(payload.movies ?? [])
      }
    }
  }, [analysis])

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true)
      setError("")

      try {
        const data = await getDashboardData()
        setClusterData(data.data || data)
      } catch (err) {
        const message = err?.message ?? "Unable to load dashboard data."
        setError(message)
        showToast(message, "error")
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [showToast])

  const clusterStats = useMemo(() => {
    if (!clusterData || clusterData.length === 0) return []
    
    const counts = {}
    clusterData.forEach((item) => {
      const cluster = item.cluster ?? 0
      counts[cluster] = (counts[cluster] ?? 0) + 1
    })

    const clusterNames = [
      "Dark Psychological",
      "Epic Adventure",
      "Romantic",
      "Sci-Fi",
      "Action",
      "Drama",
    ]

    return Object.entries(counts).map(([cluster, count]) => ({
      name: clusterNames[Number(cluster)] || `Cluster ${Number(cluster) + 1}`,
      count,
      cluster: Number(cluster),
    }))
  }, [clusterData])

  const stats = useMemo(() => {
    if (!analysis) return []
    return [
      {
        title: "DNA Score",
        value: `${Math.round(analysis.dna_score ?? 0)}%`,
        color: "from-purple-500 to-pink-500",
      },
      {
        title: "Movies Analyzed",
        value: analysis.movies_analyzed?.toString() ?? "0",
        color: "from-cyan-500 to-blue-500",
      },
      {
        title: "Confidence",
        value: `${Math.round((analysis.confidence_score ?? 0) * 100)}%`,
        color: "from-emerald-500 to-teal-500",
      },
      {
        title: "Recommendations",
        value: analysis.recommendations?.length?.toString() ?? "0",
        color: "from-orange-500 to-red-500",
      },
    ]
  }, [analysis])

  if (!analysis) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-6">
        <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-10 text-center">
          <h2 className="text-3xl font-semibold text-white mb-4">No analysis available yet</h2>
          <p className="text-zinc-400 mb-6">
            Start with the analyzer to submit favorite movies and generate your personality DNA.
          </p>
          <Link
            to="/analyzer"
            className="inline-flex rounded-2xl bg-purple-600 px-6 py-3 text-white hover:bg-purple-500 transition"
          >
            Go to Analyzer
          </Link>
        </div>
      </div>
    )
  }

  return (
    <section className="max-w-7xl mx-auto py-16 px-6 space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <p className="text-sm uppercase tracking-[0.3em] text-pink-400">Dashboard</p>
        <h1 className="text-4xl md:text-5xl font-semibold text-white">
          Your movie personality DNA
        </h1>
        <p className="max-w-3xl text-zinc-400">
          {analysis.description}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 hover:border-zinc-700 transition"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-400 mb-2">
              {stat.title}
            </p>
            <p className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Main DNA Card and Radar */}
      <div className="grid gap-8 xl:grid-cols-[1fr_1.2fr]">
        <DNACard
          label={analysis.personality_type}
          archetype={analysis.personality_archetype}
          description={analysis.description}
          dnaScore={analysis.dna_score}
          confidenceScore={analysis.confidence_score}
          movies={movies}
        />
        <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8">
          <h2 className="text-2xl font-semibold text-white mb-8">Personality Radar</h2>
          <RadarChart traits={analysis.traits} />
        </div>
      </div>

      {/* Traits and Genres */}
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-white px-2">Your Cinematic Traits</h2>
          <TraitGrid traits={analysis.traits} />
        </div>
        <GenreDistribution genreAffinity={analysis.genre_affinity} />
      </div>

      {/* Cluster Distribution */}
      {!loading && !error && clusterStats.length > 0 && (
        <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8">
          <h2 className="text-2xl font-semibold text-white mb-8">Movie Cluster Distribution</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {clusterStats.map((stat) => (
              <div key={stat.cluster} className="rounded-3xl bg-zinc-900 p-6 border border-zinc-800">
                <p className="text-sm text-zinc-400 mb-2">{stat.name}</p>
                <p className="text-3xl font-bold text-purple-400">{stat.count}</p>
                <p className="mt-2 text-xs text-zinc-500">movies in dataset</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-3">
          <Recommendations items={analysis.recommendations || []} />
        </div>
      </div>

      <Toast toast={toast} onClose={clearToast} />
    </section>
  )
}
