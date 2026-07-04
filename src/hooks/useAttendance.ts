import { useAsync } from './useAsync'
import { attendanceService } from '../services'

/** Latest day's attendance (records + summary). */
export function useDailyAttendance() {
  return useAsync((signal) => attendanceService.getDailyAttendance(signal), [])
}

/** The current user's attendance for a given month. */
export function useMyMonthlyAttendance(year: number, month: number) {
  return useAsync(
    (signal) => attendanceService.getMyMonthlyAttendance(year, month, signal),
    [year, month],
  )
}
