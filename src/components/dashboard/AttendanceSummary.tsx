import { Card, Skeleton, ErrorState } from '../ui'
import { useDailyAttendance } from '../../hooks/useAttendance'
import { formatDate, formatPercent } from '../../utils'
import styles from './dashboard.module.css'

interface Segment {
  key: string
  label: string
  value: number
  seg: string
}

/** Attendance breakdown for the latest day: rate, proportion bar, legend. */
export function AttendanceSummary() {
  const { data, loading, error, refetch } = useDailyAttendance()

  const header = <span className={styles.widgetTitle}>Attendance summary</span>
  const s = data?.summary
  const total = s?.total ?? 0

  const segments: Segment[] = s
    ? [
        { key: 'present', label: 'Present', value: s.present, seg: styles.segPresent },
        { key: 'late', label: 'Late', value: s.late, seg: styles.segLate },
        { key: 'remote', label: 'Remote', value: s.remote, seg: styles.segRemote },
        { key: 'absent', label: 'Absent', value: s.absent, seg: styles.segAbsent },
      ]
    : []

  const pct = (value: number) => (total > 0 ? (value / total) * 100 : 0)

  return (
    <Card header={header}>
      {loading && <Skeleton variant="text" lines={5} />}
      {error && (
        <ErrorState size="sm" description="Couldn't load attendance." onRetry={refetch} />
      )}
      {s && (
        <>
          <div className={styles.rate}>
            <span className={styles.rateValue}>{formatPercent(s.rate)}</span>
            <span className={styles.rateLabel}>
              present · {data ? formatDate(data.date) : ''}
            </span>
          </div>

          <div
            className={styles.bar}
            role="img"
            aria-label={`Present ${s.present}, late ${s.late}, remote ${s.remote}, absent ${s.absent}`}
          >
            {segments
              .filter((seg) => seg.value > 0)
              .map((seg) => (
                <span
                  key={seg.key}
                  className={`${styles.seg} ${seg.seg}`}
                  style={{ width: `${pct(seg.value)}%` }}
                />
              ))}
          </div>

          <div className={styles.legend}>
            {segments.map((seg) => (
              <div key={seg.key} className={styles.legendItem}>
                <span className={`${styles.legendDot} ${seg.seg}`} />
                <span className={styles.legendLabel}>{seg.label}</span>
                <span className={styles.legendValue}>{seg.value}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </Card>
  )
}
