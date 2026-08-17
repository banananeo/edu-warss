# Ledger — your Academia record, on one page

A minimal light dashboard for `academia.srmist.edu.in`: attendance, timetable,
marks, and academic calendar, in one place.

## Backend

The backend is [boredlol0/jaaw](https://github.com/boredlol0/jaaw)'s Fastify +
TypeScript API, pulled out of that project as a standalone service. It's a
real, working scraper — proper Zoho OAuth login, captcha handling, and
cheerio parsers for every page — not a stub. Credit to that project for the
scraping logic; nothing in `backend/` was reverse-engineered here.

It's stateless: `/login` and `/refresh` hand back the session cookies picked
up from Academia, and the caller re-sends them on the next request. No
server-side session store, so it's safe to restart or scale without anyone
getting logged out.

- `POST /login` — body `{ username, password }` (or `{ captcha, cdigest }` on
  a second call if the portal demands one). Returns `profile`, `attendance`,
  `marks`, `schedule`, `courses`, `calendar`, and `session.cookies`.
- `POST /refresh` — body `{ cookies }`. Re-pulls everything except `profile`
  using the existing session.
- `GET /health` — uptime/memory check.

## Frontend

React + Vite, `framer-motion` for the motion, plain CSS (no build-tool setup
needed). Stores the session cookies Academia issues in `localStorage` and
resends them on each sync — never stores your password.

## Run it

```bash
# backend
cd backend
npm install
npm run dev            # http://localhost:4000

# frontend, in a second terminal
cd frontend
npm install
cp .env.example .env
npm run dev
```

Open the printed Vite URL, sign in with your Net ID + password. If Academia
asks for a captcha, you'll be prompted for it right there in the form.

## Notes

- If a sync fails because the session's expired, the app clears the stored
  cookies and drops you back to the login screen — sign in again to
  refresh them.
- `tailwindcss` was in the original scaffold's `package.json` but never
  wired into the Vite build, so this version uses plain CSS in the same
  custom-property style as the rest of the project.
- Scraping your own account is between you and SRM's terms of service —
  this is built for personal, single-account use, same as the upstream
  `jaaw` project it borrows the backend from.
