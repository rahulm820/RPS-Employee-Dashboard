/** App-wide constants (branding, storage keys, mock current user). */

export const APP_NAME = 'RPS Employee Dashboard'
export const APP_SHORT_NAME = 'RPSE'
export const APP_TAGLINE = 'Employee Dashboard'

/** localStorage key for the persisted theme choice. */
export const THEME_STORAGE_KEY = 'RPSE.theme'

/** Sidebar collapsed-state key (desktop). */
export const SIDEBAR_STORAGE_KEY = 'RPSE.sidebar-collapsed'

/** Mock signed-in user — replace with real auth/session data. */
export const CURRENT_USER = {
  name: 'Rahul Madhawani',
  role: 'Product Engineer',
  email: 'rahulmadhawani2004@gmail.com',
  avatar: '',
} as const
