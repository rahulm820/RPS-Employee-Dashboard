import { PageHeader } from '../components/layout/PageHeader'
import { LeaveRequestForm, LeaveBalances, LeaveHistory } from '../components/leave'
import { useMyLeaveRequests, useLeaveBalances } from '../hooks/useLeave'
import styles from '../components/leave/leave.module.css'

export default function LeavePage() {
  const requests = useMyLeaveRequests()
  const balances = useLeaveBalances()

  function handleCreated() {
    requests.refetch()
    balances.refetch()
  }

  return (
    <>
      <PageHeader
        title="Leave"
        description="Request time off, track your balance, and review past requests."
      />

      <div className={styles.stack}>
        <div className={`${styles.grid} ${styles.wide}`}>
          <LeaveRequestForm balances={balances.data} onCreated={handleCreated} />
          <LeaveBalances
            balances={balances.data}
            loading={balances.loading}
            error={balances.error}
            onRetry={balances.refetch}
          />
        </div>

        <LeaveHistory
          requests={requests.data ?? []}
          loading={requests.loading}
          error={requests.error}
          onRetry={requests.refetch}
        />
      </div>
    </>
  )
}
