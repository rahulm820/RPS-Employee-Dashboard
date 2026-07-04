/** Central route path registry — import these instead of hardcoding strings. */
export const ROUTES = {
  dashboard: '/',
  attendance: '/attendance',
  leave: '/leave',
  directory: '/directory',
  announcements: '/announcements',
  profile: '/profile',
} as const

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES]
