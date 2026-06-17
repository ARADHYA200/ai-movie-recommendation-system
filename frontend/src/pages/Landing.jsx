import { Link } from "react-router-dom"

export default function Landing() {
  const features = [
    {
      icon: "🎬",
      title: "Movie Analysis",
      description: "Add your favorite movies and let AI analyze your cinematic preferences.",
    },
    {
      icon: "🧬",
      title: "DNA Profile",
      description: "Discover your unique movie personality archetype and traits.",
    },
    {
      icon: "📊",
      title: "Analytics",
      description: "Explore genre affinity, personality traits, and confidence scores.",
    },
    {
      icon: "🎯",
      title: "Recommendations",
      description: "Get personalized movie suggestions based on your taste profile.",
    },
  ]

  return (
    <div className="min-h-[calc(100vh-56px)] flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold">
              <span className="block text-white mb-2">Discover Your</span>
              <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Movie DNA
              </span>
            </h1>
            <p className="text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto leading-relaxed">
              Explore your cinematic personality with AI-powered analysis. Add your favorite movies,
              uncover personality traits, and get recommendations tailored to your unique taste.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              to="/browse"
              className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 text-lg font-semibold text-white transition hover:from-purple-500 hover:to-pink-500 hover:shadow-lg hover:shadow-purple-500/50"
            >
              Browse Movies
              <span className="ml-2">→</span>
            </Link>
            <Link
              to="/analyzer"
              className="inline-flex items-center justify-center rounded-2xl border border-zinc-700 px-8 py-4 text-lg font-semibold text-zinc-100 transition hover:border-purple-500 hover:bg-purple-500/5"
            >
              Analyze My Taste
            </Link>
            <a
              href="#features"
              className="inline-flex items-center justify-center rounded-2xl border border-zinc-700 px-8 py-4 text-lg font-semibold text-zinc-100 transition hover:border-purple-500 hover:bg-purple-500/5"
            >
              Learn More
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-8">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
              <p className="text-2xl md:text-3xl font-bold text-purple-400">5000+</p>
              <p className="text-sm text-zinc-400">Movies analyzed</p>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
              <p className="text-2xl md:text-3xl font-bold text-pink-400">6</p>
              <p className="text-sm text-zinc-400">Archetypes</p>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4 col-span-2 md:col-span-1">
              <p className="text-2xl md:text-3xl font-bold text-cyan-400">100%</p>
              <p className="text-sm text-zinc-400">AI Powered</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 py-20 bg-zinc-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-[0.3em] text-pink-400 mb-2">Features</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              How it works
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8 hover:border-purple-500/50 transition group"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-zinc-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Use */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-[0.3em] text-pink-400 mb-2">Process</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Get started in 3 steps
            </h2>
          </div>

          <div className="space-y-6">
            {[
              {
                step: 1,
                title: "Add Movies",
                desc: "Enter your favorite movies or films you love watching.",
              },
              {
                step: 2,
                title: "Get Analysis",
                desc: "Our AI analyzes your selections to create your movie personality DNA.",
              },
              {
                step: 3,
                title: "Explore Results",
                desc: "View your personality profile, traits, and personalized recommendations.",
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg">
                    {item.step}
                  </div>
                </div>
                <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 flex-1">
                  <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-zinc-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/browse"
              className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 text-lg font-semibold text-white transition hover:from-purple-500 hover:to-pink-500"
            >
              Browse Movies
            </Link>
            <Link
              to="/analyzer"
              className="inline-flex items-center justify-center rounded-2xl border border-zinc-700 px-8 py-4 text-lg font-semibold text-zinc-100 transition hover:border-purple-500 hover:bg-purple-500/5"
            >
              Start Your Analysis
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}