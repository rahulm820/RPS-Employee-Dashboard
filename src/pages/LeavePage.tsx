import { useState } from 'react'
import { PageHeader } from '../components/layout/PageHeader'
import {
  Button,
  Card,
  Badge,
  Table,
  Modal,
  Select,
  DatePicker,
  Input,
  Skeleton,
  ErrorState,
  useToast,
  type Column,
} from '../components/ui'
import { useMyLeaveRequests, useLeaveBalances } from '../hooks/useLeave'
import { leaveService } from '../services'
import { toErrorMessage } from '../lib/api'
import { formatDateRange, relativeTime } from '../utils/date'
import { pluralize, titleCase } from '../utils/format'
import type { CreateLeaveInput, LeaveRequestView, LeaveStatus, LeaveType } from '../types'
import styles from './pages.module.css'

const STATUS_VARIANT: Record<LeaveStatus, 'success' | 'warning' | 'danger'> = {
  approved: 'success',
  pending: 'warning',
  rejected: 'danger',
}

const LEAVE_TYPES: { label: string; value: LeaveType }[] = [
  { label: 'Annual', value: 'annual' },
  { label: 'Sick', value: 'sick' },
  { label: 'Casual', value: 'casual' },
  { label: 'Unpaid', value: 'unpaid' },
]

const columns: Column<LeaveRequestView>[] = [
  { key: 'type', header: 'Type', render: (r) => <Badge variant="accent" size="sm">{titleCase(r.type)}</Badge> },
  { key: 'dates', header: 'Dates', render: (r) => formatDateRange(r.startDate, r.endDate) },
  { key: 'days', header: 'Days', align: 'center', render: (r) => pluralize(r.days, 'day') },
  {
    key: 'status',
    header: 'Status',
    render: (r) => <Badge variant={STATUS_VARIANT[r.status]} dot>{titleCase(r.status)}</Badge>,
  },
  { key: 'appliedAt', header: 'Applied', align: 'right', render: (r) => relativeTime(r.appliedAt) },
]

const EMPTY_FORM: CreateLeaveInput = { type: 'annual', startDate: '', endDate: '', reason: '' }

export default function LeavePage() {
  const requests = useMyLeaveRequests()
  const balances = useLeaveBalances()
  const { success, error: toastError } = useToast()

  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<CreateLeaveInput>(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)

  const canSubmit = form.startDate && form.endDate && form.reason.trim().length > 0

  async function handleSubmit() {
    if (!canSubmit) return
    setSubmitting(true)
    try {
      await leaveService.createLeaveRequest(form)
      success('Request submitted', 'Your leave request is pending approval.')
      setOpen(false)
      setForm(EMPTY_FORM)
      requests.refetch()
    } catch (err) {
      toastError('Could not submit', toErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <PageHeader
        title="Leave"
        description="Track your balance and manage leave requests."
        actions={<Button variant="accent" onClick={() => setOpen(true)}>New request</Button>}
      />

      <div className={styles.stack}>
        <div className={`${styles.grid} ${styles.stats}`}>
          {balances.loading &&
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <Skeleton width="50%" />
                <div style={{ height: 10 }} />
                <Skeleton width="35%" height="2rem" />
              </Card>
            ))}
          {balances.data?.map((b) => (
            <Card key={b.type}>
              <p className={styles.statLabel}>{titleCase(b.type)}</p>
              <p className={styles.statValue}>{b.remaining}</p>
              <p className={styles.statMeta}>
                {b.used} used of {b.total}
              </p>
            </Card>
          ))}
        </div>

        <Card padding="none" header={<span className={styles.sectionTitle}>My requests</span>}>
          {requests.error ? (
            <div style={{ padding: 'var(--space-md)' }}>
              <ErrorState description="Couldn't load your requests." onRetry={requests.refetch} />
            </div>
          ) : (
            <Table
              columns={columns}
              data={requests.data ?? []}
              rowKey={(r) => r.id}
              loading={requests.loading}
              empty={<span className={styles.feedMeta}>You haven't submitted any leave requests yet.</span>}
            />
          )}
        </Card>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="New leave request"
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="accent" loading={submitting} disabled={!canSubmit} onClick={handleSubmit}>
              Submit request
            </Button>
          </>
        }
      >
        <div className={styles.stack}>
          <Select
            label="Leave type"
            options={LEAVE_TYPES}
            value={form.type}
            onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as LeaveType }))}
          />
          <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
            <DatePicker
              label="From"
              value={form.startDate}
              onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
            />
            <DatePicker
              label="To"
              value={form.endDate}
              min={form.startDate || undefined}
              onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
            />
          </div>
          <Input
            label="Reason"
            placeholder="Briefly describe your reason"
            value={form.reason}
            onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
          />
        </div>
      </Modal>
    </>
  )
}
