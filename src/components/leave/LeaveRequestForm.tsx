import { useState } from 'react'
import { Card, Select, DatePicker, Textarea, Button, useToast } from '../ui'
import { leaveService } from '../../services'
import { toErrorMessage } from '../../lib/api'
import { daysInclusive, pluralize, titleCase } from '../../utils'
import type { CreateLeaveInput, LeaveBalance, LeaveType } from '../../types'
import styles from './leave.module.css'

const LEAVE_TYPES: { label: string; value: LeaveType }[] = [
  { label: 'Annual', value: 'annual' },
  { label: 'Sick', value: 'sick' },
  { label: 'Casual', value: 'casual' },
  { label: 'Unpaid', value: 'unpaid' },
]

const EMPTY: CreateLeaveInput = { type: 'annual', startDate: '', endDate: '', reason: '' }
const MIN_REASON = 5

type Errors = Partial<Record<keyof CreateLeaveInput, string>>

export interface LeaveRequestFormProps {
  balances: LeaveBalance[] | undefined
  /** Called after a request is successfully created. */
  onCreated: () => void
}

function validate(form: CreateLeaveInput, balances: LeaveBalance[] | undefined): Errors {
  const errors: Errors = {}

  if (!form.startDate) errors.startDate = 'Start date is required'
  if (!form.endDate) errors.endDate = 'End date is required'
  if (form.startDate && form.endDate && form.endDate < form.startDate) {
    errors.endDate = 'End date cannot be before the start date'
  }

  const reason = form.reason.trim()
  if (!reason) errors.reason = 'Please provide a reason'
  else if (reason.length < MIN_REASON) errors.reason = `Reason must be at least ${MIN_REASON} characters`

  // Balance check (unpaid leave has no allowance, so it is exempt).
  const balance = balances?.find((b) => b.type === form.type)
  if (balance && balance.total > 0 && form.startDate && form.endDate && form.endDate >= form.startDate) {
    const days = daysInclusive(form.startDate, form.endDate)
    if (days > balance.remaining) {
      errors.type = `Only ${pluralize(balance.remaining, 'day')} of ${titleCase(form.type)} leave remaining`
    }
  }

  return errors
}

/** Leave request form with field-level validation. */
export function LeaveRequestForm({ balances, onCreated }: LeaveRequestFormProps) {
  const { success, error: toastError } = useToast()
  const [form, setForm] = useState<CreateLeaveInput>(EMPTY)
  const [errors, setErrors] = useState<Errors>({})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  function update<K extends keyof CreateLeaveInput>(key: K, value: CreateLeaveInput[K]) {
    const next = { ...form, [key]: value }
    setForm(next)
    if (submitted) setErrors(validate(next, balances))
  }

  const hasRange = Boolean(form.startDate && form.endDate && form.endDate >= form.startDate)
  const days = hasRange ? daysInclusive(form.startDate, form.endDate) : 0
  const remaining = balances?.find((b) => b.type === form.type)?.remaining

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
    const found = validate(form, balances)
    setErrors(found)
    if (Object.keys(found).length > 0) return

    setSubmitting(true)
    try {
      await leaveService.createLeaveRequest(form)
      success('Request submitted', 'Your leave request is pending approval.')
      setForm(EMPTY)
      setErrors({})
      setSubmitted(false)
      onCreated()
    } catch (err) {
      toastError('Could not submit', toErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card header={<span className={styles.widgetTitle}>New leave request</span>}>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <Select
          label="Leave type"
          options={LEAVE_TYPES}
          value={form.type}
          error={errors.type}
          onChange={(e) => update('type', e.target.value as LeaveType)}
        />

        <div className={styles.dates}>
          <DatePicker
            label="From"
            value={form.startDate}
            error={errors.startDate}
            onChange={(e) => update('startDate', e.target.value)}
          />
          <DatePicker
            label="To"
            value={form.endDate}
            min={form.startDate || undefined}
            error={errors.endDate}
            onChange={(e) => update('endDate', e.target.value)}
          />
        </div>

        <Textarea
          label="Reason"
          placeholder="Briefly describe your reason for leave"
          value={form.reason}
          error={errors.reason}
          onChange={(e) => update('reason', e.target.value)}
        />

        {hasRange && (
          <div className={styles.hint}>
            <span>
              <span className={styles.hintDays}>{pluralize(days, 'day')}</span> requested
            </span>
            {remaining != null && <span>{pluralize(remaining, 'day')} available</span>}
          </div>
        )}

        <div className={styles.formActions}>
          <Button type="submit" variant="accent" loading={submitting}>
            Submit request
          </Button>
        </div>
      </form>
    </Card>
  )
}
