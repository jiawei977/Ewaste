import { BrowserRouter, Link, Navigate, NavLink, Route, Routes } from 'react-router-dom'
import AuthProvider from './AuthProvider'
import { useAuth } from './auth-context'
import HomePage from './pages/HomePage'
import HistoryPage from './pages/HistoryPage'
import LeaderboardPage from './pages/LeaderboardPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import './App.css'

function LoadingPage() {
  return <div className="min-vh-100 d-flex align-items-center justify-content-center text-success">Loading…</div>
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <LoadingPage />
  return user ? children : <Navigate to="/login" replace />
}

function Layout({ children }) {
  const { user, logout } = useAuth()
  return (
    <div className="app-shell">
      <nav className="navbar navbar-dark bg-success shadow-sm">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/"><i className="bi bi-recycle me-2" />E-Waste Scanner</Link>
          {user && (
            <div className="d-flex align-items-center gap-2 gap-md-3">
              <div className="d-none d-md-flex gap-1">
                <NavItem to="/">Scanner</NavItem>
                <NavItem to="/history">My Impact</NavItem>
                <NavItem to="/leaderboard">Global Ranking</NavItem>
              </div>
              <button className="btn btn-sm btn-light fw-semibold" type="button" onClick={logout}>Logout</button>
            </div>
          )}
        </div>
      </nav>
      {user && (
        <nav className="mobile-nav d-flex d-md-none justify-content-center gap-1 p-2 shadow-sm">
          <NavItem to="/">Scanner</NavItem>
          <NavItem to="/history">My Impact</NavItem>
          <NavItem to="/leaderboard">Ranking</NavItem>
        </nav>
      )}
      <main className="container py-5">{children}</main>
    </div>
  )
}

function NavItem({ to, children }) {
  return <NavLink className={({ isActive }) => `nav-page-link ${isActive ? 'active' : ''}`} to={to} end={to === '/'}>{children}</NavLink>
}

function AppRoutes() {
  const { loading } = useAuth()
  if (loading) return <LoadingPage />
  return (
    <Layout>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}

export default function App() {
  return <BrowserRouter><AuthProvider><AppRoutes /></AuthProvider></BrowserRouter>
}
