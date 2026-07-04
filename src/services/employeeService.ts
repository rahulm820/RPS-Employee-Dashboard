import { request, ApiError } from '../lib/api'
import { employees as seed } from '../data'
import { CURRENT_USER_ID } from '../constants/app'
import type { Employee } from '../types'

// In-memory store so profile edits persist for the session and are reflected
// anywhere employees are shown (directory, attendance/leave joins, the shell).
const store: Employee[] = seed.map((e) => ({ ...e }))

/** Editable personal-detail fields. */
export type UpdateEmployeeInput = Partial<
  Pick<Employee, 'name' | 'email' | 'role' | 'team' | 'phone' | 'location' | 'status'>
>

/** List employees, optionally filtered by a free-text query. */
export function listEmployees(search = '', signal?: AbortSignal): Promise<Employee[]> {
  return request(() => {
    const q = search.trim().toLowerCase()
    if (!q) return store
    return store.filter((e) =>
      `${e.name} ${e.role} ${e.team} ${e.location ?? ''}`.toLowerCase().includes(q),
    )
  }, { signal })
}

/** Distinct team names, alphabetically sorted (for filter dropdowns). */
export function getTeams(signal?: AbortSignal): Promise<string[]> {
  return request(() => [...new Set(store.map((e) => e.team))].sort(), { signal })
}

export function getEmployeeById(id: string, signal?: AbortSignal): Promise<Employee> {
  return request(() => {
    const found = store.find((e) => e.id === id)
    if (!found) throw new ApiError(`Employee ${id} not found`, 404)
    return found
  }, { signal })
}

/** The signed-in user's employee record. */
export function getCurrentEmployee(signal?: AbortSignal): Promise<Employee> {
  return getEmployeeById(CURRENT_USER_ID, signal)
}

/** Apply a partial update to an employee and return the updated record. */
export function updateEmployee(
  id: string,
  patch: UpdateEmployeeInput,
  signal?: AbortSignal,
): Promise<Employee> {
  return request(() => {
    const index = store.findIndex((e) => e.id === id)
    if (index < 0) throw new ApiError(`Employee ${id} not found`, 404)
    store[index] = { ...store[index], ...patch }
    return store[index]
  }, { signal })
}

/** Shared id→employee map used by other services to resolve joins. */
export function getEmployeeMap(): Map<string, Employee> {
  return new Map(store.map((e) => [e.id, e]))
}
