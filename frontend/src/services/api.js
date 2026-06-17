import axios from "axios"

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8000"

const api = axios.create({
  baseURL,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.detail ||
      error?.response?.data?.message ||
      error?.message ||
      "Network Error"
    return Promise.reject(new Error(typeof message === "string" ? message : JSON.stringify(message)))
  }
)

export async function analyzeMovies(movieList) {
  const response = await api.post("/analyze/", { movies: movieList })
  return response.data
}

export async function getRecommendations(movieList, limit = 10) {
  const response = await api.post("/recommend", { movies: movieList, limit })
  return response.data
}

export async function getDashboardData() {
  const response = await api.get("/visualize/")
  return response.data
}

export async function fetchMovies(page = 1, limit = 20, genre = null) {
  const params = { page, limit }
  if (genre) params.genre = genre
  const response = await api.get("/movies", { params })
  return response.data
}

export async function fetchMovieById(id) {
  const response = await api.get(`/movies/${id}`)
  return response.data
}

export async function searchMovies(filters = {}) {
  const response = await api.get("/search", { params: filters })
  return response.data
}

export async function fetchGenres() {
  const response = await api.get("/genres")
  return response.data
}

export async function fetchTrending(limit = 20) {
  const response = await api.get("/trending", { params: { limit } })
  return response.data
}

export async function fetchTopRated(limit = 20) {
  const response = await api.get("/top-rated", { params: { limit } })
  return response.data
}

export default api
