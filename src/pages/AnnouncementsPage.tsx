import { PageHeader } from '../components/layout/PageHeader'
import { Card, Skeleton, ErrorState, EmptyState } from '../components/ui'
import { AiSummary, AnnouncementCard } from '../components/announcements'
import { useAnnouncements } from '../hooks/useAnnouncements'
import styles from '../components/announcements/announcements.module.css'

export default function AnnouncementsPage() {
  const { data, loading, error, refetch } = useAnnouncements()

  return (
    <>
      <PageHeader
        title="Announcements"
        description="Company-wide updates, events, and policy changes."
      />

      <div className={styles.stack}>
        <AiSummary announcements={data ?? []} sourceLoading={loading} />

        {error && <ErrorState description="Couldn't load announcements." onRetry={refetch} />}

        {loading &&
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <Skeleton width="30%" />
              <div style={{ height: 10 }} />
              <Skeleton variant="text" lines={2} />
            </Card>
          ))}

        {data && data.length === 0 && (
          <Card>
            <EmptyState title="No announcements" description="There's nothing to share right now." />
          </Card>
        )}

        {data?.map((a) => (
          <AnnouncementCard key={a.id} announcement={a} />
        ))}
      </div>
    </>
  )
}
