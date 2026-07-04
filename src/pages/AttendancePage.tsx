import { useState } from 'react'
import { PageHeader } from '../components/layout/PageHeader'
import { Card, Badge, Avatar, Table, DatePicker, ErrorState, type Column } from '../components/ui'
import { useAttendanceByDate } from '../hooks/useAttendance'
import { formatClock, formatPercent } from '../utils'
import type { AttendanceRecordView, AttendanceStatus } from '../types'
import styles from './pages.module.css'

const STATUS_VARIANT: Record<AttendanceStatus, 'success' | 'warning' | 'accent' | 'danger'> = {
  present: 'success',
  late: 'warning',
  remote: 'accent',
  absent: 'danger',
}

const columns: Column<AttendanceRecordView>[] = [
  {
    key: 'name',
    header: 'Employee',
    render: (r) => (
      <span className={styles.cellUser}>
        <Avatar name={r.employee?.name} size="xs" />
        <span>{r.employee?.name ?? 'Unknown'}</span>
      </span>
    ),
  },
  { key: 'team', header: 'Team', render: (r) => r.employee?.team ?? '—' },
  { key: 'clockIn', header: 'Clock in', align: 'center', render: (r) => formatClock(r.clockIn) },
  { key: 'clockOut', header: 'Clock out', align: 'center', render: (r) => formatClock(r.clockOut) },
  {
    key: 'status',
    header: 'Status',
    align: 'right',
    render: (r) => (
      <Badge variant={STATUS_VARIANT[r.status]} dot>
        {r.status[0].toUpperCase() + r.status.slice(1)}
      </Badge>
    ),
  },
]

export default function AttendancePage() {
  const [date, setDate] = useState('2026-07-03')
  const { data, loading, error, refetch } = useAttendanceByDate(date)

  const summary = data?.summary

  return (
    <>
      <PageHeader
        title="Attendance"
        description="Review the daily attendance log for your team."
        actions={
          <div style={{ width: 200 }}>
            <DatePicker
              aria-label="Select date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        }
      />

      {summary && (
        <div className={`${styles.grid} ${styles.stats}`} style={{ marginBottom: 'var(--space-md)' }}>
          <Card>
            <p className={styles.statLabel}>Attendance rate</p>
            <p className={styles.statValue}>{formatPercent(summary.rate)}</p>
          </Card>
          <Card>
            <p className={styles.statLabel}>Present</p>
            <p className={styles.statValue}>{summary.present}</p>
          </Card>
          <Card>
            <p className={styles.statLabel}>Late</p>
            <p className={styles.statValue}>{summary.late}</p>
          </Card>
          <Card>
            <p className={styles.statLabel}>Absent</p>
            <p className={styles.statValue}>{summary.absent}</p>
          </Card>
        </div>
      )}

      <Card padding="none">
        {error ? (
          <div style={{ padding: 'var(--space-md)' }}>
            <ErrorState description="Couldn't load attendance." onRetry={refetch} />
          </div>
        ) : (
          <Table
            columns={columns}
            data={data?.records ?? []}
            rowKey={(r) => r.id}
            loading={loading}
            empty={
              <span className={styles.feedMeta}>No attendance records for this date.</span>
            }
            hoverable
          />
        )}
      </Card>
    </>
  )
}
