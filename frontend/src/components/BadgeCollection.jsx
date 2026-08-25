export default function BadgeCollection({ badges, earnedCount }) {
  return (
    <section className="settings-card achievement-section">
      <div className="settings-section-heading achievement-heading">
        <div><h2>Achievements</h2><p>Recycle more items to unlock badges for your profile.</p></div>
        <span className="achievement-count">{earnedCount}/{badges.length} earned</span>
      </div>
      <div className="badge-grid">
        {badges.map((badge) => (
          <article className={`achievement-card ${badge.earned ? 'earned' : 'locked'}`} style={{ '--badge-color': badge.color }} key={badge.key}>
            <div className="achievement-icon"><i className={`bi ${badge.earned ? badge.icon : 'bi-lock-fill'}`} /></div>
            <div className="achievement-copy">
              <div className="achievement-title"><h3>{badge.name}</h3>{badge.earned && <span><i className="bi bi-check-circle-fill" /> Unlocked</span>}</div>
              <p>{badge.description}</p>
              <div className="achievement-progress" aria-label={`${badge.progress}% complete`}><span style={{ width: `${badge.progress}%` }} /></div>
              <small>{Math.min(badge.current, badge.target)} / {badge.target}</small>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
