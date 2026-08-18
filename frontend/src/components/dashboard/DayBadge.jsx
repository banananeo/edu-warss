import './DayBadge.css'

// SRM runs on a rotating Day Order instead of the calendar week, so this
// stamp is the one visual the whole dashboard uses to answer "which day
// am I on" at a glance.
function DayBadge({ day, size = 'md', tone = 'yellow' }) {
  const number = String(day ?? '–').replace(/^Day\s*/i, '')

  return (
    <div className={`day-badge day-badge--${size} day-badge--${tone}`}>
      <span className="day-badge__label">Day</span>
      <span className="day-badge__number">{number}</span>
    </div>
  )
}

export default DayBadge
