import { createBrowserRouter } from 'react-router-dom'
import { RootLayout } from '../components/layout/RootLayout'
import { ROUTES } from './paths'
// Pages are code-split (see lazyPages) so each route loads its own chunk on
// demand, keeping the initial bundle small. RootLayout renders a Suspense
// fallback while a page chunk loads.
import {
  DashboardPage,
  AttendancePage,
  LeavePage,
  DirectoryPage,
  AnnouncementsPage,
  ProfilePage,
  NotFoundPage,
} from './lazyPages'

/**
 * Route tree. Each page carries a `handle.title` that the Topbar reads via
 * `useMatches()` to render the current page name.
 */
export const router = createBrowserRouter([
  {
    path: ROUTES.dashboard,
    element: <RootLayout />,
    children: [
      { index: true, element: <DashboardPage />, handle: { title: 'Dashboard' } },
      { path: 'attendance', element: <AttendancePage />, handle: { title: 'Attendance' } },
      { path: 'leave', element: <LeavePage />, handle: { title: 'Leave' } },
      { path: 'directory', element: <DirectoryPage />, handle: { title: 'Directory' } },
      { path: 'announcements', element: <AnnouncementsPage />, handle: { title: 'Announcements' } },
      { path: 'profile', element: <ProfilePage />, handle: { title: 'Profile' } },
      { path: '*', element: <NotFoundPage />, handle: { title: 'Not found' } },
    ],
  },
])
