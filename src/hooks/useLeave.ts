import { useAsync } from './useAsync'
import { leaveService } from '../services'

/** Current user's leave requests. */
export function useMyLeaveRequests() {
  return useAsync((signal) => leaveService.getMyLeaveRequests(undefined, signal), [])
}

export function useLeaveBalances() {
  return useAsync((signal) => leaveService.getLeaveBalances(signal), [])
}
