import { useAsync } from './useAsync'
import { announcementService } from '../services'

export function useAnnouncements() {
  return useAsync((signal) => announcementService.listAnnouncements(signal), [])
}

export function useRecentAnnouncements(limit = 3) {
  return useAsync((signal) => announcementService.getRecentAnnouncements(limit, signal), [limit])
}
