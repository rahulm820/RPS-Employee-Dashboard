import { Card, Skeleton, ErrorState } from '../ui'
import { useLeaveBalances } from '../../hooks/useLeave'
import { titleCase } from '../../utils'
import styles from './dashboard.module.css'

/** Leave balance breakdown by type, with used/total progress bars. */
export function LeaveSummary() {
  const { data, loading, error, refetch } = useLeaveBalances()

  const totalRemaining = data?.reduce((sum, b) => sum + b.remaining, 0) ?? 0
  const header = (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 'var(--space-sm)' }}>
      <span className={styles.widgetTitle}>Leave summary</span>
      {data && (
        <span className={styles.leaveRemain}>{totalRemaining} days left</span>
      )}
    </div>
  )

  return (
    <Card header={header}>
      {loading && <Skeleton variant="text" lines={6} />}
      {error && (
        <ErrorState size="sm" description="Couldn't load leave balances." onRetry={refetch} />
      )}
      {data && (
        <div className={styles.leaveList}>
          {data.map((b) => {
            const usedPct = b.total > 0 ? (b.used / b.total) * 100 : 0
            return (
              <div key={b.type} className={styles.leaveRow}>
                <div className={styles.leaveHead}>
                  <span className={styles.leaveName}>{titleCase(b.type)}</span>
                  <span className={styles.leaveRemain}>
                    {b.total > 0 ? `${b.remaining} left` : 'No allowance'}
                  </span>
                </div>
                <div className={styles.track}>
                  <span className={styles.fill} style={{ width: `${usedPct}%` }} />
                </div>
                <span className={styles.leaveMeta}>
                  {b.used} used of {b.total}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </Card>
  )
}
