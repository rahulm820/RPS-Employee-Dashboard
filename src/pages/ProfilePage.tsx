import { PageHeader } from '../components/layout/PageHeader'
import { useToast } from '../components/ui'
import { Card, Avatar, Input, Select, Button } from '../components/ui'
import { CURRENT_USER } from '../constants/app'
import styles from './pages.module.css'

export default function ProfilePage() {
  const { success } = useToast()

  return (
    <>
      <PageHeader
        title="Profile"
        description="Manage your personal details and preferences."
      />
      <div className={`${styles.grid} ${styles.twoCol}`}>
        <Card header={<span className={styles.sectionTitle}>Personal details</span>}>
          <form
            className={styles.stack}
            onSubmit={(e) => {
              e.preventDefault()
              success('Profile saved', 'Your changes have been updated.')
            }}
          >
            <Input label="Full name" defaultValue={CURRENT_USER.name} />
            <Input label="Email" type="email" defaultValue={CURRENT_USER.email} />
            <Input label="Role" defaultValue={CURRENT_USER.role} />
            <Select
              label="Team"
              defaultValue="platform"
              options={[
                { label: 'Platform', value: 'platform' },
                { label: 'Design', value: 'design' },
                { label: 'Growth', value: 'growth' },
                { label: 'Insights', value: 'insights' },
              ]}
            />
            <div>
              <Button type="submit" variant="accent">
                Save changes
              </Button>
            </div>
          </form>
        </Card>

        <Card header={<span className={styles.sectionTitle}>Avatar</span>}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-sm)' }}>
            <Avatar name={CURRENT_USER.name} size="xl" status="online" />
            <Button variant="secondary" size="sm">
              Upload photo
            </Button>
          </div>
        </Card>
      </div>
    </>
  )
}
