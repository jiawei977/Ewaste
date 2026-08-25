import { useRef, useState } from 'react'
import { useAuth } from '../auth-context'
import UserAvatar from './UserAvatar'

export default function AvatarUploader({ variant = 'navbar' }) {
  const { user, uploadAvatar } = useAuth()
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  async function handleAvatarChange(event) {
    const file = event.target.files?.[0]
    if (!file) return

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      setError('Please choose a JPEG, PNG, or WebP image.')
      event.target.value = ''
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Avatar image must be 5 MB or smaller.')
      event.target.value = ''
      return
    }

    setUploading(true)
    setError('')
    try {
      await uploadAvatar(file)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setUploading(false)
      event.target.value = ''
    }
  }

  return (
    <div className={`avatar-uploader avatar-uploader-${variant}`}>
      <button
        className={`avatar-upload-button avatar-upload-button-${variant}`}
        type="button"
        title="Change profile picture"
        aria-label="Change profile picture"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
      >
        <UserAvatar user={user} className={variant === 'profile' ? 'profile-avatar' : 'navbar-avatar'} />
        <span className="avatar-edit-badge" aria-hidden="true">
          {uploading ? <span className="spinner-border spinner-border-sm" /> : <i className="bi bi-camera-fill" />}
        </span>
      </button>
      <input
        ref={inputRef}
        className="visually-hidden"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleAvatarChange}
      />
      {error && <span className="avatar-upload-error" role="alert">{error}</span>}
      {variant === 'profile' && <span className="avatar-upload-hint">Choose a JPEG, PNG, or WebP image up to 5 MB</span>}
    </div>
  )
}
