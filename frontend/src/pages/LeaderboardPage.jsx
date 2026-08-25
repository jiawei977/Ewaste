import { useEffect, useState } from 'react'
import { apiRequest } from '../api'
import PageLoading from '../components/PageLoading'
import UserAvatar from '../components/UserAvatar'
import EmptyState from '../components/EmptyState'
import { Link } from 'react-router-dom'

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
      <header className="leaderboard-header text-center mb-5">
        <div className="leaderboard-trophy mb-2"><i className="bi bi-trophy-fill" /></div>
        <h1 className="h2 fw-bold mb-1">Global Leaderboard</h1>
        <p className="text-secondary">Celebrating our top eco-conscious contributors</p>
      </header>

      {error && <div className="alert alert-danger" role="alert">{error}</div>}

      {!!leaders.length && <Podium leaders={leaders.slice(0, 3)} />}

      {(leaders.length > 3 || (!leaders.length && !error)) && <section className="content-card leaderboard-card card border-0 shadow-sm p-3 p-md-4 mx-auto">
        {leaders.length > 3 && <h2 className="h5 fw-bold leaderboard-list-title">More top recyclers</h2>}
        <div className="table-responsive">
          <table className="table align-middle mb-0 responsive-data-table leaderboard-table">
            <thead><tr><th className="rank-column">Rank</th><th>Eco-Warrior</th><th className="text-end">Impact Score</th></tr></thead>
            <tbody>
              {leaders.slice(3).map((leader) => (
                <tr key={`${leader.rank}-${leader.username}`}>
                  <td className="leaderboard-rank-cell" data-label="Rank"><span className={`rank-badge rank-${Math.min(leader.rank, 4)}`}>{leader.rank}</span></td>
                  <td className="leaderboard-user-cell fw-semibold" data-label="Eco-Warrior">
                    <Link className="leaderboard-user leaderboard-profile-link" to={`/users/${leader.user_id}`} aria-label={`View ${leader.username}'s profile`}>
                      <div className={`leaderboard-avatar-frame frame-rank-${Math.min(leader.rank, 4)}`}>
                        {leader.rank <= 3 && <i className="bi bi-crown-fill medal-crown" aria-hidden="true" />}
                        <UserAvatar user={leader} className="leaderboard-avatar" />
                      </div>
                      <span>{leader.username}</span>
                    </Link>
                  </td>
                  <td className="leaderboard-score-cell text-end" data-label="Impact Score"><span className="leaderboard-score fw-bold text-success">{leader.total_score.toLocaleString()}</span><small className="text-secondary ms-1">pts</small></td>
                </tr>
              ))}
              {!leaders.length && !error && <tr className="empty-row"><td colSpan="3"><EmptyState icon="bi-trophy" title="The podium is waiting" message="Complete a recycling scan to become the first ranked eco-warrior." actionLabel="Start scanning" actionTo="/" /></td></tr>}
            </tbody>
          </table>
        </div>
      </section>}
    </>
  )
}

function Podium({ leaders }) {
  const orderedLeaders = [leaders[1], leaders[0], leaders[2]].filter(Boolean)
  return (
    <section className="podium" aria-label="Top three eco-warriors">
      {orderedLeaders.map((leader) => (
        <Link className={`podium-place podium-place-${leader.rank} podium-profile-link`} to={`/users/${leader.user_id}`} aria-label={`View ${leader.username}'s profile`} key={leader.rank}>
          <span className="podium-crown"><i className="bi bi-crown-fill" /></span>
          <div className={`podium-avatar-frame frame-rank-${leader.rank}`}>
            <UserAvatar user={leader} className="podium-avatar" />
          </div>
          <strong className="podium-name">{leader.username}</strong>
          <span className="podium-score">{leader.total_score.toLocaleString()} pts</span>
          <div className="podium-step"><span>{leader.rank}</span></div>
        </Link>
      ))}
    </section>
  )
}
