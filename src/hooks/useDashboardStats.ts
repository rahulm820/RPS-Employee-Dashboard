import { useAsync } from './useAsync'
import { dashboardService } from '../services'

export function useDashboardStats() {
  return useAsync((signal) => dashboardService.getDashboardStats(signal), [])
}
