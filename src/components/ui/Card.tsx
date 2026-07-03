import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cx } from './utils'
import styles from './Card.module.css'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Optional header content rendered above the body with a divider. */
  header?: ReactNode
  /** Optional footer content rendered below the body with a divider. */
  footer?: ReactNode
  /** Inner padding. Use "none" when embedding a flush element like a Table. */
  padding?: 'none' | 'sm' | 'md' | 'lg'
  /** Add hover elevation to signal the whole card is interactive. */
  interactive?: boolean
}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { header, footer, padding = 'md', interactive = false, className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cx(styles.card, interactive && styles.interactive, className)}
      {...rest}
    >
      {header != null && <div className={styles.header}>{header}</div>}
      <div className={cx(styles.body, styles[`pad_${padding}`])}>{children}</div>
      {footer != null && <div className={styles.footer}>{footer}</div>}
    </div>
  )
})
