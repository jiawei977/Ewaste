import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth-context'

export function AuthCard({ icon, title, subtitle, children }) {
  return (
    <section className="auth-panel mx-auto">
      <div className="text-center mb-4">
        <i className={`bi ${icon} brand-icon`} />
        <h1 className="h2 fw-bold mt-2">{title}</h1>
        <p className="text-secondary">{subtitle}</p>
      </div>
      <div className="card border-0 shadow-sm p-4 p-md-5">{children}</div>
    </section>
  )
}

export default function LoginPage() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ identifier: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (user) return <Navigate to="/" replace />

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(form)
      navigate('/', { replace: true })
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthCard icon="bi-box-arrow-in-right" title="Welcome Back" subtitle="Log in to track your recycling impact">
      {location.state?.message && <div className="alert alert-success py-2">{location.state.message}</div>}
      {error && <div className="alert alert-danger py-2" role="alert">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input className="form-control mb-3" type="text" name="identifier" value={form.identifier} onChange={updateField} placeholder="Username or email" autoComplete="username" aria-label="Username or email" required />
        <input className="form-control mb-4" type="password" name="password" value={form.password} onChange={updateField} placeholder="Password" autoComplete="current-password" required />
        <button className="btn btn-success w-100 mb-3" type="submit" disabled={submitting}>{submitting ? 'Signing in…' : 'Sign In'}</button>
      </form>
      <p className="text-center small text-secondary mb-0">
        New here? <Link className="text-success fw-bold text-decoration-none" to="/register">Create Account</Link>
      </p>
    </AuthCard>
  )
}
