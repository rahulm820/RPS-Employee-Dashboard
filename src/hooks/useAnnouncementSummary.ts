import { useAsync } from './useAsync'
import { aiService } from '../services'
import type { Announcement } from '../types'

/**
 * Generate an AI summary for the given announcements. Re-runs when the set of
 * announcements changes; call `refetch` to regenerate on demand.
 */
export function useAnnouncementSummary(items: Announcement[]) {
  const signature = items.map((a) => a.id).join(',')
  return useAsync((signal) => aiService.summarizeAnnouncements(items, signal), [signature])
}
