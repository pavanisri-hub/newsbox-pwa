import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getBookmarks } from '../lib/db.js'

export default function BookmarksPage() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      const items = await getBookmarks()
      if (!cancelled) {
        setArticles(items)
        setLoading(false)
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="page page-bookmarks">
      <div className="page-header">
        <h2 className="page-title">Bookmarks</h2>
        <p className="page-subtitle">Saved articles available offline.</p>
      </div>

      {loading && <div className="page-empty">Loading bookmarks…</div>}

      {!loading && articles.length === 0 && (
        <div className="page-empty">No bookmarks yet.</div>
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
