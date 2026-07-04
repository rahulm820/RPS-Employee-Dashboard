import type { ID, ISODate, ISODateTime } from './common'
import type { Employee } from './employee'

export type LeaveType = 'annual' | 'sick' | 'casual' | 'unpaid'
export type LeaveStatus = 'pending' | 'approved' | 'rejected'

export interface LeaveRequest {
  id: ID
  employeeId: ID
  type: LeaveType
  startDate: ISODate
  endDate: ISODate
  /** Number of working days requested. */
  days: number
  reason: string
  status: LeaveStatus
  appliedAt: ISODateTime
}

export interface LeaveRequestView extends LeaveRequest {
  employee: Employee | null
}

export interface LeaveBalance {
  type: LeaveType
  total: number
  used: number
  remaining: number
}

/** Payload for creating a new leave request. */
export interface CreateLeaveInput {
  type: LeaveType
  startDate: ISODate
  endDate: ISODate
  reason: string
}
