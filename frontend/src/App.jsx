import { BrowserRouter, Link, Navigate, NavLink, Route, Routes } from 'react-router-dom'
import AuthProvider from './AuthProvider'
import { useAuth } from './auth-context'
import HomePage from './pages/HomePage'
import HistoryPage from './pages/HistoryPage'
import LeaderboardPage from './pages/LeaderboardPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import GuidePage from './pages/GuidePage'
import ProfilePage from './pages/ProfilePage'
import SettingsPage from './pages/SettingsPage'
import UserProfilePage from './pages/UserProfilePage'
import ProfileMenu from './components/ProfileMenu'
import ChatAssistant from './components/ChatAssistant'
import './App.css'

function LoadingPage() {
  return <div className="min-vh-100 d-flex align-items-center justify-content-center text-success">Loading…</div>
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <LoadingPage />
  return user ? children : <Navigate to="/login" replace />
}

function GuestAccessibleRoute({ children }) {
  const { user, isGuest, loading } = useAuth()
  if (loading) return <LoadingPage />
  return user || isGuest ? children : <Navigate to="/login" replace />
}

function Layout({ children }) {
  const { user, isGuest } = useAuth()
  const hasAccess = user || isGuest
  return (
    <div className="app-shell">
      <nav className="navbar navbar-dark bg-success shadow-sm top-nav">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/"><i className="bi bi-recycle me-2" />E-Waste Scanner</Link>
          {hasAccess && (
            <div className="d-flex align-items-center gap-2 gap-md-3">
              <div className="d-none d-md-flex gap-1">
                <NavItem to="/" icon="bi-camera">Scanner</NavItem>
                {user && <NavItem to="/history" icon="bi-graph-up-arrow">My Impact</NavItem>}
                <NavItem to="/leaderboard" icon="bi-trophy">Global Ranking</NavItem>
                <NavItem to="/guide" icon="bi-journal-check">Guide</NavItem>
              </div>
              {user ? <ProfileMenu /> : <Link className="btn btn-light btn-sm fw-bold px-3" to="/login">Sign In</Link>}
            </div>
          )}
        </div>
      </nav>
      {hasAccess && (
        <nav className="mobile-nav d-flex d-md-none justify-content-around shadow-lg" aria-label="Primary navigation">
          <NavItem to="/" icon="bi-camera">Scanner</NavItem>
          {user && <NavItem to="/history" icon="bi-graph-up-arrow">My Impact</NavItem>}
          <NavItem to="/leaderboard" icon="bi-trophy">Ranking</NavItem>
          <NavItem to="/guide" icon="bi-journal-check">Guide</NavItem>
        </nav>
      )}
      <main className="container app-main py-3 py-md-5">{children}</main>
      {hasAccess && <ChatAssistant key={user ? `user-${user.user_id}` : 'guest'} />}
    </div>
  )
}

function NavItem({ to, icon, children }) {
  return (
    <NavLink className={({ isActive }) => `nav-page-link ${isActive ? 'active' : ''}`} to={to} end={to === '/'}>
      <i className={`bi ${icon}`} aria-hidden="true" />
      <span>{children}</span>
    </NavLink>
  )
}

function AppRoutes() {
  const { loading } = useAuth()
  if (loading) return <LoadingPage />
  return (
    <Layout>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<GuestAccessibleRoute><HomePage /></GuestAccessibleRoute>} />
        <Route path="/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
        <Route path="/leaderboard" element={<GuestAccessibleRoute><LeaderboardPage /></GuestAccessibleRoute>} />
        <Route path="/guide" element={<GuestAccessibleRoute><GuidePage /></GuestAccessibleRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/users/:userId" element={<GuestAccessibleRoute><UserProfilePage /></GuestAccessibleRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}

export default function App() {
  return <BrowserRouter><AuthProvider><AppRoutes /></AuthProvider></BrowserRouter>
}
