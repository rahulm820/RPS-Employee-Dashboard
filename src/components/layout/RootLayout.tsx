import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import styles from './RootLayout.module.css'

/**
 * App shell: persistent sidebar + topbar wrapping the routed page outlet.
 * Manages the mobile drawer open state and closes it on navigation.
 */
export function RootLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  return (
    <div className={styles.shell}>
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className={styles.main}>
        <Topbar onMenuClick={() => setMenuOpen(true)} />
        <main className={styles.content}>
          <div className={styles.container}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
