import { Link } from 'react-router-dom'
import { Card, Skeleton, ErrorState, EmptyState } from '../ui'
import { useRecentAnnouncements } from '../../hooks/useAnnouncements'
import { ROUTES } from '../../routes/paths'
import { relativeTime } from '../../utils'
import styles from './dashboard.module.css'

/** Quick overview: the latest announcements with a link to the full feed. */
export function AnnouncementsWidget({ limit = 3 }: { limit?: number }) {
  const { data, loading, error, refetch } = useRecentAnnouncements(limit)

  const header = (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 'var(--space-sm)' }}>
      <span className={styles.widgetTitle}>Announcements</span>
      <Link to={ROUTES.announcements} className={styles.feedMeta}>
        View all
      </Link>
    </div>
  )

  return (
    <Card header={header}>
      {loading && <Skeleton variant="text" lines={5} />}
      {error && (
        <ErrorState size="sm" description="Couldn't load announcements." onRetry={refetch} />
      )}
      {data && data.length === 0 && (
        <EmptyState size="sm" title="No announcements" description="Nothing to share right now." />
      )}
      {data && data.length > 0 && (
        <div className={styles.feed}>
          {data.map((a) => (
            <div key={a.id} className={styles.feedItem}>
              <p className={styles.feedTitle}>{a.title}</p>
              <p className={styles.feedBody}>{a.body}</p>
              <span className={styles.feedMeta}>
                {a.authorName} · {relativeTime(a.createdAt)}
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
