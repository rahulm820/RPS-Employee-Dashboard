import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../components/layout/PageHeader'
import { Button } from '../components/ui'
import {
  KpiCards,
  AttendanceSummary,
  LeaveSummary,
  AnnouncementsWidget,
  QuickActions,
} from '../components/dashboard'
import { ROUTES } from '../routes/paths'
import { CURRENT_USER } from '../constants/app'
import styles from '../components/dashboard/dashboard.module.css'

export default function DashboardPage() {
  const navigate = useNavigate()

  return (
    <>
      <PageHeader
        title={`Welcome back, ${CURRENT_USER.name.split(' ')[0]}`}
        description="Here's what's happening across your team today."
        actions={
          <Button variant="accent" onClick={() => navigate(ROUTES.leave)}>
            Request leave
          </Button>
        }
      />

      <div className={styles.stack}>
        <KpiCards />

        <div className={`${styles.grid} ${styles.duo}`}>
          <AttendanceSummary />
          <LeaveSummary />
        </div>

        <div className={`${styles.grid} ${styles.wide}`}>
          <AnnouncementsWidget limit={3} />
          <QuickActions />
        </div>
      </div>
    </>
  )
}
