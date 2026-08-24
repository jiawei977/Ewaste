import { useEffect, useState } from 'react'
import { apiRequest } from '../api'
import PageLoading from '../components/PageLoading'
import ImpactDashboard from '../components/ImpactDashboard'
import EmptyState from '../components/EmptyState'

export default function HistoryPage() {
  const [data, setData] = useState({ history: [], total_points: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    apiRequest('/api/history')
      .then(setData)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <PageLoading message="Loading your recycling history…" />

  return (
    <>
      <header className="mb-4">
        <h1 className="h2 fw-bold mb-1">My Impact</h1>
        <p className="text-secondary mb-0">Every recycled device makes a difference.</p>
      </header>

      {error && <div className="alert alert-danger" role="alert">{error}</div>}

      <ImpactDashboard history={data.history} totalPoints={data.total_points} />

      <section className="content-card card border-0 shadow-sm p-3 p-md-4">
        <h2 className="h4 fw-bold mb-4">Recycling History</h2>
        <div className="table-responsive">
          <table className="table align-middle mb-0 responsive-data-table">
            <thead><tr><th>Item Type</th><th>Reward</th><th className="text-end">Date</th></tr></thead>
            <tbody>
              {data.history.map((record, index) => (
                <tr key={`${record.timestamp}-${index}`}>
                  <td className="fw-semibold text-success" data-label="Item"><span><i className="bi bi-cpu me-2" />{record.item_type}</span></td>
                  <td data-label="Reward"><span className="badge rounded-pill text-bg-success">+{record.points} pts</span></td>
                  <td className="text-end text-secondary small" data-label="Date">{formatDate(record.timestamp)}</td>
                </tr>
              ))}
              {!data.history.length && (
                <tr className="empty-row"><td colSpan="3"><EmptyState icon="bi-clock-history" title="Your impact journey starts here" message="Recycle your first electronic item to unlock charts and track your progress." actionLabel="Scan an item" actionTo="/" /></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}

function formatDate(timestamp) {
  return new Intl.DateTimeFormat('en-MY', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(timestamp))
}
