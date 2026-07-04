import { useNavigate } from 'react-router-dom'
import { Card, Button } from '../ui'
import { LeaveIcon, AttendanceIcon, DirectoryIcon, AnnouncementsIcon } from '../icons'
import { ROUTES } from '../../routes/paths'
import styles from './dashboard.module.css'

const ACTIONS = [
  { label: 'Request leave', to: ROUTES.leave, icon: <LeaveIcon /> },
  { label: 'View attendance', to: ROUTES.attendance, icon: <AttendanceIcon /> },
  { label: 'Team directory', to: ROUTES.directory, icon: <DirectoryIcon /> },
  { label: 'Announcements', to: ROUTES.announcements, icon: <AnnouncementsIcon /> },
]

/** Quick overview: shortcut buttons to the most common tasks. */
export function QuickActions() {
  const navigate = useNavigate()

  return (
    <Card header={<span className={styles.widgetTitle}>Quick actions</span>}>
      <div className={styles.actions}>
        {ACTIONS.map((a) => (
          <Button
            key={a.to}
            variant="secondary"
            fullWidth
            leftIcon={a.icon}
            style={{ justifyContent: 'flex-start' }}
            onClick={() => navigate(a.to)}
          >
            {a.label}
          </Button>
        ))}
      </div>
    </Card>
  )
}
