import { useEffect, useState } from 'react'
import { apiRequest } from '../api'
import PageLoading from '../components/PageLoading'

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    apiRequest('/api/leaderboard')
      .then((data) => setLeaders(data.leaders))
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <PageLoading message="Loading global rankings…" />

  return (
    <>
      <header className="text-center mb-5">
        <div className="display-4 mb-2"><i className="bi bi-trophy-fill text-warning" /></div>
        <h1 className="h2 fw-bold mb-1">Global Leaderboard</h1>
        <p className="text-secondary">Celebrating our top eco-conscious contributors</p>
      </header>

      {error && <div className="alert alert-danger" role="alert">{error}</div>}

      <section className="content-card card border-0 shadow-sm p-3 p-md-4 mx-auto">
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead><tr><th className="rank-column">Rank</th><th>Eco-Warrior</th><th className="text-end">Impact Score</th></tr></thead>
            <tbody>
              {leaders.map((leader) => (
                <tr key={`${leader.rank}-${leader.username}`}>
                  <td><span className={`rank-badge rank-${Math.min(leader.rank, 4)}`}>{leader.rank}</span></td>
                  <td className="fw-semibold">{leader.username}</td>
                  <td className="text-end"><span className="fw-bold text-success">{leader.total_score.toLocaleString()}</span><small className="text-secondary ms-1">pts</small></td>
                </tr>
              ))}
              {!leaders.length && !error && <tr><td className="text-center text-secondary py-5" colSpan="3">No recycling scores recorded yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}
