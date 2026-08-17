import './Navbar.css'

const SECTIONS = [
  { id: 'attendance', label: 'Attendance' },
  { id: 'timetable', label: 'Timetable' },
  { id: 'marks', label: 'Marks' },
  { id: 'calendar', label: 'Calendar' },
]

function Navbar({ onRefresh, onLogout, refreshing }) {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <span className="navbar__mark">
          Ledger<span className="navbar__mark-dot">.</span>
        </span>

        <nav className="navbar__links">
          {SECTIONS.map((s) => (
            <button key={s.id} className="navbar__link" onClick={() => scrollTo(s.id)}>
              {s.label}
            </button>
          ))}
        </nav>

        <div className="navbar__actions">
          <button className="navbar__btn" onClick={onRefresh} disabled={refreshing}>
            {refreshing ? 'Syncing…' : 'Sync'}
          </button>
          <button className="navbar__btn navbar__btn--ghost" onClick={onLogout}>
            Sign out
          </button>
        </div>
      </div>
    </header>
  )
}

export default Navbar
