import type { ClockTime, ID, ISODate } from './common'
import type { Employee } from './employee'

export type AttendanceStatus = 'present' | 'late' | 'remote' | 'absent'

export interface AttendanceRecord {
  id: ID
  employeeId: ID
  date: ISODate
  clockIn: ClockTime | null
  clockOut: ClockTime | null
  status: AttendanceStatus
}

/** Attendance record with its employee resolved. */
export interface AttendanceRecordView extends AttendanceRecord {
  employee: Employee | null
}

export interface AttendanceSummary {
  total: number
  present: number
  late: number
  remote: number
  absent: number
  /** Present + late + remote as a fraction of total (0–1). */
  rate: number
}

export interface DailyAttendance {
  date: ISODate
  records: AttendanceRecordView[]
  summary: AttendanceSummary
}

export interface MonthlyAttendance {
  /** Four-digit year. */
  year: number
  /** 1–12. */
  month: number
  records: AttendanceRecord[]
  summary: AttendanceSummary
}
