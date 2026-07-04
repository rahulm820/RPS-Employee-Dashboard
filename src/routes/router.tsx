import { createBrowserRouter } from 'react-router-dom'
import { RootLayout } from '../components/layout/RootLayout'
import DashboardPage from '../pages/DashboardPage'
import AttendancePage from '../pages/AttendancePage'
import LeavePage from '../pages/LeavePage'
import DirectoryPage from '../pages/DirectoryPage'
import AnnouncementsPage from '../pages/AnnouncementsPage'
import ProfilePage from '../pages/ProfilePage'
import NotFoundPage from '../pages/NotFoundPage'
import { ROUTES } from './paths'

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
