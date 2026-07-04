import { request } from '../lib/api'
import { leaves, leaveBalances, employees } from '../data'
import { CURRENT_USER_ID } from '../constants/app'
import { daysInclusive } from '../utils/date'
import type {
  CreateLeaveInput,
  LeaveBalance,
  LeaveRequest,
  LeaveRequestView,
} from '../types'

// In-memory mutable copy so created requests persist for the session.
let store: LeaveRequest[] = [...leaves]
let seq = store.length

function withEmployee(list: LeaveRequest[]): LeaveRequestView[] {
  const map = new Map(employees.map((e) => [e.id, e]))
  return list.map((l) => ({ ...l, employee: map.get(l.employeeId) ?? null }))
}

function sortByAppliedDesc(list: LeaveRequest[]): LeaveRequest[] {
  return [...list].sort((a, b) => b.appliedAt.localeCompare(a.appliedAt))
}

/** Leave requests for a given employee (defaults to the current user). */
export function getMyLeaveRequests(
  employeeId: string = CURRENT_USER_ID,
  signal?: AbortSignal,
): Promise<LeaveRequestView[]> {
  return request(
    () => withEmployee(sortByAppliedDesc(store.filter((l) => l.employeeId === employeeId))),
    { signal },
  )
}

/** All leave requests (e.g. an approver's queue). */
export function getAllLeaveRequests(signal?: AbortSignal): Promise<LeaveRequestView[]> {
  return request(() => withEmployee(sortByAppliedDesc(store)), { signal })
}

export function getPendingLeaveCount(signal?: AbortSignal): Promise<number> {
  return request(() => store.filter((l) => l.status === 'pending').length, { signal })
}

export function getLeaveBalances(signal?: AbortSignal): Promise<LeaveBalance[]> {
  return request(() => leaveBalances, { signal })
}

/** Create a new (pending) leave request for the current user. */
export function createLeaveRequest(
  input: CreateLeaveInput,
  signal?: AbortSignal,
): Promise<LeaveRequest> {
  return request(() => {
    const created: LeaveRequest = {
      id: `lv-${++seq}`,
      employeeId: CURRENT_USER_ID,
      type: input.type,
      startDate: input.startDate,
      endDate: input.endDate,
      days: daysInclusive(input.startDate, input.endDate),
      reason: input.reason,
      status: 'pending',
      appliedAt: new Date().toISOString(),
    }
    store = [created, ...store]
    return created
  }, { signal })
}
