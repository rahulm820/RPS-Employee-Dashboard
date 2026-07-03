import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react'
import { cx } from './utils'
import styles from './DatePicker.module.css'

export interface DatePickerProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: ReactNode
  hint?: ReactNode
  error?: ReactNode
  fullWidth?: boolean
}

/**
 * Thin, dependency-free wrapper over the native date input so it inherits the
 * design system's field styling. Use `min`/`max`/`value`/`onChange` as usual.
 */
export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  function DatePicker(
    { label, hint, error, fullWidth = true, className, id, disabled, ...rest },
    ref,
  ) {
    const autoId = useId()
    const inputId = id ?? autoId
    const describedById = hint || error ? `${inputId}-desc` : undefined

    return (
      <div className={cx(styles.field, fullWidth && styles.fullWidth, className)}>
        {label != null && (
          <label htmlFor={inputId} className={styles.label}>
            {label}
          </label>
        )}
        <div
          className={cx(
            styles.control,
            error && styles.hasError,
            disabled && styles.disabled,
          )}
        >
          <span className={styles.icon} aria-hidden="true">
            <svg viewBox="0 0 20 20" fill="none">
              <rect
                x="3"
                y="4"
                width="14"
                height="13"
                rx="2"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M3 8h14M7 2.5v3M13 2.5v3"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <input
            ref={ref}
            id={inputId}
            type="date"
            className={styles.input}
            disabled={disabled}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedById}
            {...rest}
          />
        </div>
        {(hint || error) && (
          <span
            id={describedById}
            className={cx(styles.helper, error && styles.errorText)}
          >
            {error ?? hint}
          </span>
        )}
      </div>
    )
  },
)
