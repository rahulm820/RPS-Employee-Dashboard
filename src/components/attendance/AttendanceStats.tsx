import { Card, Skeleton, ErrorState } from '../ui'
import { formatPercent } from '../../utils'
import type { AttendanceSummary } from '../../types'
import styles from './attendance.module.css'

export interface AttendanceStatsProps {
  summary: AttendanceSummary | undefined
  loading: boolean
  error?: Error
  onRetry?: () => void
}

/** Monthly attendance statistics as a row of stat cards. */
export function AttendanceStats({ summary, loading, error, onRetry }: AttendanceStatsProps) {
  if (error) {
    return (
      <Card>
        <ErrorState size="sm" description="Couldn't load statistics." onRetry={onRetry} />
      </Card>
    )
  }

  if (loading || !summary) {
    return (
      <div className={styles.statsGrid}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i}>
            <Skeleton width="60%" />
            <div style={{ height: 10 }} />
            <Skeleton width="40%" height="2rem" />
          </Card>
        ))}
      </div>
    )
  }

  const cards = [
    { label: 'Attendance rate', value: formatPercent(summary.rate) },
    { label: 'Present', value: String(summary.present) },
    { label: 'Late', value: String(summary.late) },
    { label: 'Remote', value: String(summary.remote) },
    { label: 'Absent', value: String(summary.absent) },
  ]

  return (
    <div className={styles.statsGrid}>
      {cards.map((c) => (
        <Card key={c.label}>
          <p className={styles.statLabel}>{c.label}</p>
          <p className={styles.statValue}>{c.value}</p>
        </Card>
      ))}
    </div>
  )
}
