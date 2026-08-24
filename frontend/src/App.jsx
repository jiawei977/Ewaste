import { useEffect, useState } from 'react'
import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'

const futurePages = {
  '/login': 'Login',
  '/register': 'Register',
  '/history': 'Recycling History',
  '/leaderboard': 'Leaderboard',
}

function Layout({ children }) {
  return (
    <div className="app-shell">
      <nav className="navbar navbar-expand navbar-dark bg-success shadow-sm">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/">
            <i className="bi bi-recycle me-2" />
            E-Waste Scanner
          </Link>
        </div>
      </nav>
      <main className="container py-5">{children}</main>
    </div>
  )
}

function HomePage() {
  const [apiState, setApiState] = useState({ status: 'checking', message: 'Checking Flask API…' })

  useEffect(() => {
    const controller = new AbortController()

    fetch('/api/health', { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        return response.json()
      })
      .then((data) => {
        setApiState({
          status: data.status === 'ok' ? 'connected' : 'error',
          message: data.status === 'ok' ? 'React is connected to Flask.' : 'Flask returned an unexpected response.',
        })
      })
      .catch((error) => {
        if (error.name !== 'AbortError') {
          setApiState({ status: 'error', message: 'Cannot reach Flask. Start app.py on port 5000.' })
        }
      })

    return () => controller.abort()
  }, [])

  const alertClass = apiState.status === 'connected'
    ? 'alert-success'
    : apiState.status === 'error'
      ? 'alert-danger'
      : 'alert-secondary'

  return (
    <section className="mx-auto migration-card card border-0 shadow-sm p-4 p-md-5">
      <div className="display-5 text-success mb-3">
        <i className="bi bi-recycle" />
      </div>
      <h1 className="h2 fw-bold">React migration is ready</h1>
      <p className="text-secondary mb-4">
        The new frontend is running while the existing Flask and Jinja application remains available.
      </p>
      <div className={`alert ${alertClass} mb-0`} role="status">
        {apiState.message}
      </div>
    </section>
  )
}

function PlaceholderPage({ title }) {
  return (
    <section className="mx-auto migration-card card border-0 shadow-sm p-5">
      <h1 className="h3 fw-bold">{title}</h1>
      <p className="text-secondary mb-4">This page will be migrated in a later step.</p>
      <Link className="btn btn-success" to="/">Back to migration status</Link>
    </section>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          {Object.entries(futurePages).map(([path, title]) => (
            <Route key={path} path={path} element={<PlaceholderPage title={title} />} />
          ))}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
