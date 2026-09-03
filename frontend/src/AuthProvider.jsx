import { useEffect, useState } from 'react'
import { apiRequest } from './api'
import { AuthContext } from './auth-context'

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isGuest, setIsGuest] = useState(() => sessionStorage.getItem('ewaste-guest') === '1')
  const [loading, setLoading] = useState(true)
  const [theme, setTheme] = useState(() => localStorage.getItem('ewaste-theme') === 'dark' ? 'dark' : 'light')

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.setAttribute('data-bs-theme', theme)
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#174f38' : '#198754')
    localStorage.setItem('ewaste-theme', theme)
  }, [theme])

  useEffect(() => {
    apiRequest('/api/auth/session')
      .then((data) => {
        const sessionUser = data.authenticated ? data.user : null
        setUser(sessionUser)
        if (sessionUser) {
          setIsGuest(false)
          sessionStorage.removeItem('ewaste-guest')
        }
        if (sessionUser?.theme) setTheme(sessionUser.theme)
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  async function login(credentials) {
    const data = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
    setUser(data.user)
    setIsGuest(false)
    sessionStorage.removeItem('ewaste-guest')
    if (data.user?.theme) setTheme(data.user.theme)
  }

  async function logout() {
    await apiRequest('/api/auth/logout', { method: 'POST' })
    setUser(null)
    setIsGuest(false)
    sessionStorage.removeItem('ewaste-guest')
  }

  function continueAsGuest() {
    setUser(null)
    setIsGuest(true)
    sessionStorage.setItem('ewaste-guest', '1')
  }

  async function uploadAvatar(file) {
    const formData = new FormData()
    formData.append('avatar', file)
    const data = await apiRequest('/api/profile/avatar', {
      method: 'POST',
      body: formData,
    })
    setUser(data.user)
    return data.message
  }

  async function updateProfile(profile) {
    const data = await apiRequest('/api/profile', {
      method: 'PATCH',
      body: JSON.stringify(profile),
    })
    setUser(data.user)
    return data
  }

  async function updateTheme(nextTheme) {
    if (!['light', 'dark'].includes(nextTheme)) return
    const previousTheme = theme
    setTheme(nextTheme)
    try {
      const data = await apiRequest('/api/settings', {
        method: 'PATCH',
        body: JSON.stringify({ theme: nextTheme }),
      })
      setUser((current) => current ? { ...current, theme: data.settings.theme } : current)
      return data.message
    } catch (requestError) {
      setTheme(previousTheme)
      throw requestError
    }
  }

  return <AuthContext.Provider value={{ user, isGuest, loading, theme, login, logout, continueAsGuest, uploadAvatar, updateProfile, updateTheme }}>{children}</AuthContext.Provider>
}
