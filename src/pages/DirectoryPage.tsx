import { PageHeader } from '../components/layout/PageHeader'
import { Card, Avatar, Badge, Input } from '../components/ui'
import { SearchIcon } from '../components/icons'
import styles from './pages.module.css'

const PEOPLE = [
  { name: 'Aisha Verma', role: 'Product Designer', team: 'Design' },
  { name: 'Rohan Mehta', role: 'Senior Engineer', team: 'Platform' },
  { name: 'Sara Khan', role: 'Product Manager', team: 'Growth' },
  { name: 'Dev Patel', role: 'Backend Engineer', team: 'Platform' },
  { name: 'Neha Rao', role: 'Data Analyst', team: 'Insights' },
  { name: 'Kabir Singh', role: 'QA Engineer', team: 'Platform' },
]

export default function DirectoryPage() {
  return (
    <>
      <PageHeader
        title="Team directory"
        description="Find colleagues across teams and their current status."
      />
      <div style={{ maxWidth: 340, marginBottom: 'var(--space-md)' }}>
        <Input placeholder="Search by name or team" leftIcon={<SearchIcon />} aria-label="Search directory" />
      </div>
      <div className={`${styles.grid} ${styles.people}`}>
        {PEOPLE.map((p) => (
          <Card key={p.name}>
            <div className={styles.person}>
              <Avatar name={p.name} size="lg" status="online" />
              <div className={styles.personText}>
                <span className={styles.personName}>{p.name}</span>
                <span className={styles.personRole}>{p.role}</span>
                <span style={{ marginTop: 6 }}>
                  <Badge variant="neutral" size="sm">
                    {p.team}
                  </Badge>
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  )
}
