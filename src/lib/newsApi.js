const API_KEY = import.meta.env.VITE_GNEWS_API_KEY
const BASE_URL = 'https://gnews.io/api/v4'

export async function fetchTopHeadlines() {
  const url = `${BASE_URL}/top-headlines?country=in&category=general&lang=en&max=20&apikey=${API_KEY}`

  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to load news')

  const data = await res.json()
  return data.articles || []
}
