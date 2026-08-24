import { useEffect, useState } from 'react'
import { apiRequest } from '../api'

export default function NewsSection() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    apiRequest('/api/news')
      .then((data) => setArticles(data.articles || []))
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="news-section mt-5 pt-4">
      <h2 className="h4 fw-bold mb-4"><i className="bi bi-newspaper me-2" />Sustainability News</h2>
      {loading && <div className="text-center text-success py-4"><span className="spinner-border spinner-border-sm me-2" />Loading news…</div>}
      {error && <div className="alert alert-warning">News is temporarily unavailable. The scanner is still ready to use.</div>}
      {!loading && !error && !articles.length && <p className="text-secondary">No sustainability articles are available right now.</p>}
      <div className="row g-4">
        {articles.map((article, index) => (
          <div className="col-md-6 col-lg-4" key={`${article.url || article.title}-${index}`}>
            <article className="news-card card h-100 border-0 shadow-sm overflow-hidden">
              {article.urlToImage && <img className="news-image" src={article.urlToImage} alt="" onError={(event) => { event.currentTarget.style.display = 'none' }} />}
              <div className="card-body d-flex flex-column">
                <span className="badge align-self-start bg-success-subtle text-success mb-2">{article.source?.name || 'Sustainability News'}</span>
                <h3 className="h6 fw-bold article-title">{article.title}</h3>
                <p className="small text-secondary article-description">{article.description || 'Read the latest update on e-waste management and recycling.'}</p>
                {article.url && <a className="text-success fw-semibold text-decoration-none mt-auto stretched-link" href={article.url} target="_blank" rel="noreferrer">Read More <i className="bi bi-arrow-right" /></a>}
              </div>
            </article>
          </div>
        ))}
      </div>
    </section>
  )
}
