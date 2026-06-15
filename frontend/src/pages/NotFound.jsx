import { Link } from "react-router-dom"

export default function NotFound() {
  return (
    <section className="flex min-h-[calc(100vh-112px)] items-center justify-center bg-zinc-950 px-6 py-16 text-center">
      <div className="max-w-2xl rounded-[32px] border border-zinc-800 bg-zinc-900 p-10 shadow-xl">
        <p className="text-sm uppercase tracking-[0.3em] text-pink-400">Page not found</p>
        <h1 className="mt-6 text-5xl font-semibold text-white">404</h1>
        <p className="mt-4 text-zinc-400">
          The page you are looking for does not exist. Return to the analyzer or the landing page to continue.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/"
            className="rounded-2xl bg-purple-600 px-6 py-3 text-white transition hover:bg-purple-500"
          >
            Home
          </Link>
          <Link
            to="/analyzer"
            className="rounded-2xl border border-zinc-700 px-6 py-3 text-white transition hover:border-purple-500"
          >
            Analyzer
          </Link>
        </div>
      </div>
    </section>
  )
}
