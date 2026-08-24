import { useEffect, useState } from 'react'
import { useAuth } from '../auth-context'
import { apiRequest } from '../api'

export default function HomePage() {
  const { user } = useAuth()
  const [apiStatus, setApiStatus] = useState('Checking Flask API…')

  useEffect(() => {
    apiRequest('/api/health')
      .then(() => setApiStatus('React is connected to Flask.'))
      .catch(() => setApiStatus('Cannot reach Flask. Start app.py on port 5000.'))
  }, [])

  return (
    <section className="mx-auto migration-card card border-0 shadow-sm p-4 p-md-5">
      <div className="display-5 text-success mb-3"><i className="bi bi-recycle" /></div>
      <h1 className="h2 fw-bold">Welcome, {user.username}</h1>
      <p className="text-secondary mb-4">Authentication is now running through the React frontend.</p>
      <div className="alert alert-success mb-0" role="status">{apiStatus}</div>
    </section>
  )
}
