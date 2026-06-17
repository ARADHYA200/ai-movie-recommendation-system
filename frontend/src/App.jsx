import { Routes, Route, Navigate } from "react-router-dom"
import Landing from "./pages/Landing"
import Browse from "./pages/Browse"
import SearchPage from "./pages/SearchPage"
import MovieDetail from "./pages/MovieDetail"
import Analyzer from "./pages/Analyzer"
import Dashboard from "./pages/Dashboard"
import NotFound from "./pages/NotFound"
import Navbar from "./layout/Navbar"
import Footer from "./layout/Footer"

export default function App() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/analyzer" element={<Analyzer />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
