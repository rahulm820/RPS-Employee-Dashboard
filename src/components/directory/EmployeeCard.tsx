import { memo } from 'react'
import { Card, Avatar, Badge, Button } from '../ui'
import { MailIcon, MapPinIcon, PhoneIcon } from '../icons'
import { titleCase } from '../../utils'
import { CURRENT_USER } from '../../constants/app'
import type { Employee, EmployeeStatus } from '../../types'
import styles from './directory.module.css'

const STATUS_DOT: Record<EmployeeStatus, string> = {
  online: styles.stOnline,
  offline: styles.stOffline,
  busy: styles.stBusy,
  away: styles.stAway,
}

export const EmployeeCard = memo(function EmployeeCard({ employee }: { employee: Employee }) {
  const { name, role, team, email, phone, location, status } = employee

  function handleConnect() {
    const first = name.split(' ')[0]
    const subject = `Hi ${first}, let's connect`
    const body =
      `Hi ${first},\n\n` +
      `I'm ${CURRENT_USER.name}. I'd love to get to know you and learn more about ` +
      `the ${team} team — would you be open to a quick chat sometime?\n\n` +
      `Thanks,\n${CURRENT_USER.name}`
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  return (
    <Card>
      <div className={styles.head}>
        <Avatar name={name} size="lg" status={status} />
        <div className={styles.headText}>
          <span className={styles.name}>{name}</span>
          <span className={styles.role}>{role}</span>
        </div>
      </div>

      <div className={styles.meta}>
        <Badge variant="neutral" size="sm">
          {team}
        </Badge>
        <span className={styles.status}>
          <span className={`${styles.statusDot} ${STATUS_DOT[status]}`} />
          {titleCase(status)}
        </span>
      </div>

      <div className={styles.contact}>
        <div className={styles.contactItem}>
          <span className={styles.contactIcon}>
            <MailIcon />
          </span>
          <a className={styles.contactText} href={`mailto:${email}`} title={email}>
            {email}
          </a>
        </div>
        {phone && (
          <div className={styles.contactItem}>
            <span className={styles.contactIcon}>
              <PhoneIcon />
            </span>
            <span className={styles.contactText}>{phone}</span>
          </div>
        )}
        {location && (
          <div className={styles.contactItem}>
            <span className={styles.contactIcon}>
              <MapPinIcon />
            </span>
            <span className={styles.contactText}>{location}</span>
          </div>
        )}
      </div>

      <Button
        variant="accent"
        fullWidth
        leftIcon={<MailIcon />}
        onClick={handleConnect}
        className={styles.connect}
      >
        Connect
      </Button>
    </Card>
  )
})
