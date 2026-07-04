import { PageHeader } from '../components/layout/PageHeader'
import { Button, Card, Badge, Avatar, Table, Skeleton, ErrorState, type Column } from '../components/ui'
import { useDashboardStats } from '../hooks/useDashboardStats'
import { useDailyAttendance } from '../hooks/useAttendance'
import { useRecentAnnouncements } from '../hooks/useAnnouncements'
import { CURRENT_USER } from '../constants/app'
import { formatPercent, pluralize } from '../utils/format'
import { formatClock, formatDate, relativeTime } from '../utils/date'
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

export default function DashboardPage() {
  const stats = useDashboardStats()
  const attendance = useDailyAttendance()
  const announcements = useRecentAnnouncements(3)

  const statCards = stats.data
    ? [
        { label: 'Attendance today', value: formatPercent(stats.data.attendanceRate), meta: `${stats.data.present} of ${stats.data.headcount} present` },
        { label: 'Leave balance', value: String(stats.data.leaveRemaining), meta: 'days remaining' },
        { label: 'Pending requests', value: String(stats.data.pendingRequests), meta: 'awaiting approval' },
        { label: 'Team headcount', value: String(stats.data.headcount), meta: 'across all teams' },
      ]
    : []

  return (
    <>
      <PageHeader
        title={`Welcome back, ${CURRENT_USER.name.split(' ')[0]}`}
        description="Here's what's happening across your team today."
        actions={<Button variant="accent">Request leave</Button>}
      />

      <div className={styles.stack}>
        <div className={`${styles.grid} ${styles.stats}`}>
          {stats.loading &&
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <Skeleton width="55%" height="0.75rem" />
                <div style={{ height: 12 }} />
                <Skeleton width="40%" height="2rem" />
              </Card>
            ))}
          {stats.error && (
            <Card>
              <ErrorState size="sm" description="Couldn't load stats." onRetry={stats.refetch} />
            </Card>
          )}
          {statCards.map((s) => (
            <Card key={s.label}>
              <p className={styles.statLabel}>{s.label}</p>
              <p className={styles.statValue}>{s.value}</p>
              <p className={styles.statMeta}>{s.meta}</p>
            </Card>
          ))}
        </div>

        <div className={`${styles.grid} ${styles.twoCol}`}>
          <Card
            padding="none"
            header={
              <span className={styles.sectionTitle}>
                Attendance{attendance.data ? ` · ${formatDate(attendance.data.date)}` : ''}
              </span>
            }
          >
            {attendance.error ? (
              <div style={{ padding: 'var(--space-md)' }}>
                <ErrorState size="sm" description="Couldn't load attendance." onRetry={attendance.refetch} />
              </div>
            ) : (
              <Table
                columns={columns}
                data={attendance.data?.records ?? []}
                rowKey={(r) => r.id}
                loading={attendance.loading}
                hoverable
              />
            )}
          </Card>

          <Card header={<span className={styles.sectionTitle}>Announcements</span>}>
            {announcements.loading && <Skeleton variant="text" lines={5} />}
            {announcements.error && (
              <ErrorState size="sm" description="Couldn't load announcements." onRetry={announcements.refetch} />
            )}
            {announcements.data && (
              <div className={styles.feed}>
                {announcements.data.map((a) => (
                  <div key={a.id} className={styles.feedItem}>
                    <p className={styles.feedTitle}>{a.title}</p>
                    <p className={styles.feedBody}>{a.body}</p>
                    <span className={styles.feedMeta}>
                      {a.authorName} · {relativeTime(a.createdAt)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <p className={styles.statMeta} style={{ textAlign: 'center' }}>
          {attendance.data ? pluralize(attendance.data.records.length, 'record') : ''}
        </p>
      </div>
    </>
  )
}
