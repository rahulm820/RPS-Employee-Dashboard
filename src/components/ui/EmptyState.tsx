import type { HTMLAttributes, ReactNode } from 'react'
import { cx } from './utils'
import styles from './EmptyState.module.css'

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Custom icon/illustration. A default glyph is used when omitted. */
  icon?: ReactNode
  title: ReactNode
  description?: ReactNode
  /** Call-to-action area, typically a Button. */
  action?: ReactNode
  size?: 'sm' | 'md'
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  size = 'md',
  className,
  ...rest
}: EmptyStateProps) {
  return (
    <div className={cx(styles.root, styles[size], className)} {...rest}>
      <div className={styles.icon} aria-hidden="true">
        {icon ?? (
          <svg viewBox="0 0 48 48" fill="none">
            <rect
              x="8"
              y="12"
              width="32"
              height="26"
              rx="3"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M8 20h32M16 28h16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        )}
      </div>
      <p className={styles.title}>{title}</p>
      {description != null && <p className={styles.description}>{description}</p>}
      {action != null && <div className={styles.action}>{action}</div>}
    </div>
  )
}
