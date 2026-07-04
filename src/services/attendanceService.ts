import { request } from '../lib/api'
import { attendance, employees } from '../data'
import type {
  AttendanceRecord,
  AttendanceRecordView,
  AttendanceSummary,
  DailyAttendance,
} from '../types'

function employeeMap() {
  return new Map(employees.map((e) => [e.id, e]))
}

function withEmployees(records: AttendanceRecord[]): AttendanceRecordView[] {
  const map = employeeMap()
  return records.map((r) => ({ ...r, employee: map.get(r.employeeId) ?? null }))
}

function summarize(records: AttendanceRecord[]): AttendanceSummary {
  const present = records.filter((r) => r.status === 'present').length
  const late = records.filter((r) => r.status === 'late').length
  const remote = records.filter((r) => r.status === 'remote').length
  const absent = records.filter((r) => r.status === 'absent').length
  const total = records.length
  const rate = total === 0 ? 0 : (present + late + remote) / total
  return { total, present, late, remote, absent, rate }
}

/** The most recent day present in the dataset. */
function latestDate(): string {
  return attendance.reduce((max, r) => (r.date > max ? r.date : max), '')
}

/** Attendance for a specific date, with employees resolved and a summary. */
export function getAttendanceByDate(date: string, signal?: AbortSignal): Promise<DailyAttendance> {
  return request(() => {
    const records = attendance.filter((r) => r.date === date)
    return { date, records: withEmployees(records), summary: summarize(records) }
  }, { signal })
}

/** Attendance for the latest available day (used on the dashboard). */
export function getDailyAttendance(signal?: AbortSignal): Promise<DailyAttendance> {
  const date = latestDate()
  return getAttendanceByDate(date, signal)
}

/** Distinct dates in the dataset, newest first. */
export function getAttendanceDates(signal?: AbortSignal): Promise<string[]> {
  return request(
    () => [...new Set(attendance.map((r) => r.date))].sort((a, b) => b.localeCompare(a)),
    { signal },
  )
}
