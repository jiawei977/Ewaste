import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../auth-context'
import { apiRequest } from '../api'
import MonthlyMission from '../components/MonthlyMission'
import NewsSection from '../components/NewsSection'
import ConfidenceRing from '../components/ConfidenceRing'

export default function HomePage() {
  const { user } = useAuth()
  const imageInputRef = useRef(null)
  const resultDialogRef = useRef(null)
  const [image, setImage] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [recording, setRecording] = useState(false)
  const [missionRefresh, setMissionRefresh] = useState(0)

  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
  }, [previewUrl])

  useEffect(() => {
    if (!result) return undefined

    const previousFocus = document.activeElement
    const previousOverflow = document.body.style.overflow
    const dialog = resultDialogRef.current
    const focusableSelector = 'button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])'
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
    const formData = new FormData()
    formData.append('image', image)

    try {
      setResult(await apiRequest('/api/detect', { method: 'POST', body: formData }))
    } catch (requestError) {
      setResult(null)
      setError(requestError.message)
    } finally {
      setAnalyzing(false)
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

  return (
    <>
      <header className="scanner-header text-center mb-4 mb-md-5">
        <h1 className="display-5 fw-bold">Sustainable AI <span className="text-success">Scanning</span></h1>
        <p className="lead text-secondary">Hello, {user.username}. Upload an item to find the right disposal path.</p>
      </header>

      <MonthlyMission refreshToken={missionRefresh} />

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
          <input ref={imageInputRef} className="d-none" id="imageInput" type="file" accept="image/*" capture="environment" onChange={selectImage} />
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
              <div className="d-grid gap-2">
                <button className="btn btn-success py-3 fw-bold" type="button" onClick={confirmRecycle} disabled={recording}>
                  <i className="bi bi-recycle me-2" />{recording ? 'Recording…' : `Recycle It! (+${result.points} points)`}
                </button>
                <a className="btn btn-outline-success py-3 fw-bold" href={result.map_url} target="_blank" rel="noreferrer"><i className="bi bi-geo-alt me-2" />Find Nearest Disposal Center</a>
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
