import { forwardRef, useId, type SelectHTMLAttributes, type ReactNode } from 'react'
import { cx } from './utils'
import styles from './Select.module.css'

export interface SelectOption {
  label: string
  value: string | number
  disabled?: boolean
}

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: ReactNode
  hint?: ReactNode
  error?: ReactNode
  fullWidth?: boolean
  /** Options to render. Alternatively pass `children` for full control. */
  options?: SelectOption[]
  /** Placeholder shown as a disabled first option when there is no value. */
  placeholder?: string
  children?: ReactNode
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  {
    label,
    hint,
    error,
    fullWidth = true,
    options,
    placeholder,
    className,
    id,
    disabled,
    children,
    ...rest
  },
  ref,
) {
  const autoId = useId()
  const selectId = id ?? autoId
  const describedById = hint || error ? `${selectId}-desc` : undefined

  return (
    <div className={cx(styles.field, fullWidth && styles.fullWidth, className)}>
      {label != null && (
        <label htmlFor={selectId} className={styles.label}>
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
        <select
          ref={ref}
          id={selectId}
          className={styles.select}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedById}
          {...rest}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>
        <span className={styles.chevron} aria-hidden="true">
          <svg viewBox="0 0 20 20" fill="none">
            <path
              d="M6 8l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
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
