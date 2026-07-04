import { createContext, useContext, type ReactNode } from 'react'

export type ToastVariant = 'info' | 'success' | 'warning' | 'danger'
export type ToastPosition =
  | 'top-right'
  | 'top-left'
  | 'top-center'
  | 'bottom-right'
  | 'bottom-left'
  | 'bottom-center'

export interface ToastOptions {
  title?: ReactNode
  description?: ReactNode
  variant?: ToastVariant
  /** Auto-dismiss delay in ms. Use 0 to keep it until dismissed. Default 4000. */
  duration?: number
}

export interface ToastContextValue {
  /** Show a toast, returns its id. */
  toast: (opts: ToastOptions) => number
  dismiss: (id: number) => void
  /** Convenience helpers. */
  success: (title: ReactNode, description?: ReactNode) => number
  error: (title: ReactNode, description?: ReactNode) => number
  info: (title: ReactNode, description?: ReactNode) => number
  warning: (title: ReactNode, description?: ReactNode) => number
}

export const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within a <ToastProvider>')
  return ctx
}
