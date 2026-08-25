import { useEffect, useState } from 'react'
import { apiRequest } from '../api'
import { useAuth } from '../auth-context'
import PageLoading from '../components/PageLoading'

export default function SettingsPage() {
  const { theme, updateTheme } = useAuth()
  const [settings, setSettings] = useState({ location_enabled: false, preferred_language: 'en', theme })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    apiRequest('/api/settings')
      .then((data) => setSettings((current) => ({ ...current, ...data.settings })))
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <PageLoading message="Loading your settings…" />

  async function changeLocation(event) {
    const enabled = event.target.checked
    setMessage('')
    setError('')

    if (enabled) {
      if (!navigator.geolocation) {
        setError('Location is not supported by this browser.')
        return
      }
      try {
        await requestLocationPermission()
      } catch (permissionError) {
        setError(permissionError.message)
        return
      }
    }

    setSaving(true)
    try {
      const data = await apiRequest('/api/settings', { method: 'PATCH', body: JSON.stringify({ location_enabled: enabled }) })
      setSettings((current) => ({ ...current, location_enabled: data.settings.location_enabled }))
      setMessage(enabled ? 'Location access is enabled for future nearby-center features.' : 'Location use is disabled in the app.')
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSaving(false)
    }
  }

  async function changeTheme(nextTheme) {
    if (nextTheme === theme || saving) return
    setSaving(true)
    setMessage('')
    setError('')
    try {
      await updateTheme(nextTheme)
      setSettings((current) => ({ ...current, theme: nextTheme }))
      setMessage(`${nextTheme === 'dark' ? 'Dark' : 'Light'} theme applied.`)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="settings-layout">
      <header className="settings-header">
        <span className="page-kicker"><i className="bi bi-sliders" /> Preferences</span>
        <h1>Settings</h1>
        <p>Control device permissions and prepare your preferred app experience.</p>
      </header>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      {message && <div className="alert alert-success" role="status">{message}</div>}

      <section className="settings-card">
        <div className="setting-row">
          <span className="setting-icon setting-icon-location"><i className="bi bi-geo-alt-fill" /></span>
          <div className="setting-copy"><h2>Location permission</h2><p>Allow the app to use your current position for nearby recycling centres. Coordinates are not stored in your profile.</p></div>
          <label className="setting-switch"><input type="checkbox" checked={settings.location_enabled} disabled={saving} onChange={changeLocation} /><span /><em>{settings.location_enabled ? 'On' : 'Off'}</em></label>
        </div>
        <div className="settings-note"><i className="bi bi-info-circle" /> To fully revoke browser permission, use the site controls in your browser’s address bar.</div>
      </section>

      <section className="settings-card">
        <div className="settings-section-heading"><div><h2>Appearance</h2><p>Choose how E-Waste Scanner looks on this account.</p></div></div>
        <div className="theme-options" role="radiogroup" aria-label="Color theme">
          <button className={`theme-option ${theme === 'light' ? 'active' : ''}`} type="button" role="radio" aria-checked={theme === 'light'} disabled={saving} onClick={() => changeTheme('light')}>
            <span className="theme-preview theme-preview-light"><i className="bi bi-sun-fill" /></span>
            <span><strong>Light</strong><small>Bright and clean</small></span>
            <i className={`bi ${theme === 'light' ? 'bi-check-circle-fill' : 'bi-circle'} theme-check`} />
          </button>
          <button className={`theme-option ${theme === 'dark' ? 'active' : ''}`} type="button" role="radio" aria-checked={theme === 'dark'} disabled={saving} onClick={() => changeTheme('dark')}>
            <span className="theme-preview theme-preview-dark"><i className="bi bi-moon-stars-fill" /></span>
            <span><strong>Dark</strong><small>Comfortable in low light</small></span>
            <i className={`bi ${theme === 'dark' ? 'bi-check-circle-fill' : 'bi-circle'} theme-check`} />
          </button>
        </div>
      </section>

      <section className="settings-card future-settings">
        <div className="settings-section-heading"><div><h2>Language</h2><p>Language selection is prepared for a future update.</p></div><span className="coming-soon-badge">Coming soon</span></div>
        <label className="future-setting"><span><i className="bi bi-translate" /><span><strong>Language</strong><small>Choose the language used by the app.</small></span></span><select value={settings.preferred_language} disabled><option value="en">English</option></select></label>
      </section>
    </div>
  )
}

function requestLocationPermission() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      () => resolve(),
      (error) => reject(new Error(error.code === 1 ? 'Location permission was denied. You can enable it from your browser site settings.' : 'Your location could not be retrieved. Please try again.')),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
    )
  })
}
