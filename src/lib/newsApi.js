// src/lib/newsApi.js

const API_BASE =
  import.meta.env.VITE_API_BASE || 'http://localhost:4173';

export async function fetchTopHeadlines(params) {
  const query = params?.toString?.() ?? '';
  const url = `${API_BASE}/api/news${query ? `?${query}` : ''}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to load news');

  const data = await res.json();
  return data.articles || [];
}
