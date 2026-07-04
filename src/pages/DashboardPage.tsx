import { PageHeader } from '../components/layout/PageHeader'
import { Button, Card, Badge, Avatar, Table, type Column } from '../components/ui'
import { CURRENT_USER } from '../constants/app'
import styles from './pages.module.css'

interface AttendanceRow {
  id: string
  name: string
  role: string
  clockIn: string
  status: 'Present' | 'Late' | 'Remote' | 'Absent'
}

const STATS = [
  { label: 'Attendance today', value: '94%', meta: '47 of 50 present' },
  { label: 'Leave balance', value: '12', meta: 'days remaining' },
  { label: 'Pending requests', value: '3', meta: 'awaiting your approval' },
  { label: 'Team headcount', value: '50', meta: '+2 this month' },
]

const STATUS_VARIANT: Record<AttendanceRow['status'], 'success' | 'warning' | 'accent' | 'danger'> = {
  Present: 'success',
  Late: 'warning',
  Remote: 'accent',
  Absent: 'danger',
}

const ROWS: AttendanceRow[] = [
  { id: '1', name: 'Aisha Verma', role: 'Designer', clockIn: '09:02', status: 'Present' },
  { id: '2', name: 'Rohan Mehta', role: 'Engineer', clockIn: '09:41', status: 'Late' },
  { id: '3', name: 'Sara Khan', role: 'PM', clockIn: '08:55', status: 'Remote' },
  { id: '4', name: 'Dev Patel', role: 'Engineer', clockIn: '—', status: 'Absent' },
  { id: '5', name: 'Neha Rao', role: 'Analyst', clockIn: '09:10', status: 'Present' },
]

const columns: Column<AttendanceRow>[] = [
  {
    key: 'name',
    header: 'Employee',
    render: (r) => (
      <span className={styles.cellUser}>
        <Avatar name={r.name} size="xs" />
        <span>{r.name}</span>
      </span>
    ),
  },
  { key: 'role', header: 'Role' },
  { key: 'clockIn', header: 'Clock in', align: 'center' },
  {
    key: 'status',
    header: 'Status',
    align: 'right',
    render: (r) => (
      <Badge variant={STATUS_VARIANT[r.status]} dot>
        {r.status}
      </Badge>
    ),
  },
]

const ANNOUNCEMENTS = [
  { id: 'a', title: 'Q3 town hall on Friday', body: 'Join the all-hands at 4pm in the main hall or via the stream.', meta: '2h ago' },
  { id: 'b', title: 'New leave policy', body: 'Carry-over cap increased to 10 days effective this quarter.', meta: 'Yesterday' },
  { id: 'c', title: 'Office closed July 15', body: 'Public holiday — enjoy the long weekend.', meta: '3 days ago' },
]

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title={`Welcome back, ${CURRENT_USER.name.split(' ')[0]}`}
        description="Here's what's happening across your team today."
        actions={<Button variant="accent">Request leave</Button>}
      />

      <div className={styles.stack}>
        <div className={`${styles.grid} ${styles.stats}`}>
          {STATS.map((s) => (
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
            header={<span className={styles.sectionTitle}>Today's attendance</span>}
          >
            <Table columns={columns} data={ROWS} rowKey={(r) => r.id} hoverable />
          </Card>

          <Card header={<span className={styles.sectionTitle}>Announcements</span>}>
            <div className={styles.feed}>
              {ANNOUNCEMENTS.map((a) => (
                <div key={a.id} className={styles.feedItem}>
                  <p className={styles.feedTitle}>{a.title}</p>
                  <p className={styles.feedBody}>{a.body}</p>
                  <span className={styles.feedMeta}>{a.meta}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </>
  )
}
