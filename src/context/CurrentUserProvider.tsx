import { useMemo, type ReactNode } from 'react'
import { useAsync } from '../hooks/useAsync'
import { employeeService } from '../services'
import { CurrentUserContext, type CurrentUserContextValue } from './currentUserContext'

/** Loads and shares the signed-in user's employee record across the app. */
export function CurrentUserProvider({ children }: { children: ReactNode }) {
  const { data, loading, error, refetch } = useAsync(
    (signal) => employeeService.getCurrentEmployee(signal),
    [],
  )

  const value = useMemo<CurrentUserContextValue>(
    () => ({ user: data, loading, error, refresh: refetch }),
    [data, loading, error, refetch],
  )

  return <CurrentUserContext.Provider value={value}>{children}</CurrentUserContext.Provider>
}
