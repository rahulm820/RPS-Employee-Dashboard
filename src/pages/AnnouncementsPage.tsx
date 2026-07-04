import { PageHeader } from '../components/layout/PageHeader'
import { Card, Badge } from '../components/ui'
import styles from './pages.module.css'

const ITEMS = [
  { id: '1', title: 'Q3 town hall on Friday', body: 'Join the company all-hands at 4pm in the main hall or via the live stream. Bring your questions for the leadership Q&A.', meta: '2 hours ago', tag: 'Event', variant: 'accent' as const },
  { id: '2', title: 'Updated leave policy', body: 'The annual carry-over cap has been raised to 10 days, effective this quarter. See the handbook for details.', meta: 'Yesterday', tag: 'Policy', variant: 'info' as const },
  { id: '3', title: 'Office closed July 15', body: 'The office will be closed for the public holiday. Enjoy the long weekend!', meta: '3 days ago', tag: 'Notice', variant: 'warning' as const },
]

export default function AnnouncementsPage() {
  return (
    <>
      <PageHeader
        title="Announcements"
        description="Company-wide updates, events, and policy changes."
      />
      <div className={styles.stack}>
        {ITEMS.map((a) => (
          <Card key={a.id}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)', marginBottom: 6 }}>
              <Badge variant={a.variant} size="sm">
                {a.tag}
              </Badge>
              <span className={styles.feedMeta}>{a.meta}</span>
            </div>
            <p className={styles.feedTitle}>{a.title}</p>
            <p className={styles.feedBody} style={{ marginTop: 4 }}>
              {a.body}
            </p>
          </Card>
        ))}
      </div>
    </>
  )
}
