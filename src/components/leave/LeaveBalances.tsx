import { Card, Skeleton, ErrorState } from '../ui'
import { titleCase } from '../../utils'
import type { LeaveBalance } from '../../types'
import styles from './leave.module.css'

export interface LeaveBalancesProps {
  balances: LeaveBalance[] | undefined
  loading: boolean
  error?: Error
  onRetry?: () => void
}

/** Leave balance summary with per-type usage bars. */
export function LeaveBalances({ balances, loading, error, onRetry }: LeaveBalancesProps) {
  const totalRemaining = balances?.reduce((sum, b) => sum + b.remaining, 0) ?? 0

  const header = (
    <div className={styles.balHeader}>
      <span className={styles.widgetTitle}>Leave summary</span>
      {balances && <span className={styles.balTotal}>{totalRemaining} days left</span>}
    </div>
  )

  return (
    <Card header={header}>
      {error && <ErrorState size="sm" description="Couldn't load balances." onRetry={onRetry} />}
      {loading && <Skeleton variant="text" lines={6} />}
      {balances && (
        <div className={styles.balList}>
          {balances.map((b) => {
            const usedPct = b.total > 0 ? (b.used / b.total) * 100 : 0
            return (
              <div key={b.type} className={styles.balRow}>
                <div className={styles.balHead}>
                  <span className={styles.balName}>{titleCase(b.type)}</span>
                  <span className={styles.balRemain}>
                    {b.total > 0 ? `${b.remaining} left` : 'No allowance'}
                  </span>
                </div>
                <div className={styles.track}>
                  <span className={styles.fill} style={{ width: `${usedPct}%` }} />
                </div>
                <span className={styles.balMeta}>
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
