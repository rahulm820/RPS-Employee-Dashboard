/** Aggregated figures shown on the dashboard overview. */
export interface DashboardStats {
  /** Attendance rate for the latest day (0–1). */
  attendanceRate: number
  present: number
  headcount: number
  /** Current user's remaining leave across all types. */
  leaveRemaining: number
  /** Leave requests awaiting approval. */
  pendingRequests: number
}
