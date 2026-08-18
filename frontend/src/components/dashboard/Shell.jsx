import { useState } from 'react'
import Sidebar from './Sidebar.jsx'
import MobileTabBar from './MobileTabBar.jsx'
import TopBar from './TopBar.jsx'
import HomeView from './views/HomeView.jsx'
import TimetableView from './views/TimetableView.jsx'
import AttendanceView from './views/AttendanceView.jsx'
import CoursesView from './views/CoursesView.jsx'
import CalendarView from './views/CalendarView.jsx'
import './Shell.css'

function Shell({ data, lastSynced, onRefresh, refreshing, onLogout, error }) {
  const [view, setView] = useState('home')
  const { profile, attendance = [], schedule = [], courses = [], calendar } = data

  const navigate = (next) => {
    setView(next)
    window.scrollTo(0, 0)
  }

  return (
    <div className="shell">
      <Sidebar view={view} onNavigate={navigate} onRefresh={onRefresh} refreshing={refreshing} onLogout={onLogout} />

      <div className="shell__main">
        <TopBar
          view={view}
          onBack={() => navigate('home')}
          onRefresh={onRefresh}
          refreshing={refreshing}
          profileName={profile?.name}
        />

        {error && <p className="shell__error">{error}</p>}

        <div className="shell__content">
          {view === 'home' && (
            <HomeView
              profile={profile}
              attendance={attendance}
              schedule={schedule}
              courses={courses}
              calendar={calendar}
              lastSynced={lastSynced}
              onNavigate={navigate}
            />
          )}
          {view === 'timetable' && <TimetableView schedule={schedule} calendar={calendar} />}
          {view === 'attendance' && <AttendanceView attendance={attendance} />}
          {view === 'courses' && <CoursesView courses={courses} attendance={attendance} />}
          {view === 'calendar' && <CalendarView calendar={calendar} />}
        </div>
      </div>

      <MobileTabBar view={view} onNavigate={navigate} />
    </div>
  )
}

export default Shell
