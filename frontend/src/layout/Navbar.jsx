import { Link, NavLink } from "react-router-dom"

const navigation = [
  { label: "Home", path: "/" },
  { label: "Analyzer", path: "/analyzer" },
  { label: "Dashboard", path: "/dashboard" },
]

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-xl font-semibold text-white">
          Movie Taste DNA
        </Link>

        <nav className="flex items-center gap-4">
          {navigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `rounded-2xl px-4 py-2 text-sm font-medium transition ${
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
