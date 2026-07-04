import { Badge } from '../ui'
import type { LeaveStatus } from '../../types'

const MAP: Record<LeaveStatus, { variant: 'success' | 'warning' | 'danger'; label: string }> = {
  approved: { variant: 'success', label: 'Approved' },
  pending: { variant: 'warning', label: 'Pending' },
  rejected: { variant: 'danger', label: 'Rejected' },
}

/** Status badge for a leave request. */
export function LeaveStatusBadge({ status }: { status: LeaveStatus }) {
  const { variant, label } = MAP[status]
  return (
    <Badge variant={variant} dot>
      {label}
    </Badge>
  )
}
