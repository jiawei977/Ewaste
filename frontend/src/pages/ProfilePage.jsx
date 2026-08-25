import { useEffect, useState } from 'react'
import { apiRequest } from '../api'
import { useAuth } from '../auth-context'
import AvatarUploader from '../components/AvatarUploader'
import PageLoading from '../components/PageLoading'

const emptyProfile = { username: '', email: '', full_name: '', bio: '', gender: '', address: '', city: '', state: '', postcode: '' }

export default function ProfilePage() {
  const { updateProfile } = useAuth()
  const [profile, setProfile] = useState(emptyProfile)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    apiRequest('/api/profile')
      .then((data) => setProfile(data.profile))
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <PageLoading message="Loading your profile…" />

  function updateField(event) {
    setProfile((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  async function saveProfile(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      const data = await updateProfile(profile)
      setProfile(data.profile)
      setSuccess(data.message)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="settings-layout">
      <header className="settings-header">
        <span className="page-kicker"><i className="bi bi-person-circle" /> Your account</span>
        <h1>Edit Profile</h1>
        <p>Personalize your account. Everything except your username and email is optional.</p>
      </header>

      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      {success && <div className="alert alert-success" role="status">{success}</div>}

      <section className="settings-card profile-photo-section">
        <AvatarUploader variant="profile" />
        <div><h2>Profile picture</h2><p>Your picture appears in the navigation bar and global leaderboard.</p></div>
      </section>

      <form className="settings-card profile-form" onSubmit={saveProfile}>
        <div className="settings-section-heading"><div><h2>Basic information</h2><p>Your email is used for login and cannot be changed here.</p></div></div>
        <div className="profile-form-grid">
          <FormField label="Username" name="username" value={profile.username} onChange={updateField} maxLength="100" required />
          <FormField label="Email address" name="email" value={profile.email} type="email" disabled hint="Email changes require account verification." />
          <FormField label="Full name" name="full_name" value={profile.full_name} onChange={updateField} maxLength="120" placeholder="Optional" />
          <label className="profile-field"><span>Gender <small>Optional</small></span><select name="gender" value={profile.gender} onChange={updateField}><option value="">Not specified</option><option value="female">Female</option><option value="male">Male</option><option value="non_binary">Non-binary</option><option value="prefer_not_to_say">Prefer not to say</option></select></label>
          <label className="profile-field profile-field-wide"><span>Bio <small>{profile.bio.length}/500</small></span><textarea name="bio" rows="4" value={profile.bio} onChange={updateField} maxLength="500" placeholder="Tell the community a little about your sustainability journey." /></label>
        </div>

        <div className="settings-section-heading profile-address-heading"><div><h2>Address</h2><p>Optional. This may support location-aware recycling features later.</p></div><span className="optional-badge">Optional</span></div>
        <div className="profile-form-grid">
          <FormField className="profile-field-wide" label="Address" name="address" value={profile.address} onChange={updateField} maxLength="255" placeholder="Street address" />
          <FormField label="City" name="city" value={profile.city} onChange={updateField} maxLength="100" />
          <FormField label="State" name="state" value={profile.state} onChange={updateField} maxLength="100" />
          <FormField label="Postcode" name="postcode" value={profile.postcode} onChange={updateField} maxLength="20" inputMode="numeric" />
        </div>
        <div className="profile-form-actions"><button className="btn btn-success px-4" type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</button></div>
      </form>
    </div>
  )
}

function FormField({ label, hint, className = '', ...inputProps }) {
  return <label className={`profile-field ${className}`}><span>{label}</span><input {...inputProps} />{hint && <small className="field-hint">{hint}</small>}</label>
}
