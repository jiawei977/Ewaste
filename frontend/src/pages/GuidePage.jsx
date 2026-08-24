import { useEffect, useMemo, useState } from 'react'
import { apiRequest } from '../api'
import { getCategoryVisual } from '../category-visuals'
import PageLoading from '../components/PageLoading'
import EmptyState from '../components/EmptyState'

export default function GuidePage() {
  const [guidelines, setGuidelines] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    apiRequest('/api/guidelines')
      .then((data) => setGuidelines(data.guidelines))
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false))
  }, [])

  const filteredGuidelines = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return guidelines
    return guidelines.filter((item) => `${item.category} ${item.instruction}`.toLowerCase().includes(normalizedQuery))
  }, [guidelines, query])

  if (loading) return <PageLoading message="Preparing the recycling guide…" />

  return (
    <>
      <header className="guide-header mb-4">
        <span className="page-kicker"><i className="bi bi-journal-check" /> Recycling knowledge</span>
        <h1 className="h2 fw-bold mb-1">Category Guide</h1>
        <p className="text-secondary">Know what to do before your device leaves your hands.</p>
      </header>

      {error && <div className="alert alert-danger" role="alert">{error}</div>}

      {!error && (
        <>
          <div className="guide-search mb-4">
            <i className="bi bi-search" aria-hidden="true" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} type="search" placeholder="Search battery, keyboard, television…" aria-label="Search recycling categories" />
          </div>
          {filteredGuidelines.length ? (
            <section className="guide-grid">
              {filteredGuidelines.map((item) => {
                const visual = getCategoryVisual(item.category)
                return (
                  <article className="guide-card" key={item.class_index}>
                    <div className="guide-card-top">
                      <span className="guide-icon" style={{ '--category-color': visual.color }}><i className={`bi ${visual.icon}`} /></span>
                      <span className="guide-points">+{item.points} pts</span>
                    </div>
                    <h2>{item.category.replaceAll('_', ' ')}</h2>
                    <p>{item.instruction}</p>
                    <div className="guide-tip"><i className="bi bi-shield-check" /> Keep it dry and erase personal data when applicable.</div>
                  </article>
                )
              })}
            </section>
          ) : <EmptyState icon="bi-search" title="No matching category" message="Try a shorter search term or browse all categories." />}
        </>
      )}
    </>
  )
}
