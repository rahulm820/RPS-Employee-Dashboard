import { useState } from 'react'
import { Card, Badge, Select, Table, EmptyState, ErrorState, type Column } from '../ui'
import { LeaveStatusBadge } from './LeaveStatusBadge'
import { formatDateRange, relativeTime, pluralize, titleCase } from '../../utils'
import type { LeaveRequestView, LeaveStatus } from '../../types'
import styles from './leave.module.css'

type Filter = 'all' | LeaveStatus

export interface LeaveHistoryProps {
  requests: LeaveRequestView[]
  loading: boolean
  error?: Error
  onRetry?: () => void
}

const FILTERS: { label: string; value: Filter }[] = [
  { label: 'All statuses', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
]

const columns: Column<LeaveRequestView>[] = [
  { key: 'type', header: 'Type', render: (r) => <Badge variant="accent" size="sm">{titleCase(r.type)}</Badge> },
  { key: 'dates', header: 'Dates', render: (r) => formatDateRange(r.startDate, r.endDate) },
  { key: 'days', header: 'Days', align: 'center', render: (r) => pluralize(r.days, 'day') },
  { key: 'reason', header: 'Reason', render: (r) => <span className={styles.reason} title={r.reason}>{r.reason}</span> },
  { key: 'status', header: 'Status', render: (r) => <LeaveStatusBadge status={r.status} /> },
  { key: 'appliedAt', header: 'Applied', align: 'right', render: (r) => relativeTime(r.appliedAt) },
]

/** Leave history table with a status filter. */
export function LeaveHistory({ requests, loading, error, onRetry }: LeaveHistoryProps) {
  const [filter, setFilter] = useState<Filter>('all')
  const rows = filter === 'all' ? requests : requests.filter((r) => r.status === filter)

  const header = (
    <div className={styles.historyHeader}>
      <span className={styles.widgetTitle}>Leave history</span>
      <div className={styles.filter}>
        <Select
          aria-label="Filter by status"
          options={FILTERS}
          value={filter}
          onChange={(e) => setFilter(e.target.value as Filter)}
        />
      </div>
    </div>
  )

  return (
    <Card padding="none" header={header}>
      {error ? (
        <div style={{ padding: 'var(--space-md)' }}>
          <ErrorState description="Couldn't load your leave history." onRetry={onRetry} />
        </div>
      ) : (
        <Table
          columns={columns}
          data={rows}
          rowKey={(r) => r.id}
          loading={loading}
          empty={
            <EmptyState
              size="sm"
              title="No requests"
              description={
                filter === 'all'
                  ? "You haven't submitted any leave requests yet."
                  : `No ${filter} requests.`
              }
            />
          }
        />
      )}
    </Card>
  )
}
