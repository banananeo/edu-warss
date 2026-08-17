import { useCallback, useEffect, useState } from 'react'
import Navbar from './components/Navbar.jsx'
import Dashboard from './components/Dashboard.jsx'
import LoginForm from './components/LoginForm.jsx'
import { refresh, clearSession, hasSession } from './api.js'
import './App.css'

const AUTO_SYNC_INTERVAL_MS = 5 * 60 * 1000 // every 5 minutes — adjust as you like

function App() {
  const [data, setData] = useState(null)
  const [authed, setAuthed] = useState(hasSession())
  const [lastSynced, setLastSynced] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [bootstrapping, setBootstrapping] = useState(hasSession())

  const handleLoginSuccess = (loginData) => {
    setData(loginData)
    setAuthed(true)
    setLastSynced(new Date().toLocaleString())
    setError('')
  }

  const sync = useCallback(async () => {
    setRefreshing(true)
    setError('')
    try {
      const fresh = await refresh()
      setData((prev) => ({ ...fresh, profile: prev?.profile ?? fresh.profile }))
      setLastSynced(new Date().toLocaleString())
    } catch (err) {
      setError(err.message)
      clearSession()
      setAuthed(false)
    } finally {
      setRefreshing(false)
    }
  }, [])

  // Initial sync on page load, if a session already exists
  useEffect(() => {
    if (hasSession()) {
      sync().finally(() => setBootstrapping(false))
    }
  }, [sync])

  // NEW: keep syncing automatically in the background while logged in
  useEffect(() => {
    if (!authed) return

    const id = setInterval(() => {
      sync()
    }, AUTO_SYNC_INTERVAL_MS)

    return () => clearInterval(id)
  }, [authed, sync])

  const handleLogout = () => {
    clearSession()
    setAuthed(false)
    setData(null)
    setLastSynced(null)
  }

  if (bootstrapping) {
    return <p style={{ padding: 24 }}>Loading your dashboard…</p>
  }

  if (!authed || !data) {
    return <LoginForm onSuccess={handleLoginSuccess} />
  }

  return (
    <>
      <Navbar onRefresh={sync} onLogout={handleLogout} refreshing={refreshing} />
      {error && <p className="app__error">{error}</p>}
      <Dashboard data={data} lastSynced={lastSynced} />
    </>
  )
}

export default App