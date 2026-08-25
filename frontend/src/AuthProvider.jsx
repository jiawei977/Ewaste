import { useEffect, useState } from 'react'
import { apiRequest } from './api'
import { AuthContext } from './auth-context'

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiRequest('/api/auth/session')
      .then((data) => setUser(data.authenticated ? data.user : null))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  async function login(credentials) {
    const data = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
    setUser(data.user)
  }

  async function logout() {
    await apiRequest('/api/auth/logout', { method: 'POST' })
    setUser(null)
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

  return <AuthContext.Provider value={{ user, loading, login, logout, uploadAvatar, updateProfile }}>{children}</AuthContext.Provider>
}
