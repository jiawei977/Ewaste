import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { apiRequest } from '../api'
import BadgeCollection from '../components/BadgeCollection'
import PageLoading from '../components/PageLoading'
import UserAvatar from '../components/UserAvatar'
import { useAuth } from '../auth-context'

export default function UserProfilePage() {
  const { userId } = useParams()
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    apiRequest(`/api/users/${userId}/profile`)
      .then(setData)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false))
  }, [userId])

  if (loading) return <PageLoading message="Loading eco-warrior profile…" />
  if (error) return <div className="alert alert-danger" role="alert">{error}</div>

  const isOwnProfile = Boolean(user && Number(userId) === user.user_id)
  return (
    <div className="public-profile-layout">
      <section className="public-profile-hero">
        <UserAvatar user={data.profile} className="public-profile-avatar" />
        <div className="public-profile-identity">
          <span className="page-kicker"><i className="bi bi-leaf-fill" /> Eco-warrior profile</span>
          <h1>{data.profile.username}</h1>
          <p>{data.profile.bio || 'Building a greener future, one recycled item at a time.'}</p>
        </div>
        {isOwnProfile && <Link className="btn btn-outline-success" to="/profile"><i className="bi bi-pencil-square me-2" />Edit profile</Link>}
      </section>

      <section className="public-profile-stats" aria-label="Recycling statistics">
        <div><i className="bi bi-recycle" /><strong>{data.stats.items}</strong><span>Items recycled</span></div>
        <div><i className="bi bi-lightning-charge-fill" /><strong>{data.stats.points}</strong><span>Impact points</span></div>
        <div><i className="bi bi-grid-fill" /><strong>{data.stats.categories}</strong><span>Categories</span></div>
      </section>

      <BadgeCollection badges={data.badges} earnedCount={data.earned_count} />
    </div>
  )
}
