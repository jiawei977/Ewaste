export default function UserAvatar({ user, className = '', decorative = false }) {
  const initials = user?.username?.trim()?.charAt(0)?.toUpperCase() || '?'

  if (user?.avatar_url) {
    return (
      <img
        className={`user-avatar ${className}`}
        src={user.avatar_url}
        alt={decorative ? '' : `${user.username}'s profile`}
      />
    )
  }

  return (
    <span className={`user-avatar avatar-fallback ${className}`} aria-label={decorative ? undefined : `${user?.username || 'User'} profile`} aria-hidden={decorative || undefined}>
      {initials}
    </span>
  )
}
