import DayBadge from '../DayBadge.jsx'
import { ClockIcon, CheckRingIcon, BookIcon, CalendarIcon } from '../Icons.jsx'
import { getStatusTone } from '../../../utils/attendance.js'
import { todayISO, findEntryForDate, allEntries } from '../../../utils/calendar.js'
import './HomeView.css'

const NAV_CARDS = [
  { id: 'timetable', label: 'Timetable', Icon: ClockIcon, tone: 'sky', blurb: 'Classes by Day Order' },
  { id: 'attendance', label: 'Attendance', Icon: CheckRingIcon, tone: 'pink', blurb: 'Per-course % and margin' },
  { id: 'courses', label: 'Courses', Icon: BookIcon, tone: 'peach', blurb: 'Faculty, room, credits' },
  { id: 'calendar', label: 'Calendar', Icon: CalendarIcon, tone: 'mint', blurb: 'Holidays and events' },
]

function HomeView({ profile, attendance, schedule, courses, calendar, lastSynced, onNavigate }) {
  const today = todayISO()
  const todayEntry = findEntryForDate(calendar, today)
  const todayDayOrder = todayEntry?.dayOrder
  const todaysClasses = todayDayOrder
    ? schedule.find((d) => d.dayLabel === `Day ${todayDayOrder}`)?.entries || []
    : []

  const overallAttendance = attendance.length
    ? attendance.reduce((sum, r) => sum + r.attendancePercentage, 0) / attendance.length
    : null
  const atRisk = attendance.filter((r) => r.attendancePercentage < 75)

  const upcoming = allEntries(calendar)
    .filter((e) => e.date >= today && e.category !== 'working-day')
    .slice(0, 4)

  const firstName = profile?.name ? profile.name.split(' ')[0] : null

  return (
    <div className="home">
      <section className="bcard bcard--yellow home__hero">
        <div className="home__hero-info">
          <p className="eyebrow">Your record, up to date</p>
          <h2 className="home__hero-title">{firstName ? `Hey ${firstName}.` : 'Welcome back.'}</h2>
          {profile && (
            <p className="home__hero-meta num">
              {profile.registrationNumber} · {profile.department} {profile.section} · Sem {profile.semester}
            </p>
          )}
          {lastSynced && <p className="home__hero-synced num">Last synced {lastSynced}</p>}
        </div>

        <div className="home__hero-today">
          {todayDayOrder ? (
            <>
              <DayBadge day={todayDayOrder} size="lg" />
              <div className="home__hero-today-text">
                <p className="eyebrow">Today</p>
                <p className="home__hero-today-count">
                  {todaysClasses.length
                    ? `${todaysClasses.length} class${todaysClasses.length === 1 ? '' : 'es'}`
                    : 'No classes'}
                </p>
                <button className="bbtn bbtn--outline home__hero-btn" onClick={() => onNavigate('timetable')}>
                  View timetable
                </button>
              </div>
            </>
          ) : (
            <div className="home__hero-today-text">
              <p className="eyebrow">Today</p>
              <p className="home__hero-today-count">No Day Order found</p>
            </div>
          )}
        </div>
      </section>

      <section className="home__stats">
        <div className="bcard home__stat">
          <p className="eyebrow">Attendance</p>
          <p className="home__stat-value num">
            {overallAttendance !== null ? `${overallAttendance.toFixed(1)}%` : '—'}
          </p>
          <p className="home__stat-sub">
            {atRisk.length > 0
              ? `${atRisk.length} course${atRisk.length === 1 ? '' : 's'} below 75%`
              : attendance.length
                ? 'All courses on track'
                : 'No data yet'}
          </p>
        </div>
        <div className="bcard home__stat">
          <p className="eyebrow">Courses</p>
          <p className="home__stat-value num">{courses.length || '—'}</p>
          <p className="home__stat-sub">enrolled this semester</p>
        </div>
        <div className="bcard home__stat">
          <p className="eyebrow">Next up</p>
          <p className="home__stat-value home__stat-value--text">
            {upcoming[0]?.title || upcoming[0]?.day || 'Nothing scheduled'}
          </p>
          <p className="home__stat-sub num">{upcoming[0]?.date || ''}</p>
        </div>
      </section>

      <section className="home__nav-grid">
        {NAV_CARDS.map(({ id, label, Icon, tone, blurb }) => (
          <button key={id} className={`bcard bcard--${tone} home__nav-card`} onClick={() => onNavigate(id)}>
            <Icon width={22} height={22} />
            <span className="home__nav-card-label">{label}</span>
            <span className="home__nav-card-blurb">{blurb}</span>
          </button>
        ))}
      </section>

      {atRisk.length > 0 && (
        <section className="bcard home__risk">
          <p className="eyebrow">Needs attention</p>
          <ul className="home__risk-list">
            {atRisk.slice(0, 3).map((r) => (
              <li key={r.courseCode} className="home__risk-item">
                <span>{r.courseTitle || r.courseCode}</span>
                <span className={`bchip bchip--${getStatusTone(r.attendancePercentage)} num`}>
                  {r.attendancePercentage.toFixed(1)}%
                </span>
              </li>
            ))}
          </ul>
          <button className="bbtn bbtn--outline" onClick={() => onNavigate('attendance')}>
            See all attendance
          </button>
        </section>
      )}

      {upcoming.length > 0 && (
        <section className="bcard home__upcoming">
          <div className="home__upcoming-head">
            <p className="eyebrow">Coming up on the calendar</p>
            <button className="bbtn bbtn--ghost home__upcoming-link" onClick={() => onNavigate('calendar')}>
              Open calendar
            </button>
          </div>
          <ul className="home__upcoming-list">
            {upcoming.map((e) => (
              <li key={e.date} className="home__upcoming-item">
                <span className="num home__upcoming-date">{e.date}</span>
                <span>{e.title || e.day}</span>
                <span className={`bchip home__upcoming-tag${e.category === 'holiday' ? ' bchip--good' : ''}`}>
                  {e.category.replace('-', ' ')}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}

export default HomeView
