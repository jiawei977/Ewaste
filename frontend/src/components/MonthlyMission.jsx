import { useEffect, useState } from 'react'
import { apiRequest } from '../api'

const initialMission = { total: 0, target: 100, percentage: 0, completed: false }

export default function MonthlyMission({ refreshToken }) {
  const [mission, setMission] = useState(initialMission)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    apiRequest('/api/mission')
      .then((data) => {
        setMission(data)
        setError('')
      })
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false))
  }, [refreshToken])

  return (
    <section className="mission-card card border-0 shadow-sm p-4 mx-auto mb-4" aria-busy={loading}>
      <div className="d-flex justify-content-between align-items-center gap-3 mb-2">
        <h2 className="h6 fw-bold mb-0"><i className="bi bi-globe-americas me-2 text-success" />Global Monthly Mission</h2>
        <span className={`small text-nowrap ${mission.completed ? 'text-success fw-bold' : 'text-secondary'}`}>
          {loading ? 'Loading…' : `${mission.total} / ${mission.target} items`}
        </span>
      </div>
      <div className="progress rounded-pill" role="progressbar" aria-valuenow={mission.percentage} aria-valuemin="0" aria-valuemax="100">
        <div className={`progress-bar progress-bar-striped progress-bar-animated ${mission.completed ? 'bg-warning' : 'bg-success'}`} style={{ width: `${mission.percentage}%` }} />
      </div>
      {error ? (
        <p className="small text-danger text-center mt-2 mb-0">Unable to load the monthly mission.</p>
      ) : (
        <p className="small text-secondary text-center mt-2 mb-0">
          {mission.completed ? <span className="text-success fw-bold"><i className="bi bi-trophy-fill text-warning me-1" />Mission accomplished!</span> : "Join the global movement! Let's reach 100 recycled items this month."}
        </p>
      )}
    </section>
  )
}
