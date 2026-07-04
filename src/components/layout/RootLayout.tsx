import { Suspense, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import styles from './RootLayout.module.css'

function PageFallback() {
  return (
    <div className={styles.loader} role="status" aria-label="Loading page">
      <span className={styles.spinner} />
    </div>
  )
}

/**
 * App shell: persistent sidebar + topbar wrapping the routed page outlet.
 * Owns the mobile drawer state; the sidebar's nav links and backdrop close it.
 */
export function RootLayout() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className={styles.shell}>
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className={styles.main}>
        <Topbar onMenuClick={() => setMenuOpen(true)} />
        <main className={styles.content}>
          <div className={styles.container}>
            <Suspense fallback={<PageFallback />}>
              <Outlet />
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  )
}
