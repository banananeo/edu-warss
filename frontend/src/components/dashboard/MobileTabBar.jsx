import { NAV_ITEMS } from './Sidebar.jsx'
import './MobileTabBar.css'

function MobileTabBar({ view, onNavigate }) {
  return (
    <nav className="mtab" aria-label="Sections">
      {NAV_ITEMS.map(({ id, label, Icon }) => (
        <button
          key={id}
          className={`mtab__item${view === id ? ' mtab__item--active' : ''}`}
          onClick={() => onNavigate(id)}
        >
          <Icon width={20} height={20} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  )
}

export default MobileTabBar
