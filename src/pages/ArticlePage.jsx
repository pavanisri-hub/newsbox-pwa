import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { toggleBookmark } from '../lib/db.js'

export default function ArticlePage() {
  const location = useLocation()
  const navigate = useNavigate()
  const article = location.state?.article
  const [bookmarked, setBookmarked] = useState(false)
  const [syncStatus, setSyncStatus] = useState('') // '', 'pending', 'done'

  useEffect(() => {
    setBookmarked(false)
    setSyncStatus('')
  }, [article?.url])

  if (!article) {
    return (
      <div className="page page-article">
        <div className="page-header">
          <h2 className="page-title">Article not found</h2>
          <p className="page-subtitle">
            Go back to the headlines and open an article again.
          </p>
        </div>
        <button className="btn" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>
    )
  }

  async function handleBookmark() {
    setSyncStatus('pending')
    const isSaved = await toggleBookmark(article)
    setBookmarked(isSaved)
    setSyncStatus('done')
    setTimeout(() => setSyncStatus(''), 2000)
  }

  return (
    <div className="page page-article">
      {/* header + hero + meta + content same as now */}

      <div style={{ display: 'flex', gap: 12, marginTop: 12, alignItems: 'center' }}>
        <button className="btn" onClick={handleBookmark}>
          {bookmarked ? 'Bookmarked' : 'Add to bookmarks'}
        </button>

        {article.url && (
          <a
            href={article.url}
            target="_blank"
            rel="noreferrer"
            className="btn btn-ghost"
          >
            Open original article
          </a>
        )}

        {syncStatus === 'pending' && (
          <span style={{ fontSize: 12, opacity: 0.8 }}>Saving…</span>
        )}
        {syncStatus === 'done' && (
          <span style={{ fontSize: 12, opacity: 0.9 }}>Saved for offline</span>
        )}
      </div>
    </div>
  )
}
