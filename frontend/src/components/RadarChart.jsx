import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart as RechartsRadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts"

export default function RadarChart({ traits = [] }) {
  // Convert traits to the format needed by Recharts
  const data = Array.isArray(traits)
    ? traits.map((trait) => ({
        trait: typeof trait === "object" ? trait.name : trait,
        value: typeof trait === "object" ? trait.value : 50,
      }))
    : Object.entries(traits).map(([trait, value]) => ({
        trait,
        value: Number(value) || 0,
      }))

  const maxValue = data.length ? Math.max(...data.map((item) => item.value), 100) : 100

  return (
    <div className="h-[400px] w-full">
      {data.length ? (
        <ResponsiveContainer width="100%" height="100%">
          <RechartsRadarChart data={data} outerRadius="80%">
            <PolarGrid stroke="#4b5563" />
            <PolarAngleAxis dataKey="trait" tick={{ fill: "#cbd5e1", fontSize: 12 }} />
            <PolarRadiusAxis angle={30} domain={[0, maxValue]} tick={{ fill: "#94a3b8", fontSize: 10 }} />
            <Radar dataKey="value" stroke="#a855f7" fill="#a855f7" fillOpacity={0.35} />
            <Tooltip
              wrapperStyle={{ borderRadius: 16, background: "#111827", borderColor: "#374151" }}
              contentStyle={{ borderRadius: 12, background: "#1f2937", border: "1px solid #374151" }}
            />
          </RechartsRadarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex h-full items-center justify-center rounded-3xl bg-zinc-900 text-zinc-400">
          No trait data available.
        </div>
      )}
    </div>
  )
}
