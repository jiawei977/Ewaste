import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth-context'
import { apiRequest } from '../api'
import { AuthCard } from './LoginPage'

const initialForm = { username: '', email: '', password: '', confirm_password: '' }

export default function RegisterPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (user) return <Navigate to="/" replace />

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    if (form.password !== form.confirm_password) {
      setError('Passwords do not match.')
      return
    }

    setSubmitting(true)
    try {
      const data = await apiRequest('/api/auth/register', { method: 'POST', body: JSON.stringify(form) })
      navigate('/login', { replace: true, state: { message: data.message } })
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthCard icon="bi-person-plus" title="Create Account" subtitle="Start your sustainability journey today">
      {error && <div className="alert alert-danger py-2" role="alert">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input className="form-control mb-3" name="username" value={form.username} onChange={updateField} placeholder="Username" autoComplete="username" required />
        <input className="form-control mb-3" type="email" name="email" value={form.email} onChange={updateField} placeholder="Email Address" autoComplete="email" required />
        <input className="form-control mb-3" type="password" name="password" value={form.password} onChange={updateField} placeholder="Password" autoComplete="new-password" required />
        <input className="form-control mb-4" type="password" name="confirm_password" value={form.confirm_password} onChange={updateField} placeholder="Confirm Password" autoComplete="new-password" required />
        <button className="btn btn-success w-100 mb-3" type="submit" disabled={submitting}>{submitting ? 'Creating account…' : 'Register'}</button>
      </form>
      <p className="text-center small text-secondary mb-0">
        Already have an account? <Link className="text-success fw-bold text-decoration-none" to="/login">Login</Link>
      </p>
    </AuthCard>
  )
}
