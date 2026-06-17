import { Link, NavLink } from "react-router-dom"

const navigation = [
  { label: "Home", path: "/" },
  { label: "Browse", path: "/browse" },
  { label: "Search", path: "/search" },
  { label: "Analyzer", path: "/analyzer" },
  { label: "Dashboard", path: "/dashboard" },
]

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 md:px-6 py-3 md:py-4">
        <Link to="/" className="text-lg md:text-xl font-bold text-white whitespace-nowrap">
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Movie Taste DNA
          </span>
        </Link>

        <nav className="flex items-center gap-1 md:gap-2 overflow-x-auto">
          {navigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `rounded-xl px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-medium transition whitespace-nowrap ${
                  isActive
                    ? "bg-purple-600 text-white"
                    : "text-zinc-300 hover:bg-zinc-900 hover:text-white"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
