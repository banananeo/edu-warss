import { motion } from 'framer-motion'
import StarBackground from './StarBackground.jsx'
import ProgressRing from './ProgressRing.jsx'
import './Dashboard.css'

const fadeUp = {
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.5, ease: 'easeOut' },
}

function Section({ id, label, children }) {
  return (
    <motion.section id={id} className="section" {...fadeUp}>
      <div className="section__head">
        <p className="eyebrow">{label}</p>
      </div>
      {children}
    </motion.section>
  )
}

function Empty({ children }) {
  return <p className="empty">{children}</p>
}

function AttendanceSection({ records }) {
  const overall = records.length
    ? records.reduce((sum, r) => sum + r.attendancePercentage, 0) / records.length
    : 0

  return (
    <Section id="attendance" label="Attendance">
      <div className="section__row">
        <h2>Overall {Math.round(overall)}%</h2>
      </div>
      {records.length === 0 ? (
        <Empty>No attendance data came back from Academia.</Empty>
      ) : (
        <ul className="attendance-grid">
          {records.map((r) => (
            <li key={r.courseCode + r.slot} className="attendance-card">
              <ProgressRing percentage={r.attendancePercentage} />
              <div>
                <p className="attendance-card__name">{r.courseTitle || r.courseCode}</p>
                <p className="attendance-card__meta num">
                  {r.classesConducted - r.classesAbsent}/{r.classesConducted} classes · {r.slot}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Section>
  )
}

function TimetableSection({ schedule }) {
  return (
    <Section id="timetable" label="Timetable">
      <p className="section__note">
        SRM runs on a rotating day order rather than the calendar week — check today's
        academic calendar entry to see which "Day" you're on.
      </p>
      {schedule.length === 0 ? (
        <Empty>No timetable data came back from Academia.</Empty>
      ) : (
        <div className="timetable">
          {schedule.map((d) => (
            <div key={d.dayLabel} className="timetable__day">
              <p className="timetable__day-label">{d.dayLabel}</p>
              <ul className="timetable__periods">
                {d.entries.length === 0 && <li className="timetable__empty">No classes</li>}
                {d.entries.map((p, i) => (
                  <li key={i} className="timetable__period">
                    <span className="num timetable__time">{p.timeLabel}</span>
                    <span>{p.courseTitle}</span>
                    <span className="timetable__room">
                      {p.room} · {p.faculty}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </Section>
  )
}

function MarksSection({ records, courseTitles }) {
  return (
    <Section id="marks" label="Marks">
      {records.length === 0 ? (
        <Empty>No marks data came back from Academia.</Empty>
      ) : (
        <table className="marks-table">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Test</th>
              <th className="num">Score</th>
            </tr>
          </thead>
          <tbody>
            {records.flatMap((r) => {
              const title = courseTitles.get(r.courseCode) || r.courseCode
              const rows = r.assessments.map((a, i) => (
                <tr key={`${r.courseCode}-${i}`}>
                  <td>{i === 0 ? title : ''}</td>
                  <td>{a.title}</td>
                  <td className="num">
                    {a.obtainedMarks}/{a.maximumMarks}
                  </td>
                </tr>
              ))
              rows.push(
                <tr key={`${r.courseCode}-total`} className="marks-table__total">
                  <td />
                  <td>Total</td>
                  <td className="num">{r.summary}</td>
                </tr>,
              )
              return rows
            })}
          </tbody>
        </table>
      )}
    </Section>
  )
}

function CalendarSection({ calendar }) {
  const today = new Date().toISOString().slice(0, 10)
  const entries = (calendar?.months || [])
    .flatMap((m) => m.entries)
    .filter((e) => e.category !== 'empty' && (e.title || e.category === 'holiday'))
    .sort((a, b) => a.date.localeCompare(b.date))

  const upcoming = entries.filter((e) => e.date >= today)
  const shown = (upcoming.length ? upcoming : entries).slice(0, 20)

  return (
    <Section id="calendar" label="Academic calendar">
      {calendar?.academicYearLabel && (
        <p className="section__note">
          {calendar.plannerType === 'ODD' ? 'Odd' : 'Even'} semester, {calendar.academicYearLabel}
        </p>
      )}
      {shown.length === 0 ? (
        <Empty>No calendar data came back from Academia.</Empty>
      ) : (
        <ul className="calendar-list">
          {shown.map((e, i) => (
            <li key={i} className="calendar-item">
              <span className="num calendar-item__date">{e.date}</span>
              <span>{e.title || e.day}</span>
              <span className="calendar-item__tag">{e.category.replace('-', ' ')}</span>
            </li>
          ))}
        </ul>
      )}
    </Section>
  )
}

function Dashboard({ data, lastSynced }) {
  const { profile, attendance = [], marks = [], schedule = [], courses = [], calendar } = data

  const courseTitles = new Map(courses.map((c) => [c.courseCode, c.courseTitle]))

  return (
    <main className="dashboard">
      <div className="dashboard__hero">
        <StarBackground />
        <div className="dashboard__hero-inner">
          <p className="eyebrow">Your record, up to date</p>
          <h1>
            {profile?.name ? `Hey ${profile.name.split(' ')[0]}.` : 'Everything in one page.'}
          </h1>
          {profile && (
            <p className="dashboard__profile num">
              {profile.registrationNumber} · {profile.department} {profile.section} · Sem{' '}
              {profile.semester}
            </p>
          )}
          {lastSynced && <p className="dashboard__synced num">Last synced {lastSynced}</p>}
        </div>
      </div>

      <AttendanceSection records={attendance} />
      <TimetableSection schedule={schedule} />
      <MarksSection records={marks} courseTitles={courseTitles} />
      <CalendarSection calendar={calendar} />
    </main>
  )
}

export default Dashboard
