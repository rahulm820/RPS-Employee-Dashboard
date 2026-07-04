import { useAsync } from './useAsync'
import { attendanceService } from '../services'

/** Latest day's attendance (records + summary). */
export function useDailyAttendance() {
  return useAsync((signal) => attendanceService.getDailyAttendance(signal), [])
}

/** Attendance for a specific date. */
export function useAttendanceByDate(date: string) {
  return useAsync((signal) => attendanceService.getAttendanceByDate(date, signal), [date])
}
