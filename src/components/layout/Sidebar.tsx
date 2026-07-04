import { NavLink } from 'react-router-dom'
import { cx } from '../ui/utils'
import { Avatar } from '../ui'
import { LogoIcon, CloseIcon } from '../icons'
import { NAV_ITEMS } from '../../constants/navigation'
import { APP_NAME, APP_TAGLINE, CURRENT_USER } from '../../constants/app'
import { useCurrentUser } from '../../context/currentUserContext'
import styles from './Sidebar.module.css'

export interface SidebarProps {
  /** Mobile drawer open state. */
  open: boolean
  onClose: () => void
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const { user } = useCurrentUser()
  const name = user?.name ?? CURRENT_USER.name
  const role = user?.role ?? CURRENT_USER.role

  return (
    <>
      <div
        className={cx(styles.backdrop, open && styles.backdropOpen)}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside className={cx(styles.sidebar, open && styles.open)}>
        <div className={styles.brand}>
          <span className={styles.brandMark} aria-hidden="true">
            <LogoIcon />
          </span>
          <span className={styles.brandText}>
            <span className={styles.brandName}>{APP_NAME}</span>
            <span className={styles.brandTagline}>{APP_TAGLINE}</span>
          </span>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close menu"
          >
            <CloseIcon />
          </button>
        </div>

        <nav className={styles.nav} aria-label="Primary">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) => cx(styles.link, isActive && styles.active)}
            >
              <span className={styles.linkIcon}>{item.icon}</span>
              <span className={styles.linkLabel}>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className={styles.footer}>
          <Avatar name={name} size="sm" status={user?.status ?? 'online'} />
          <span className={styles.userText}>
            <span className={styles.userName}>{name}</span>
            <span className={styles.userRole}>{role}</span>
          </span>
        </div>
      </aside>
    </>
  )
}
