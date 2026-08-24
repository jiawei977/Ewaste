export default function ConfidenceRing({ confidence }) {
  const percentage = Math.round(confidence * 100)
  return (
    <div className="confidence-ring" style={{ '--confidence': `${percentage * 3.6}deg` }} role="img" aria-label={`${percentage}% detection confidence`}>
      <div className="confidence-ring-inner">
        <strong>{percentage}%</strong>
        <span>confidence</span>
      </div>
    </div>
  )
}
