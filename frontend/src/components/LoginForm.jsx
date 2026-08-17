import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import StarBackground from './StarBackground.jsx'
import { login, CaptchaRequiredError } from '../api.js'
import './LoginForm.css'

function LoginForm({ onSuccess }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [captchaValue, setCaptchaValue] = useState('')
  const [captcha, setCaptcha] = useState(null) // { image, cdigest } once the portal asks for one
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const attempt = async (extra = {}) => {
    setError('')
    setLoading(true)
    try {
      const data = await login({ username, password, ...extra })
      onSuccess(data)
    } catch (err) {
      if (err instanceof CaptchaRequiredError) {
        setCaptcha({ image: err.image, cdigest: err.cdigest })
        setError(err.message)
      } else {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCredentials = (e) => {
    e.preventDefault()
    attempt()
  }

  const handleCaptcha = (e) => {
    e.preventDefault()
    attempt({ captcha: captchaValue, cdigest: captcha.cdigest })
  }

  return (
    <div className="login">
      <StarBackground />
      <motion.form
        className="login__card"
        onSubmit={captcha ? handleCaptcha : handleCredentials}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <p className="eyebrow">Ledger</p>
        <h1 className="login__title">Sign in with Academia</h1>
        <p className="login__sub">
          Your Net ID and password go straight to the college portal — this app never stores them.
        </p>

        <AnimatePresence mode="wait">
          {!captcha ? (
            <motion.div
              key="credentials"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <label className="login__field">
                <span>Net ID</span>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  required
                />
              </label>

              <label className="login__field">
                <span>Password</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </label>
            </motion.div>
          ) : (
            <motion.div
              key="captcha"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className="login__captcha-hint">
                Academia wants you to confirm you're human.
              </p>
              <img className="login__captcha-img" src={captcha.image} alt="captcha" />
              <label className="login__field">
                <span>Enter the text above</span>
                <input
                  value={captchaValue}
                  onChange={(e) => setCaptchaValue(e.target.value)}
                  autoFocus
                  required
                />
              </label>
            </motion.div>
          )}
        </AnimatePresence>

        {error && <p className="login__error">{error}</p>}

        <button className="login__submit" type="submit" disabled={loading}>
          {loading ? 'Signing in…' : captcha ? 'Confirm & sign in' : 'Sign in'}
        </button>
      </motion.form>
    </div>
  )
}

export default LoginForm
