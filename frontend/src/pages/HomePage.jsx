import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../auth-context'
import { apiRequest } from '../api'
import MonthlyMission from '../components/MonthlyMission'
import NewsSection from '../components/NewsSection'
import ConfidenceRing from '../components/ConfidenceRing'
import { detectOffline } from '../offlineDetector'

export default function HomePage() {
  const { user, isGuest } = useAuth()
  const imageInputRef = useRef(null)
  const resultDialogRef = useRef(null)
  const [image, setImage] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [recording, setRecording] = useState(false)
  const [findingCentres, setFindingCentres] = useState(false)
  const [nearestCentres, setNearestCentres] = useState(null)
  const [centreError, setCentreError] = useState('')
  const [missionRefresh, setMissionRefresh] = useState(0)
  const [feedbackMode, setFeedbackMode] = useState('idle')
  const [feedbackCategory, setFeedbackCategory] = useState('')
  const [feedbackOtherCategory, setFeedbackOtherCategory] = useState('')
  const [feedbackSaving, setFeedbackSaving] = useState(false)
  const [feedbackError, setFeedbackError] = useState('')

  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
  }, [previewUrl])

  useEffect(() => {
    if (!result) return undefined

    const previousFocus = document.activeElement
    const previousOverflow = document.body.style.overflow
    const dialog = resultDialogRef.current
    const focusableSelector = 'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    document.body.style.overflow = 'hidden'
    dialog?.querySelector(focusableSelector)?.focus()

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setResult(null)
        return
      }

      if (event.key !== 'Tab' || !dialog) return
      const focusable = [...dialog.querySelectorAll(focusableSelector)]
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
      if (previousFocus instanceof HTMLElement) previousFocus.focus()
    }
  }, [result])

  function selectImage(event) {
    const selectedImage = event.target.files?.[0] || null
    setImage(selectedImage)
    setResult(null)
    setError('')
    setSuccess('')
    setNearestCentres(null)
    setCentreError('')
    resetFeedback()
    setPreviewUrl(selectedImage ? URL.createObjectURL(selectedImage) : '')
  }

  async function analyzeImage(event) {
    event.preventDefault()
    if (!image) {
      setError('Please choose an image to analyze.')
      return
    }

    setAnalyzing(true)
    setError('')
    setSuccess('')
    try {
      let detection
      if (navigator.onLine) {
        const formData = new FormData()
        formData.append('image', image)
        detection = await apiRequest('/api/detect', { method: 'POST', body: formData })
      } else {
        detection = await detectOffline(image)
      }
      resetFeedback()
      setResult(detection)
    } catch (requestError) {
      setResult(null)
      setError(requestError.message)
    } finally {
      setAnalyzing(false)
    }
  }

  function resetFeedback() {
    setFeedbackMode('idle')
    setFeedbackCategory('')
    setFeedbackOtherCategory('')
    setFeedbackSaving(false)
    setFeedbackError('')
  }

  async function submitDetectionFeedback(isCorrect) {
    if (!result || feedbackSaving) return
    if (!isCorrect && !feedbackCategory) {
      setFeedbackError('Please choose the correct category.')
      return
    }
    if (!isCorrect && feedbackCategory === 'Other' && !feedbackOtherCategory.trim()) {
      setFeedbackError('Please briefly describe the item.')
      return
    }

    setFeedbackSaving(true)
    setFeedbackError('')
    try {
      await apiRequest('/api/detection-feedback', {
        method: 'POST',
        body: JSON.stringify({
          feedback_token: result.feedback_token,
          is_correct: isCorrect,
          corrected_category: isCorrect ? null : feedbackCategory,
          other_category: feedbackCategory === 'Other' ? feedbackOtherCategory.trim() : null,
        }),
      })
      setFeedbackMode('submitted')
    } catch (requestError) {
      setFeedbackError(requestError.message)
    } finally {
      setFeedbackSaving(false)
    }
  }

  async function confirmRecycle() {
    setRecording(true)
    setError('')
    try {
      const data = await apiRequest('/api/recycle', { method: 'POST' })
      setSuccess(data.message)
      setResult(null)
      setImage(null)
      setPreviewUrl('')
      setMissionRefresh((current) => current + 1)
      if (imageInputRef.current) imageInputRef.current.value = ''
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setRecording(false)
    }
  }

  async function findNearestCentres() {
    setFindingCentres(true)
    setCentreError('')
    setNearestCentres(null)
    try {
      const position = await getCurrentPosition()
      const query = new URLSearchParams({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      })
      const data = await apiRequest(`/api/centres/nearest?${query}`)
      setNearestCentres(data)
    } catch (locationError) {
      setCentreError(locationError.message)
    } finally {
      setFindingCentres(false)
    }
  }

  return (
    <>
      <header className="scanner-header text-center mb-4 mb-md-5">
        <h1 className="display-5 fw-bold">Sustainable AI <span className="text-success">Scanning</span></h1>
        <p className="lead text-secondary">Hello, {isGuest ? 'Guest' : user.username}. Upload an item to find the right disposal path.</p>
      </header>

      {user && <MonthlyMission refreshToken={missionRefresh} />}

      {isGuest && <div className="guest-mode-notice mx-auto mb-4"><i className="bi bi-person" /><div><strong>You are exploring as a guest</strong><span>Detection and guidance are available. Sign in to earn points, save history and submit feedback.</span></div></div>}

      <section className="scanner-card card border-0 shadow-sm p-4 p-md-5 mx-auto">
        {error && <div className="alert alert-danger" role="alert"><i className="bi bi-exclamation-circle me-2" />{error}</div>}
        {success && <div className="alert alert-success" role="status"><i className="bi bi-check-circle me-2" />{success}</div>}

        <form onSubmit={analyzeImage}>
          <label className={`upload-area d-block text-center mb-4 ${analyzing ? 'is-scanning' : ''}`} htmlFor="imageInput">
            {previewUrl ? (
              <div className="scan-preview-wrap">
                <img className="image-preview shadow-sm" src={previewUrl} alt="Selected item preview" />
                {analyzing && (
                  <div className="scan-overlay" aria-hidden="true">
                    <span className="scan-corner corner-one" />
                    <span className="scan-corner corner-two" />
                    <span className="scan-corner corner-three" />
                    <span className="scan-corner corner-four" />
                    <span className="scan-line" />
                    <span className="scan-status">Analyzing object…</span>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <i className="bi bi-camera display-4 text-success d-block mb-2" />
                <p className="fw-bold mb-1">Tap to scan or upload</p>
                <p className="small text-secondary mb-0">AI will identify the item automatically</p>
              </div>
            )}
          </label>
          <input ref={imageInputRef} className="d-none" id="imageInput" type="file" accept="image/*" onChange={selectImage} />
          <button className="btn btn-success btn-lg w-100" type="submit" disabled={!image || analyzing}>
            {analyzing ? <><span className="spinner-border spinner-border-sm me-2" />Analyzing…</> : <><i className="bi bi-search me-2" />Analyze Object</>}
          </button>
        </form>
      </section>

      {result && (
        <div className="result-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setResult(null) }}>
          <section ref={resultDialogRef} className="result-dialog" role="dialog" aria-modal="true" aria-labelledby="scan-result-title" tabIndex="-1">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="h5 fw-bold mb-0" id="scan-result-title">Scan Complete</h2>
              <button className="btn-close" type="button" aria-label="Close" onClick={() => setResult(null)} />
            </div>
            <div className="text-center">
              {result.offline && <div className="offline-detection-notice text-start mb-3"><i className="bi bi-wifi-off" /><div><strong>Offline detection</strong><span>The cached model analyzed this image on your device. Connect and scan again to record points or feedback.</span></div></div>}
              <img className="detected-image img-fluid rounded-4 shadow-sm mb-3" src={result.annotated_image_url} alt={`Detected ${result.category}`} />
              <div className="scan-result-summary mb-3">
                <div className="text-start">
                  <span className="result-label">Detected item</span>
                  <h3 className="text-success fw-bold mb-0">{result.category}</h3>
                  <span className="points-preview">Worth {result.points} impact points</span>
                </div>
                <ConfidenceRing confidence={result.confidence} />
              </div>
              <div className="guideline-box text-start mb-4">
                <h4 className="small text-uppercase text-secondary fw-bold">How to recycle</h4>
                <p className="mb-0">{result.guideline}</p>
              </div>
              {!result.offline && !isGuest && <div className="detection-feedback text-start mb-4">
                {feedbackMode === 'submitted' ? (
                  <div className="detection-feedback-thanks"><i className="bi bi-check-circle-fill" /><div><strong>Thank you for your feedback</strong><span>Your response will help evaluate future model improvements.</span></div></div>
                ) : (
                  <>
                    <div className="detection-feedback-heading"><div><strong>Was this detection correct?</strong><span>Your feedback does not affect your points.</span></div><div className="detection-feedback-actions">
                      <button type="button" disabled={feedbackSaving} onClick={() => submitDetectionFeedback(true)}><i className="bi bi-hand-thumbs-up" /> Yes</button>
                      <button className={feedbackMode === 'correcting' ? 'active' : ''} type="button" disabled={feedbackSaving} onClick={() => { setFeedbackMode('correcting'); setFeedbackError('') }}><i className="bi bi-hand-thumbs-down" /> No</button>
                    </div></div>
                    {feedbackMode === 'correcting' && (
                      <div className="detection-correction">
                        <label htmlFor="correctedCategory">What should it be?</label>
                        <div><select id="correctedCategory" value={feedbackCategory} disabled={feedbackSaving} onChange={(event) => { setFeedbackCategory(event.target.value); setFeedbackOtherCategory(''); setFeedbackError('') }}><option value="">Choose a category</option>{result.feedback_categories.filter((category) => category.toLowerCase() !== result.category.toLowerCase()).map((category) => <option value={category} key={category}>{category.replaceAll('_', ' ')}</option>)}<option value="Other">Other / Not listed</option></select>{feedbackCategory === 'Other' && <input type="text" value={feedbackOtherCategory} maxLength="80" disabled={feedbackSaving} onChange={(event) => setFeedbackOtherCategory(event.target.value)} placeholder="Describe the item" aria-label="Describe the correct item" />}<button type="button" disabled={feedbackSaving || !feedbackCategory || (feedbackCategory === 'Other' && !feedbackOtherCategory.trim())} onClick={() => submitDetectionFeedback(false)}>{feedbackSaving ? <span className="spinner-border spinner-border-sm" /> : 'Submit correction'}</button></div>
                      </div>
                    )}
                    {feedbackError && <div className="detection-feedback-error" role="alert"><i className="bi bi-exclamation-circle" /> {feedbackError}</div>}
                  </>
                )}
              </div>}
              {centreError && (
                <div className="nearest-centres-error text-start" role="alert">
                  <i className="bi bi-exclamation-circle" />
                  <div><strong>Location unavailable</strong><span>{centreError}</span></div>
                </div>
              )}
              {nearestCentres && <NearestCentres data={nearestCentres} />}
              <div className="d-grid gap-2">
                <button className="btn btn-success py-3 fw-bold" type="button" onClick={confirmRecycle} disabled={isGuest || result.offline || recording || feedbackSaving}>
                  <i className="bi bi-recycle me-2" />{isGuest ? 'Sign in to record recycling' : result.offline ? 'Reconnect to record recycling' : recording ? 'Recording…' : `Recycle It! (+${result.points} points)`}
                </button>
                <button className="btn btn-outline-success py-3 fw-bold" type="button" onClick={findNearestCentres} disabled={result.offline || findingCentres}>
                  {result.offline ? <><i className="bi bi-wifi-off me-2" />Reconnect to find nearest centres</> : findingCentres ? <><span className="spinner-border spinner-border-sm me-2" />Finding nearby centres…</> : <><i className="bi bi-geo-alt me-2" />Find Nearest Verified Centres</>}
                </button>
                <a className="btn btn-outline-success py-3 fw-bold" href={result.centers_pdf_url} target="_blank" rel="noreferrer"><i className="bi bi-file-earmark-pdf me-2" />View Disposal Center List</a>
              </div>
            </div>
          </section>
        </div>
      )}

      <NewsSection />
    </>
  )
}

function NearestCentres({ data }) {
  return (
    <section className="nearest-centres text-start mb-4" aria-labelledby="nearest-centres-title">
      <div className="nearest-centres-heading">
        <div><span className="result-label">Government-listed locations</span><h4 id="nearest-centres-title">Nearest verified centres</h4></div>
        <span className="verified-centres-badge"><i className="bi bi-patch-check-fill" /> Verified list</span>
      </div>
      <div className="nearest-centres-list">
        {data.centres.map((centre, index) => (
          <article className="nearest-centre" key={centre.centre_id}>
            <span className="nearest-centre-rank">{index + 1}</span>
            <div className="nearest-centre-copy">
              <strong>{centre.name}</strong>
              <span>{centre.address}</span>
            </div>
            <div className="nearest-centre-action">
              <strong>~{centre.distance_km} km</strong>
              <a href={centre.directions_url} target="_blank" rel="noreferrer">Directions <i className="bi bi-arrow-up-right" /></a>
            </div>
          </article>
        ))}
      </div>
      <p className="centre-attribution"><i className="bi bi-info-circle" /> Distances are approximate; confirm the driving route in Google Maps. <a href={data.source_pdf_url} target="_blank" rel="noreferrer">Official PDF</a> · <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">© OpenStreetMap contributors</a></p>
    </section>
  )
}

function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('This browser does not support location access.'))
      return
    }
    navigator.geolocation.getCurrentPosition(
      resolve,
      (error) => reject(new Error(error.code === 1 ? 'Location permission was denied. Enable it from your browser site controls and try again.' : 'Your current location could not be retrieved. Please try again.')),
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 300000 },
    )
  })
}
