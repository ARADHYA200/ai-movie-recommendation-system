const STORAGE_KEYS = {
  favorites: "movieDNA_favorites",
  watchlist: "movieDNA_watchlist",
  recentlyViewed: "movieDNA_recentlyViewed",
  recommendationHistory: "movieDNA_recommendationHistory",
}

function read(key) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function write(key, data) {
  localStorage.setItem(key, JSON.stringify(data))
}

export function getFavorites() {
  return read(STORAGE_KEYS.favorites)
}

export function toggleFavorite(movie) {
  const list = getFavorites()
  const idx = list.findIndex((m) => m.id === movie.id)
  if (idx >= 0) {
    list.splice(idx, 1)
  } else {
    list.unshift({ id: movie.id, title: movie.title, vote_average: movie.vote_average, genres: movie.genres })
  }
  write(STORAGE_KEYS.favorites, list)
  return list
}

export function isFavorite(id) {
  return getFavorites().some((m) => m.id === id)
}

export function getWatchlist() {
  return read(STORAGE_KEYS.watchlist)
}

export function toggleWatchlist(movie) {
  const list = getWatchlist()
  const idx = list.findIndex((m) => m.id === movie.id)
  if (idx >= 0) {
    list.splice(idx, 1)
  } else {
    list.unshift({ id: movie.id, title: movie.title, vote_average: movie.vote_average, genres: movie.genres })
  }
  write(STORAGE_KEYS.watchlist, list)
  return list
}

export function isInWatchlist(id) {
  return getWatchlist().some((m) => m.id === id)
}

export function getRecentlyViewed() {
  return read(STORAGE_KEYS.recentlyViewed)
}

export function addRecentlyViewed(movie) {
  let list = getRecentlyViewed().filter((m) => m.id !== movie.id)
  list.unshift({
    id: movie.id,
    title: movie.title,
    vote_average: movie.vote_average,
    genres: movie.genres,
    viewedAt: new Date().toISOString(),
  })
  list = list.slice(0, 20)
  write(STORAGE_KEYS.recentlyViewed, list)
  return list
}

export function getRecommendationHistory() {
  return read(STORAGE_KEYS.recommendationHistory)
}

export function addRecommendationHistory(entry) {
  const list = getRecommendationHistory()
  list.unshift({
    ...entry,
    timestamp: new Date().toISOString(),
  })
  write(STORAGE_KEYS.recommendationHistory, list.slice(0, 10))
  return list
}

export function useUserStorage() {
  return {
    getFavorites,
    toggleFavorite,
    isFavorite,
    getWatchlist,
    toggleWatchlist,
    isInWatchlist,
    getRecentlyViewed,
    addRecentlyViewed,
    getRecommendationHistory,
    addRecommendationHistory,
  }
}
