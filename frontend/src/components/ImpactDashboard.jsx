import { getCategoryVisual } from '../category-visuals'

export default function ImpactDashboard({ history, totalPoints }) {
  const categoryTotals = history.reduce((totals, record) => {
    const key = record.item_type || 'Other'
    totals[key] = (totals[key] || 0) + 1
    return totals
  }, {})
  const categories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])
  const maxCategory = Math.max(...categories.map(([, count]) => count), 1)
  const activity = makeRecentActivity(history)
  const maxActivity = Math.max(...activity.map((day) => day.points), 1)
  const thisMonth = history.filter((record) => isCurrentMonth(record.timestamp)).length

  return (
    <section className="impact-dashboard mb-4" aria-label="Impact overview">
      <div className="impact-stats-grid">
        <article className="impact-stat impact-stat-primary">
          <span className="impact-stat-icon"><i className="bi bi-stars" /></span>
          <div><span>Total points</span><strong>{totalPoints.toLocaleString()}</strong></div>
        </article>
        <article className="impact-stat">
          <span className="impact-stat-icon"><i className="bi bi-recycle" /></span>
          <div><span>Items recycled</span><strong>{history.length}</strong></div>
        </article>
        <article className="impact-stat">
          <span className="impact-stat-icon"><i className="bi bi-calendar2-check" /></span>
          <div><span>This month</span><strong>{thisMonth}</strong></div>
        </article>
      </div>

      <div className="impact-charts-grid">
        <article className="dashboard-panel">
          <div className="dashboard-panel-heading">
            <div><span className="eyebrow">Last 7 days</span><h2>Point activity</h2></div>
            <i className="bi bi-bar-chart-fill" aria-hidden="true" />
          </div>
          <div className="activity-chart" role="img" aria-label="Points earned over the last seven days">
            {activity.map((day) => (
              <div className="activity-column" key={day.key} title={`${day.label}: ${day.points} points`}>
                <span className="activity-value">{day.points || ''}</span>
                <div className="activity-track"><span style={{ height: `${Math.max((day.points / maxActivity) * 100, day.points ? 12 : 3)}%` }} /></div>
                <small>{day.shortLabel}</small>
              </div>
            ))}
          </div>
        </article>

        <article className="dashboard-panel">
          <div className="dashboard-panel-heading">
            <div><span className="eyebrow">Your mix</span><h2>Top categories</h2></div>
            <i className="bi bi-pie-chart-fill" aria-hidden="true" />
          </div>
          {categories.length ? (
            <div className="category-bars">
              {categories.slice(0, 5).map(([category, count]) => {
                const visual = getCategoryVisual(category)
                return (
                  <div className="category-bar-row" key={category}>
                    <span className="category-bar-label"><i className={`bi ${visual.icon}`} style={{ color: visual.color }} />{category.replaceAll('_', ' ')}</span>
                    <div className="category-bar-track"><span style={{ width: `${(count / maxCategory) * 100}%`, background: visual.color }} /></div>
                    <strong>{count}</strong>
                  </div>
                )
              })}
            </div>
          ) : <p className="text-secondary small mb-0">Your category breakdown will appear after your first recycled item.</p>}
        </article>
      </div>
    </section>
  )
}

function isCurrentMonth(timestamp) {
  const date = new Date(timestamp)
  const now = new Date()
  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
}

function makeRecentActivity(history) {
  const pointsByDay = history.reduce((totals, record) => {
    const key = localDateKey(new Date(record.timestamp))
    totals[key] = (totals[key] || 0) + record.points
    return totals
  }, {})

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date()
    date.setHours(12, 0, 0, 0)
    date.setDate(date.getDate() - (6 - index))
    const key = localDateKey(date)
    return {
      key,
      label: date.toLocaleDateString('en-MY', { weekday: 'long' }),
      shortLabel: date.toLocaleDateString('en-MY', { weekday: 'short' }).slice(0, 2),
      points: pointsByDay[key] || 0,
    }
  })
}

function localDateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
