import { Card, Skeleton } from '../ui'
import { todayISO } from '../../utils'
import type { AttendanceRecord, AttendanceStatus } from '../../types'
import styles from './attendance.module.css'

export interface AttendanceCalendarProps {
  year: number
  month: number
  records: AttendanceRecord[]
  loading: boolean
}

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const DOT_CLASS: Record<AttendanceStatus, string> = {
  present: styles.dotPresent,
  late: styles.dotLate,
  remote: styles.dotRemote,
  absent: styles.dotAbsent,
}

const LEGEND: { label: string; status: AttendanceStatus }[] = [
  { label: 'Present', status: 'present' },
  { label: 'Late', status: 'late' },
  { label: 'Remote', status: 'remote' },
  { label: 'Absent', status: 'absent' },
]

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

export function AttendanceCalendar({ year, month, records, loading }: AttendanceCalendarProps) {
  const header = <span className={styles.widgetTitle}>Calendar</span>

  if (loading) {
    return (
      <Card header={header}>
        <Skeleton variant="rect" width="100%" height="18rem" />
      </Card>
    )
  }

  const statusByDay = new Map<number, AttendanceStatus>()
  for (const r of records) {
    const day = Number(r.date.slice(8, 10))
    if (!Number.isNaN(day)) statusByDay.set(day, r.status)
  }

  const daysInMonth = new Date(year, month, 0).getDate()
  // Monday-first index for the 1st of the month (getDay: 0=Sun..6=Sat).
  const leadingBlanks = (new Date(year, month - 1, 1).getDay() + 6) % 7
  const today = todayISO()

  const cells: Array<{ day: number } | null> = [
    ...Array.from({ length: leadingBlanks }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => ({ day: i + 1 })),
  ]

  return (
    <Card header={header}>
      <div className={styles.weekdays}>
        {WEEKDAYS.map((w) => (
          <span key={w} className={styles.weekday}>
            {w}
          </span>
        ))}
      </div>

      <div className={styles.days}>
        {cells.map((cell, i) => {
          if (!cell) return <span key={`b${i}`} className={`${styles.cell} ${styles.cellBlank}`} />

          const dateStr = `${year}-${pad(month)}-${pad(cell.day)}`
          const weekday = (leadingBlanks + cell.day - 1) % 7
          const isWeekend = weekday >= 5
          const status = statusByDay.get(cell.day)

          return (
            <span
              key={dateStr}
              className={[
                styles.cell,
                isWeekend ? styles.cellWeekend : '',
                dateStr === today ? styles.cellToday : '',
              ]
                .filter(Boolean)
                .join(' ')}
              title={status ? `${cell.day}: ${status}` : undefined}
            >
              <span className={styles.dayNum}>{cell.day}</span>
              {status ? (
                <span className={`${styles.dot} ${DOT_CLASS[status]}`} />
              ) : (
                <span className={styles.dotSpacer} />
              )}
            </span>
          )
        })}
      </div>

      <div className={styles.legend}>
        {LEGEND.map((l) => (
          <span key={l.status} className={styles.legendItem}>
            <span className={`${styles.dot} ${DOT_CLASS[l.status]}`} />
            {l.label}
          </span>
        ))}
      </div>
    </Card>
  )
}
