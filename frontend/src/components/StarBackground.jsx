import { motion } from 'framer-motion'

// The signature visual of the app: a thin line drifting quietly across the
// page, with a brighter pulse travelling along it. It's meant to read as a
// thread — the same thread an attendance streak is made of, and the one
// thing this whole app exists to help you not break.
function StarBackground() {
  const path =
    'M -100 140 C 120 40, 260 220, 420 120 S 700 40, 860 140 S 1120 220, 1300 100'

  return (
    <div className="flow-bg" aria-hidden="true">
      <svg
        viewBox="0 0 1200 280"
        preserveAspectRatio="none"
        className="flow-bg__svg"
      >
        <motion.path
          d={path}
          fill="none"
          stroke="var(--line-strong)"
          strokeWidth="1"
          initial={{ y: 0 }}
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.path
          d={path}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeDasharray="1 220"
          initial={{ y: 0, strokeDashoffset: 0 }}
          animate={{ y: [0, 10, 0], strokeDashoffset: [0, -1600] }}
          transition={{
            y: { duration: 14, repeat: Infinity, ease: 'easeInOut' },
            strokeDashoffset: {
              duration: 9,
              repeat: Infinity,
              ease: 'linear',
            },
          }}
          opacity={0.6}
        />
      </svg>
    </div>
  )
}

export default StarBackground
