import { Card, Badge, Table, EmptyState, type Column } from '../ui'
import { formatClock, formatDate, workedHours } from '../../utils'
import type { AttendanceRecord, AttendanceStatus } from '../../types'
import styles from './attendance.module.css'

export interface AttendanceTableProps {
  records: AttendanceRecord[]
  loading: boolean
  /** Month name used in the empty-state copy. */
  monthName: string
}

const STATUS_VARIANT: Record<AttendanceStatus, 'success' | 'warning' | 'accent' | 'danger'> = {
  present: 'success',
  late: 'warning',
  remote: 'accent',
  absent: 'danger',
}

const columns: Column<AttendanceRecord>[] = [
  {
    key: 'date',
    header: 'Date',
    render: (r) => formatDate(r.date, { weekday: 'short', day: 'numeric', month: 'short' }),
  },
  { key: 'clockIn', header: 'Clock in', align: 'center', render: (r) => formatClock(r.clockIn) },
  { key: 'clockOut', header: 'Clock out', align: 'center', render: (r) => formatClock(r.clockOut) },
  { key: 'hours', header: 'Hours', align: 'center', render: (r) => workedHours(r.clockIn, r.clockOut) },
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

/** Daily attendance log for the selected month. */
export function AttendanceTable({ records, loading, monthName }: AttendanceTableProps) {
  return (
    <Card padding="none" header={<span className={styles.widgetTitle}>Daily log</span>}>
      <Table
        columns={columns}
        data={records}
        rowKey={(r) => r.id}
        loading={loading}
        empty={
          <EmptyState
            size="sm"
            title="No attendance logged"
            description={`There are no attendance records for ${monthName}.`}
          />
        }
      />
    </Card>
  )
}
