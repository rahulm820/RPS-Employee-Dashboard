import { useMatches } from 'react-router-dom'
import { cx } from '../ui/utils'
import { Avatar } from '../ui'
import { useTheme } from '../../theme/useTheme'
import { MenuIcon, SearchIcon, BellIcon, SunIcon, MoonIcon } from '../icons'
import { APP_NAME, CURRENT_USER } from '../../constants/app'
import styles from './Topbar.module.css'

interface RouteHandle {
  title?: string
}

export interface TopbarProps {
  onMenuClick: () => void
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const { theme, toggleTheme } = useTheme()
  const matches = useMatches()

  const title =
    [...matches]
      .reverse()
      .map((m) => (m.handle as RouteHandle | undefined)?.title)
      .find(Boolean) ?? APP_NAME

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

      <div className={styles.search}>
        <SearchIcon className={styles.searchIcon} />
        <input
          className={styles.searchInput}
          type="search"
          placeholder="Search people, requests…"
          aria-label="Search"
        />
      </div>

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
          aria-label="Notifications"
        >
          <BellIcon />
          <span className={styles.dot} aria-hidden="true" />
        </button>

        <Avatar name={CURRENT_USER.name} size="sm" status="online" />
      </div>
    </header>
  )
}
