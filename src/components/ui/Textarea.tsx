import { forwardRef, useId, type TextareaHTMLAttributes, type ReactNode } from 'react'
import { cx } from './utils'
import styles from './Textarea.module.css'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: ReactNode
  hint?: ReactNode
  error?: ReactNode
  fullWidth?: boolean
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, hint, error, fullWidth = true, className, id, disabled, rows = 4, ...rest },
  ref,
) {
  const autoId = useId()
  const areaId = id ?? autoId
  const describedById = hint || error ? `${areaId}-desc` : undefined

  return (
    <div className={cx(styles.field, fullWidth && styles.fullWidth, className)}>
      {label != null && (
        <label htmlFor={areaId} className={styles.label}>
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={areaId}
        rows={rows}
        className={cx(styles.textarea, error && styles.hasError, disabled && styles.disabled)}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedById}
        {...rest}
      />
      {(hint || error) && (
        <span id={describedById} className={cx(styles.helper, error && styles.errorText)}>
          {error ?? hint}
        </span>
      )}
    </div>
  )
})
