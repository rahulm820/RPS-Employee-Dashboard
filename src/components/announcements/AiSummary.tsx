import { Card, Button, Skeleton, ErrorState } from '../ui'
import { SparklesIcon } from '../icons'
import { useAnnouncementSummary } from '../../hooks/useAnnouncementSummary'
import { isAiConfigured } from '../../services'
import type { Announcement } from '../../types'
import styles from './announcements.module.css'

export interface AiSummaryProps {
  announcements: Announcement[]
  /** True while the announcements themselves are still loading. */
  sourceLoading: boolean
}

/** AI-generated digest of the current announcements (via Gemini). */
export function AiSummary({ announcements, sourceLoading }: AiSummaryProps) {
  const { data, loading, error, refetch } = useAnnouncementSummary(announcements)
  const configured = isAiConfigured()

  const header = (
    <div className={styles.aiHeader}>
      <span className={styles.aiMark} aria-hidden="true">
        <SparklesIcon />
      </span>
      <span className={styles.aiTitles}>
        <span className={styles.aiTitle}>AI summary</span>
        <span className={styles.aiSub}>Powered by Google Gemini</span>
      </span>
      <Button
        variant="secondary"
        size="sm"
        onClick={refetch}
        loading={loading}
        disabled={sourceLoading || announcements.length === 0 || !configured}
      >
        Regenerate
      </Button>
    </div>
  )

  return (
    <Card header={header}>
      {sourceLoading ? (
        <Skeleton variant="text" lines={2} />
      ) : announcements.length === 0 ? (
        <p className={styles.aiNote}>No announcements to summarize yet.</p>
      ) : loading ? (
        <>
          <div className={styles.aiLoading}>
            <span className={styles.spinner} />
            Summarizing announcements with Gemini…
          </div>
          <Skeleton variant="text" lines={2} />
        </>
      ) : error ? (
        <ErrorState
          size="sm"
          title={configured ? 'Summary failed' : 'AI not configured'}
          description={error.message}
          onRetry={configured ? refetch : undefined}
          retryLabel="Try again"
        />
      ) : (
        <p className={styles.aiBody}>{data}</p>
      )}
    </Card>
  )
}
