import type { HTMLAttributes, ReactNode } from 'react'
import { cx } from './utils'
import { Button } from './Button'
import styles from './ErrorState.module.css'

export interface ErrorStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  icon?: ReactNode
  title?: ReactNode
  description?: ReactNode
  /** When provided, renders a "Try again" button that calls it. */
  onRetry?: () => void
  retryLabel?: string
  /** Custom action area, replaces the default retry button when provided. */
  action?: ReactNode
  size?: 'sm' | 'md'
}

export function ErrorState({
  icon,
  title = 'Something went wrong',
  description = 'An unexpected error occurred. Please try again.',
  onRetry,
  retryLabel = 'Try again',
  action,
  size = 'md',
  className,
  ...rest
}: ErrorStateProps) {
  return (
    <div className={cx(styles.root, styles[size], className)} role="alert" {...rest}>
      <div className={styles.icon} aria-hidden="true">
        {icon ?? (
          <svg viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="2" />
            <path
              d="M24 15v11"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
            <circle cx="24" cy="32" r="1.6" fill="currentColor" />
          </svg>
        )}
      </div>
      {title != null && <p className={styles.title}>{title}</p>}
      {description != null && <p className={styles.description}>{description}</p>}
      {action != null ? (
        <div className={styles.action}>{action}</div>
      ) : (
        onRetry && (
          <div className={styles.action}>
            <Button variant="secondary" onClick={onRetry}>
              {retryLabel}
            </Button>
          </div>
        )
      )}
    </div>
  )
}
