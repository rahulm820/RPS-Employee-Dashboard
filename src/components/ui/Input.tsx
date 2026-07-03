import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react'
import { cx } from './utils'
import styles from './Input.module.css'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode
  /** Helper text shown below the field. */
  hint?: ReactNode
  /** Error message; when set, the field renders in an error state. */
  error?: ReactNode
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  fullWidth?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, leftIcon, rightIcon, fullWidth = true, className, id, disabled, ...rest },
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
        {leftIcon && <span className={styles.icon}>{leftIcon}</span>}
        <input
          ref={ref}
          id={inputId}
          className={styles.input}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedById}
          {...rest}
        />
        {rightIcon && <span className={styles.icon}>{rightIcon}</span>}
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
})
