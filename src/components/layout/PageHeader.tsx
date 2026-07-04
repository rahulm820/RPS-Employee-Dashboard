import type { ReactNode } from 'react'
import styles from './PageHeader.module.css'

export interface PageHeaderProps {
  title: ReactNode
  description?: ReactNode
  /** Right-aligned actions, typically buttons. */
  actions?: ReactNode
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className={styles.header}>
      <div className={styles.text}>
        <h2 className={styles.title}>{title}</h2>
        {description != null && <p className={styles.description}>{description}</p>}
      </div>
      {actions != null && <div className={styles.actions}>{actions}</div>}
    </div>
  )
}
