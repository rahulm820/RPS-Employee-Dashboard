import type { HTMLAttributes, ReactNode } from 'react'
import { cx } from './utils'
import styles from './Badge.module.css'

export type BadgeVariant =
  | 'neutral'
  | 'accent'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  size?: 'sm' | 'md'
  /** Render a leading status dot. */
  dot?: boolean
  leftIcon?: ReactNode
}

export function Badge({
  variant = 'neutral',
  size = 'md',
  dot = false,
  leftIcon,
  className,
  children,
  ...rest
}: BadgeProps) {
  return (
    <span
      className={cx(styles.badge, styles[variant], styles[size], className)}
      {...rest}
    >
      {dot && <span className={styles.dot} aria-hidden="true" />}
      {leftIcon && <span className={styles.icon}>{leftIcon}</span>}
      {children}
    </span>
  )
}
