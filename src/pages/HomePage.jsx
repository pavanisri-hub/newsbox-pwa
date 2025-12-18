import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchTopHeadlines } from '../lib/newsApi.js'
import { saveArticles, getAllArticles } from '../lib/db.js'

export default function HomePage() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        setLoading(true)
        setError('')
        const items = await fetchTopHeadlines()
        if (!cancelled) {
          setArticles(items)
          saveArticles(items)
        }
      } catch (err) {
        try {
          const cached = await getAllArticles()
          if (!cancelled && cached.length > 0) {
            setArticles(cached)
            setError('')
          } else if (!cancelled) {
            setError('Could not load news. Please try again.')
          }
        } catch {
          if (!cancelled) {
            setError('Could not load news. Please try again.')
          }
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="page page-home">
      <div className="page-header">
        <h2 className="page-title">Top headlines</h2>
        <p className="page-subtitle">
          Browse the latest news. Works offline after first load.
        </p>
      </div>

      {loading && <div className="page-empty">Loading headlines…</div>}

      {error && !loading && <div className="page-empty">{error}</div>}

      {!loading && !error && articles.length === 0 && (
        <div className="page-empty">No articles found.</div>
      )}

      {!loading && articles.length > 0 && (
        <ul className="news-list">
          {articles.map((article, index) => (
            <li key={article.url || index} className="news-item">
              <Link to={`/article/${index}`} state={{ article }}>
                {article.image && (
                  <div className="news-thumb">
                    <img src={article.image} alt={article.title} />
                  </div>
                )}
                <div className="news-body">
                  <h3 className="news-title">{article.title}</h3>
                  {article.description && (
                    <p className="news-desc">{article.description}</p>
                  )}
                  <span className="news-meta">
                    {new Date(article.publishedAt).toLocaleString()}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
