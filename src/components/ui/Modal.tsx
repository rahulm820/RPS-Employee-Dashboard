import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { cx } from './utils'
import styles from './Modal.module.css'

export interface ModalProps {
  open: boolean
  onClose: () => void
  title?: ReactNode
  children?: ReactNode
  /** Rendered in a divided footer, typically action buttons. */
  footer?: ReactNode
  size?: 'sm' | 'md' | 'lg'
  /** Close when the backdrop is clicked. Default true. */
  closeOnBackdrop?: boolean
  /** Close when Escape is pressed. Default true. */
  closeOnEsc?: boolean
  /** Hide the default header close (×) button. */
  hideCloseButton?: boolean
  className?: string
  /** Accessible label when no visible `title` is provided. */
  ariaLabel?: string
}

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnBackdrop = true,
  closeOnEsc = true,
  hideCloseButton = false,
  className,
  ariaLabel,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open || !closeOnEsc) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, closeOnEsc, onClose])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    panelRef.current?.focus()
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  if (!open) return null

  return createPortal(
    <div
      className={styles.overlay}
      onMouseDown={(e) => {
        if (closeOnBackdrop && e.target === e.currentTarget) onClose()
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title == null ? ariaLabel : undefined}
        tabIndex={-1}
        className={cx(styles.panel, styles[size], className)}
      >
        {(title != null || !hideCloseButton) && (
          <div className={styles.header}>
            {title != null ? <h2 className={styles.title}>{title}</h2> : <span />}
            {!hideCloseButton && (
              <button
                type="button"
                className={styles.close}
                onClick={onClose}
                aria-label="Close dialog"
              >
                <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path
                    d="M5 5l10 10M15 5L5 15"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            )}
          </div>
        )}
        <div className={styles.body}>{children}</div>
        {footer != null && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>,
    document.body,
  )
}
