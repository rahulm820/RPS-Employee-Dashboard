import { useState, type HTMLAttributes } from 'react'
import { cx } from './utils'
import styles from './Avatar.module.css'

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type AvatarStatus = 'online' | 'offline' | 'busy' | 'away'

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  /** Image URL. Falls back to initials, then a placeholder icon. */
  src?: string
  /** Full name — used for the alt text and to derive initials. */
  name?: string
  size?: AvatarSize
  /** Explicit initials override (otherwise derived from `name`). */
  initials?: string
  /** Optional presence indicator dot. */
  status?: AvatarStatus
}

function deriveInitials(name?: string): string {
  if (!name) return ''
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function Avatar({
  src,
  name,
  size = 'md',
  initials,
  status,
  className,
  ...rest
}: AvatarProps) {
  const [failed, setFailed] = useState(false)
  const showImage = src && !failed
  const label = initials || deriveInitials(name)

  return (
    <span
      className={cx(styles.avatar, styles[size], className)}
      role="img"
      aria-label={name || 'Avatar'}
      {...rest}
    >
      {showImage ? (
        <img
          className={styles.img}
          src={src}
          alt={name || ''}
          onError={() => setFailed(true)}
        />
      ) : label ? (
        <span className={styles.initials}>{label}</span>
      ) : (
        <svg className={styles.placeholder} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="8.5" r="3.5" fill="currentColor" />
          <path
            d="M5 19.5c0-3.6 3.1-6 7-6s7 2.4 7 6"
            fill="currentColor"
          />
        </svg>
      )}
      {status && <span className={cx(styles.status, styles[status])} aria-hidden="true" />}
    </span>
  )
}
