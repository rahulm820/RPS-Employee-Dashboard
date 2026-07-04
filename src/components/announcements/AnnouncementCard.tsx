import { memo } from 'react'
import { Card, Badge } from '../ui'
import { relativeTime, titleCase } from '../../utils'
import type { AnnouncementCategory } from '../../types'
import type { AnnouncementView } from '../../services'
import styles from './announcements.module.css'

const CATEGORY_VARIANT: Record<AnnouncementCategory, 'accent' | 'info' | 'warning' | 'neutral'> = {
  event: 'accent',
  policy: 'info',
  notice: 'warning',
  general: 'neutral',
}

export const AnnouncementCard = memo(function AnnouncementCard({
  announcement,
}: {
  announcement: AnnouncementView
}) {
  const { title, body, category, authorName, createdAt, pinned } = announcement

  return (
    <Card>
      <div className={styles.cardMeta}>
        <Badge variant={CATEGORY_VARIANT[category]} size="sm">
          {titleCase(category)}
        </Badge>
        {pinned && (
          <Badge variant="neutral" size="sm">
            Pinned
          </Badge>
        )}
        <span className={styles.metaText}>
          {authorName} · {relativeTime(createdAt)}
        </span>
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.body}>{body}</p>
    </Card>
  )
})
