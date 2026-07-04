/**
 * Typed access to the raw mock JSON. The `as unknown as` casts are needed
 * because JSON imports widen string-literal unions (e.g. status) to `string`.
 * This is the single place those casts live — everything else is fully typed.
 */
import employeesJson from './employees.json'
import attendanceJson from './attendance.json'
import leavesJson from './leaves.json'
import leaveBalancesJson from './leave-balances.json'
import announcementsJson from './announcements.json'
import type {
  Employee,
  AttendanceRecord,
  LeaveRequest,
  LeaveBalance,
  Announcement,
} from '../types'

export const employees = employeesJson as unknown as Employee[]
export const attendance = attendanceJson as unknown as AttendanceRecord[]
export const leaves = leavesJson as unknown as LeaveRequest[]
export const leaveBalances = leaveBalancesJson as unknown as LeaveBalance[]
export const announcements = announcementsJson as unknown as Announcement[]
