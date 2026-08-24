export default function PageLoading({ message }) {
  return (
    <div className="page-loading" role="status" aria-live="polite">
      <div className="loading-orbit" aria-hidden="true"><i className="bi bi-recycle" /></div>
      <strong>{message}</strong>
      <span>Building a cleaner view for you</span>
      <div className="loading-skeleton" aria-hidden="true"><i /><i /><i /></div>
    </div>
  )
}
