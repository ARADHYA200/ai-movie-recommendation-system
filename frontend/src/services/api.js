import axios from "axios"

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8000"

const api = axios.create({
  baseURL,
  timeout: 12000,
  headers: {
    "Content-Type": "application/json",
  },
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.detail || error?.response?.data?.message || error?.message || "Network Error"
    return Promise.reject(new Error(message))
  }
)

export async function analyzeMovies(movieList) {
  const response = await api.post("/analyze/", { movies: movieList })
  return response.data
}

export async function getRecommendations(movieList) {
  const analysis = await analyzeMovies(movieList)
  return analysis.recommendations || []
}

export async function getDashboardData() {
  const response = await api.get("/visualize/")
  return response.data
}
