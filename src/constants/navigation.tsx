import type { ReactNode } from 'react'
import { ROUTES } from '../routes/paths'
import {
  DashboardIcon,
  AttendanceIcon,
  LeaveIcon,
  DirectoryIcon,
  AnnouncementsIcon,
  ProfileIcon,
} from '../components/icons'

export interface NavItem {
  label: string
  to: string
  icon: ReactNode
  /** Match the path exactly (used for the index route). */
  end?: boolean
}

/** Primary sidebar navigation for the dashboard. */
export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', to: ROUTES.dashboard, icon: <DashboardIcon />, end: true },
  { label: 'Attendance', to: ROUTES.attendance, icon: <AttendanceIcon /> },
  { label: 'Leave', to: ROUTES.leave, icon: <LeaveIcon /> },
  { label: 'Directory', to: ROUTES.directory, icon: <DirectoryIcon /> },
  { label: 'Announcements', to: ROUTES.announcements, icon: <AnnouncementsIcon /> },
  { label: 'Profile', to: ROUTES.profile, icon: <ProfileIcon /> },
]
