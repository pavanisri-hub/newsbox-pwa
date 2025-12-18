import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import './index.css'
import HomePage from './pages/HomePage.jsx'
import ArticlePage from './pages/ArticlePage.jsx'
import BookmarksPage from './pages/BookmarksPage.jsx'
import useOnlineStatus from './hooks/useOnlineStatus.js'

export default function App() {
  const online = useOnlineStatus()

  return (
    <BrowserRouter>
      <div className="app-root">
        <header className="app-header">
          <h1 className="app-title">Newsbox</h1>
          <span className="app-subtitle">Offline-friendly news reader</span>
        </header>

        <div className={`app-status ${online ? 'online' : 'offline'}`}>
          <span className="status-dot" />
          <span>{online ? 'Online' : 'Offline mode'}</span>
        </div>

        <nav className="app-nav">
          <NavLink to="/" end className="app-nav-link">
            Home
          </NavLink>
          <NavLink to="/bookmarks" className="app-nav-link">
            Bookmarks
          </NavLink>
        </nav>

        <main className="app-main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/article/:id" element={<ArticlePage />} />
            <Route path="/bookmarks" element={<BookmarksPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
