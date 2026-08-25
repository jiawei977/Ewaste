import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth-context'
import UserAvatar from './UserAvatar'

export default function ProfileMenu() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    function closeMenu(event) {
      if (event.key === 'Escape' || (event.type === 'pointerdown' && !menuRef.current?.contains(event.target))) setOpen(false)
    }
    document.addEventListener('pointerdown', closeMenu)
    document.addEventListener('keydown', closeMenu)
    return () => {
      document.removeEventListener('pointerdown', closeMenu)
      document.removeEventListener('keydown', closeMenu)
    }
  }, [open])

  async function handleLogout() {
    setOpen(false)
    await logout()
  }

  return (
    <div className="profile-menu" ref={menuRef}>
      <button className="profile-menu-trigger" type="button" aria-label="Open profile menu" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((current) => !current)}>
        <UserAvatar user={user} className="navbar-avatar" />
        <i className={`bi bi-chevron-${open ? 'up' : 'down'} profile-menu-chevron`} aria-hidden="true" />
      </button>
      {open && (
        <div className="profile-dropdown" role="menu">
          <div className="profile-dropdown-user">
            <UserAvatar user={user} className="profile-dropdown-avatar" />
            <div><strong>{user.username}</strong><span>Eco-warrior account</span></div>
          </div>
          <div className="profile-dropdown-divider" />
          <Link to={`/users/${user.user_id}`} role="menuitem" onClick={() => setOpen(false)}><i className="bi bi-person-circle" /><span><strong>My Profile</strong><small>Profile, stats and achievements</small></span></Link>
          <Link to="/settings" role="menuitem" onClick={() => setOpen(false)}><i className="bi bi-gear" /><span><strong>Settings</strong><small>Location and preferences</small></span></Link>
          <div className="profile-dropdown-divider" />
          <button className="profile-dropdown-logout" type="button" role="menuitem" onClick={handleLogout}><i className="bi bi-box-arrow-right" /><span><strong>Logout</strong><small>Sign out of this account</small></span></button>
        </div>
      )}
    </div>
  )
}
