import { useCallback, useState } from 'react'
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
      // /refresh doesn't re-send profile — keep the one from login.
      setData((prev) => ({ ...prev, ...fresh, profile: prev?.profile }))
      setLastSynced(new Date().toLocaleString())
    } catch (err) {
      setError(err.message)
      // The stored cookies are no good anymore — back to the login screen.
      clearSession()
      setAuthed(false)
    } finally {
      setRefreshing(false)
    }
  }, [])

  const handleLogout = () => {
    clearSession()
    setAuthed(false)
    setData(null)
    setLastSynced(null)
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
