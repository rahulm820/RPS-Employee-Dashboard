import { PageHeader } from '../components/layout/PageHeader'
import { Card, Badge, Skeleton, ErrorState, EmptyState } from '../components/ui'
import { useAnnouncements } from '../hooks/useAnnouncements'
import { relativeTime } from '../utils/date'
import { titleCase } from '../utils/format'
import type { AnnouncementCategory } from '../types'
import styles from './pages.module.css'

const CATEGORY_VARIANT: Record<AnnouncementCategory, 'accent' | 'info' | 'warning' | 'neutral'> = {
  event: 'accent',
  policy: 'info',
  notice: 'warning',
  general: 'neutral',
}

export default function AnnouncementsPage() {
  const { data, loading, error, refetch } = useAnnouncements()

  return (
    <>
      <PageHeader
        title="Announcements"
        description="Company-wide updates, events, and policy changes."
      />

      {error && <ErrorState description="Couldn't load announcements." onRetry={refetch} />}

      {loading && (
        <div className={styles.stack}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <Skeleton width="30%" />
              <div style={{ height: 10 }} />
              <Skeleton variant="text" lines={2} />
            </Card>
          ))}
        </div>
      )}

      {data && data.length === 0 && (
        <Card>
          <EmptyState title="No announcements" description="There's nothing to share right now." />
        </Card>
      )}

      {data && data.length > 0 && (
        <div className={styles.stack}>
          {data.map((a) => (
            <Card key={a.id}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)', marginBottom: 6 }}>
                <Badge variant={CATEGORY_VARIANT[a.category]} size="sm">
                  {titleCase(a.category)}
                </Badge>
                {a.pinned && (
                  <Badge variant="neutral" size="sm">
                    Pinned
                  </Badge>
                )}
                <span className={styles.feedMeta}>
                  {a.authorName} · {relativeTime(a.createdAt)}
                </span>
              </div>
              <p className={styles.feedTitle}>{a.title}</p>
              <p className={styles.feedBody} style={{ marginTop: 4 }}>
                {a.body}
              </p>
            </Card>
          ))}
        </div>
      )}
    </>
  )
}
