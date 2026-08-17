import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'
const STORAGE_KEY = 'ledger:cookies'

const api = axios.create({ baseURL: BASE_URL })

export function getStoredCookies() {
  const raw = localStorage.getItem(STORAGE_KEY)
  try {
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function storeCookies(cookies) {
  if (cookies) localStorage.setItem(STORAGE_KEY, JSON.stringify(cookies))
}

export function clearSession() {
  localStorage.removeItem(STORAGE_KEY)
}

export function hasSession() {
  return Boolean(getStoredCookies())
}

// Raised when the portal wants a captcha solved before it'll log in.
export class CaptchaRequiredError extends Error {
  constructor(detail) {
    super(detail.message || 'Captcha required')
    this.cdigest = detail.cdigest
    this.image = detail.image
  }
}

function unwrapDetail(err) {
  const detail = err.response?.data?.detail
  if (detail && typeof detail === 'object' && detail.type === 'CAPTCHA_REQUIRED') {
    throw new CaptchaRequiredError(detail)
  }
  const message = typeof detail === 'string' ? detail : detail?.message
  throw new Error(message || err.message || 'Request failed')
}

// Full login: returns profile, attendance, marks, schedule, courses,
// calendar — everything the dashboard needs in one call.
export async function login({ username, password, captcha, cdigest }) {
  try {
    const { data } = await api.post('/login', { username, password, captcha, cdigest })
    storeCookies(data.session?.cookies)
    return data
  } catch (err) {
    unwrapDetail(err)
  }
}

// Re-pulls fresh data using the stored session cookies — no password
// needed unless the portal has logged the session out, in which case
// this throws and the app should fall back to the login screen.
export async function refresh() {
  const cookies = getStoredCookies()
  if (!cookies) throw new Error('Not logged in')
  try {
    const { data } = await api.post('/refresh', { cookies })
    storeCookies(data.session?.cookies)
    return data
  } catch (err) {
    unwrapDetail(err)
  }
}

export default api
