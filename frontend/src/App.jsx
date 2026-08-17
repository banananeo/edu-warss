import { useCallback, useEffect, useState } from 'react'
import Navbar from './components/Navbar.jsx'
import Dashboard from './components/Dashboard.jsx'
import LoginForm from './components/LoginForm.jsx'
import { refresh, clearSession, hasSession } from './api.js'
import './App.css'

function App() {
  const [data, setData] = useState(null)
  const [authed, setAuthed] = useState(hasSession())
  const [lastSynced, setLastSynced] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [bootstrapping, setBootstrapping] = useState(hasSession()) // NEW

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

  // NEW: on first load, if we already have a session, fetch data automatically
  useEffect(() => {
    if (hasSession()) {
      sync().finally(() => setBootstrapping(false))
    }
  }, [sync])

  const handleLogout = () => {
    clearSession()
    setAuthed(false)
    setData(null)
    setLastSynced(null)
  }

  if (bootstrapping) {
    return <p style={{ padding: 24 }}>Loading your dashboard…</p> // or a spinner component
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