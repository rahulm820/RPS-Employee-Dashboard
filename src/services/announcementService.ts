import { request } from '../lib/api'
import { announcements, employees } from '../data'
import type { Announcement } from '../types'

export interface AnnouncementView extends Announcement {
  authorName: string
}

function decorate(list: Announcement[]): AnnouncementView[] {
  const map = new Map(employees.map((e) => [e.id, e.name]))
  return list.map((a) => ({ ...a, authorName: map.get(a.authorId) ?? 'Unknown' }))
}

/** Announcements, pinned first then newest first. */
export function listAnnouncements(signal?: AbortSignal): Promise<AnnouncementView[]> {
  return request(() => {
    const sorted = [...announcements].sort((a, b) => {
      if (!!a.pinned !== !!b.pinned) return a.pinned ? -1 : 1
      return b.createdAt.localeCompare(a.createdAt)
    })
    return decorate(sorted)
  }, { signal })
}

/** The `limit` most recent announcements (for the dashboard feed). */
export function getRecentAnnouncements(limit = 3, signal?: AbortSignal): Promise<AnnouncementView[]> {
  return request(() => {
    const sorted = [...announcements].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    return decorate(sorted.slice(0, limit))
  }, { signal })
}
