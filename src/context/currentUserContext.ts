import { createContext, useContext } from 'react'
import type { Employee } from '../types'

export interface CurrentUserContextValue {
  /** The signed-in user's employee record (undefined while loading/on error). */
  user: Employee | undefined
  loading: boolean
  error: Error | undefined
  /** Re-fetch the current user (call after a profile update). */
  refresh: () => void
}

export const CurrentUserContext = createContext<CurrentUserContextValue | null>(null)

export function useCurrentUser(): CurrentUserContextValue {
  const ctx = useContext(CurrentUserContext)
  if (!ctx) throw new Error('useCurrentUser must be used within a <CurrentUserProvider>')
  return ctx
}
