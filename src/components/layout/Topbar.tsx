import { useState } from 'react'
import { useMatches, useNavigate } from 'react-router-dom'
import { cx } from '../ui/utils'
import { Avatar } from '../ui'
import { useTheme } from '../../theme/useTheme'
import { MenuIcon, SearchIcon, BellIcon, SunIcon, MoonIcon } from '../icons'
import { APP_NAME, CURRENT_USER } from '../../constants/app'
import { ROUTES } from '../../routes/paths'
import { useCurrentUser } from '../../context/currentUserContext'
import styles from './Topbar.module.css'

interface RouteHandle {
  title?: string
}

export interface TopbarProps {
  onMenuClick: () => void
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const { theme, toggleTheme } = useTheme()
  const { user } = useCurrentUser()
  const matches = useMatches()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const title =
    [...matches]
      .reverse()
      .map((m) => (m.handle as RouteHandle | undefined)?.title)
      .find(Boolean) ?? APP_NAME

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const q = query.trim()
    navigate(q ? `${ROUTES.directory}?q=${encodeURIComponent(q)}` : ROUTES.directory)
  }

  return (
    <header className={styles.topbar}>
      <button
        type="button"
        className={cx(styles.iconButton, styles.menuButton)}
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <MenuIcon />
      </button>

      <h1 className={styles.title}>{title}</h1>

      <form className={styles.search} onSubmit={handleSearch} role="search">
        <SearchIcon className={styles.searchIcon} />
        <input
          className={styles.searchInput}
          type="search"
          placeholder="Search people…"
          aria-label="Search people"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.iconButton}
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
        >
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>

        <button
          type="button"
          className={cx(styles.iconButton, styles.hasBadge)}
          onClick={() => navigate(ROUTES.announcements)}
          aria-label="Announcements"
          title="Announcements"
        >
          <BellIcon />
          <span className={styles.dot} aria-hidden="true" />
        </button>

        <button
          type="button"
          className={styles.avatarButton}
          onClick={() => navigate(ROUTES.profile)}
          aria-label="Your profile"
          title="Your profile"
        >
          <Avatar name={user?.name ?? CURRENT_USER.name} size="sm" status={user?.status ?? 'online'} />
        </button>
      </div>
    </header>
  )
}
