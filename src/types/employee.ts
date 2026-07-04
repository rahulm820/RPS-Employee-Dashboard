import type { ID, ISODate } from './common'

export type EmployeeStatus = 'online' | 'offline' | 'busy' | 'away'

export interface Employee {
  id: ID
  name: string
  email: string
  role: string
  team: string
  avatar?: string
  status: EmployeeStatus
  phone?: string
  location?: string
  /** Date the employee joined. */
  joinedAt: ISODate
}
