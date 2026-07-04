import type { ReactNode } from 'react'
import { Card, Skeleton, ErrorState } from '../ui'
import { AttendanceIcon, LeaveIcon, ClockIcon, DirectoryIcon } from '../icons'
import { useDashboardStats } from '../../hooks/useDashboardStats'
import { formatPercent } from '../../utils'
import styles from './dashboard.module.css'

interface Kpi {
  label: string
  value: string
  meta: string
  icon: ReactNode
}

export function KpiCard({ label, value, meta, icon }: Kpi) {
  return (
    <Card>
      <div className={styles.kpi}>
        <div className={styles.kpiHead}>
          <p className={styles.kpiLabel}>{label}</p>
          <span className={styles.kpiIcon} aria-hidden="true">
            {icon}
          </span>
        </div>
        <p className={styles.kpiValue}>{value}</p>
        <p className={styles.kpiMeta}>{meta}</p>
      </div>
    </Card>
  )
}

/** KPI row driven by the dashboard stats service. */
export function KpiCards() {
  const { data, loading, error, refetch } = useDashboardStats()

  if (error) {
    return (
      <Card>
        <ErrorState size="sm" description="Couldn't load key metrics." onRetry={refetch} />
      </Card>
    )
  }

  if (loading || !data) {
    return (
      <div className={`${styles.grid} ${styles.kpiGrid}`}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <div className={styles.kpi}>
              <Skeleton width="55%" />
              <Skeleton width="40%" height="2rem" />
              <Skeleton width="35%" />
            </div>
          </Card>
        ))}
      </div>
    )
  }

  const kpis: Kpi[] = [
    {
      label: 'Attendance today',
      value: formatPercent(data.attendanceRate),
      meta: `${data.present} of ${data.headcount} present`,
      icon: <AttendanceIcon />,
    },
    {
      label: 'Leave balance',
      value: String(data.leaveRemaining),
      meta: 'days remaining',
      icon: <LeaveIcon />,
    },
    {
      label: 'Pending requests',
      value: String(data.pendingRequests),
      meta: 'awaiting approval',
      icon: <ClockIcon />,
    },
    {
      label: 'Team headcount',
      value: String(data.headcount),
      meta: 'across all teams',
      icon: <DirectoryIcon />,
    },
  ]

  return (
    <div className={`${styles.grid} ${styles.kpiGrid}`}>
      {kpis.map((k) => (
        <KpiCard key={k.label} {...k} />
      ))}
    </div>
  )
}
