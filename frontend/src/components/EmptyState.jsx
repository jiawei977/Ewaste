import { Link } from 'react-router-dom'

export default function EmptyState({ icon = 'bi-inbox', title, message, actionLabel, actionTo }) {
  return (
    <div className="empty-state text-center">
      <span className="empty-state-icon"><i className={`bi ${icon}`} aria-hidden="true" /></span>
      <h3>{title}</h3>
      <p>{message}</p>
      {actionLabel && actionTo && <Link className="btn btn-success" to={actionTo}>{actionLabel}</Link>}
    </div>
  )
}
