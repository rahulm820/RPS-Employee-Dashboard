import type { ID, ISODateTime } from './common'

export type AnnouncementCategory = 'event' | 'policy' | 'notice' | 'general'

export interface Announcement {
  id: ID
  title: string
  body: string
  category: AnnouncementCategory
  authorId: ID
  createdAt: ISODateTime
  pinned?: boolean
}
