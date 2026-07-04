import { request } from '../lib/api'
import { attendance, employees, leaves, leaveBalances } from '../data'
import type { DashboardStats } from '../types'

/** Aggregate the headline figures shown on the dashboard overview. */
export function getDashboardStats(signal?: AbortSignal): Promise<DashboardStats> {
  return request(() => {
    const latest = attendance.reduce((max, r) => (r.date > max ? r.date : max), '')
    const today = attendance.filter((r) => r.date === latest)
    const present = today.filter((r) => r.status !== 'absent').length
    const attendanceRate = today.length === 0 ? 0 : present / today.length

    const leaveRemaining = leaveBalances.reduce((sum, b) => sum + b.remaining, 0)
    const pendingRequests = leaves.filter((l) => l.status === 'pending').length

    return {
      attendanceRate,
      present,
      headcount: employees.length,
      leaveRemaining,
      pendingRequests,
    }
  }, { signal })
}
