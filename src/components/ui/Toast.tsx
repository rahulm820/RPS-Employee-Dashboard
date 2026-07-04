import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { cx } from './utils'
import {
  ToastContext,
  type ToastContextValue,
  type ToastOptions,
  type ToastPosition,
  type ToastVariant,
} from './toastContext'
import styles from './Toast.module.css'

interface ToastItem extends ToastOptions {
  id: number
}

export interface ToastProviderProps {
  children: ReactNode
  position?: ToastPosition
  /** Maximum number of toasts shown at once (oldest are dropped). */
  max?: number
}

export function ToastProvider({
  children,
  position = 'bottom-right',
  max = 4,
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const idRef = useRef(0)

  const dismiss = useCallback((id: number) => {
    setToasts((list) => list.filter((t) => t.id !== id))
  }, [])

  const toast = useCallback(
    (opts: ToastOptions) => {
      const id = ++idRef.current
      setToasts((list) => {
        const next = [...list, { id, variant: 'info' as ToastVariant, duration: 4000, ...opts }]
        return next.slice(-max)
      })
      return id
    },
    [max],
  )

  const helper = useCallback(
    (variant: ToastVariant) => (title: ReactNode, description?: ReactNode) =>
      toast({ variant, title, description }),
    [toast],
  )

  const value: ToastContextValue = {
    toast,
    dismiss,
    success: helper('success'),
    error: helper('danger'),
    info: helper('info'),
    warning: helper('warning'),
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
      {createPortal(
        <div className={cx(styles.viewport, styles[position])} role="region" aria-label="Notifications">
          {toasts.map((t) => (
            <ToastCard key={t.id} item={t} onDismiss={dismiss} />
          ))}
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  )
}

const ICONS: Record<ToastVariant, ReactNode> = {
  success: (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M5 10.5l3.5 3.5L15 6.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  danger: (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  warning: (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M10 3l8 14H2L10 3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M10 8v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="10" cy="14.5" r="1" fill="currentColor" />
    </svg>
  ),
  info: (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10 9v4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="10" cy="6.2" r="1" fill="currentColor" />
    </svg>
  ),
}

function ToastCard({ item, onDismiss }: { item: ToastItem; onDismiss: (id: number) => void }) {
  const { id, variant = 'info', duration = 4000, title, description } = item

  useEffect(() => {
    if (!duration) return
    const timer = setTimeout(() => onDismiss(id), duration)
    return () => clearTimeout(timer)
  }, [id, duration, onDismiss])

  return (
    <div className={cx(styles.toast, styles[variant])} role="status">
      <span className={styles.icon}>{ICONS[variant]}</span>
      <div className={styles.content}>
        {title != null && <p className={styles.title}>{title}</p>}
        {description != null && <p className={styles.description}>{description}</p>}
      </div>
      <button
        type="button"
        className={styles.close}
        onClick={() => onDismiss(id)}
        aria-label="Dismiss notification"
      >
        <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  )
}
