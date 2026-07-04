/** App-wide constants (branding, storage keys, mock current user). */

export const APP_NAME = 'RPS Employee Dashboard'
export const APP_TAGLINE = 'Employee Dashboard'

/** localStorage key for the persisted theme choice. */
export const THEME_STORAGE_KEY = 'RPSE.theme'

/** Employee id of the signed-in user (matches an entry in data/employees.json). */
export const CURRENT_USER_ID = 'emp-1'

/** Mock signed-in user — replace with real auth/session data. */
export const CURRENT_USER = {
  id: CURRENT_USER_ID,
  name: 'Rahul Madhawani',
  role: 'Product Engineer',
  email: 'rahulmadhawani2004@gmail.com',
  avatar: '',
} as const
