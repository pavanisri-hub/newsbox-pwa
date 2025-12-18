// src/lib/newsApi.js

const API_BASE = 'https://gnews.io/api/v4';

export async function fetchTopHeadlines(params) {
  const query = params?.toString?.() ?? '';
  const url = `${API_BASE}/top-headlines?${query}&apikey=YOUR_KEY_HERE`;

  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to load news');

  const data = await res.json();
  return data.articles || [];
}
