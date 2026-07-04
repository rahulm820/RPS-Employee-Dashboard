import { lazy } from 'react'

// Code-split page components — each becomes its own chunk, loaded on demand.
// Kept in a dedicated module so the router stays a pure config file.
export const DashboardPage = lazy(() => import('../pages/DashboardPage'))
export const AttendancePage = lazy(() => import('../pages/AttendancePage'))
export const LeavePage = lazy(() => import('../pages/LeavePage'))
export const DirectoryPage = lazy(() => import('../pages/DirectoryPage'))
export const AnnouncementsPage = lazy(() => import('../pages/AnnouncementsPage'))
export const ProfilePage = lazy(() => import('../pages/ProfilePage'))
export const NotFoundPage = lazy(() => import('../pages/NotFoundPage'))
