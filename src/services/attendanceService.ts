import { request } from '../lib/api'
import { attendance, personalAttendance, employees } from '../data'
import type {
  AttendanceRecord,
  AttendanceRecordView,
  AttendanceSummary,
  DailyAttendance,
  MonthlyAttendance,
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

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

/** The current user's attendance for a given month (records + summary). */
export function getMyMonthlyAttendance(
  year: number,
  month: number,
  signal?: AbortSignal,
): Promise<MonthlyAttendance> {
  return request(() => {
    const prefix = `${year}-${pad(month)}`
    const records = personalAttendance
      .filter((r) => r.date.startsWith(prefix))
      .sort((a, b) => a.date.localeCompare(b.date))
    return { year, month, records, summary: summarize(records) }
  }, { signal })
}

/**
 * The month to open the attendance view on: the most recent month that has
 * personal records (falls back to the current month). Synchronous — this is a
 * UI default, not a fetched resource.
 */
export function getDefaultAttendanceMonth(): { year: number; month: number } {
  const latest = personalAttendance.reduce((max, r) => (r.date > max ? r.date : max), '')
  if (!latest) {
    const now = new Date()
    return { year: now.getFullYear(), month: now.getMonth() + 1 }
  }
  const [y, m] = latest.split('-')
  return { year: Number(y), month: Number(m) }
}
