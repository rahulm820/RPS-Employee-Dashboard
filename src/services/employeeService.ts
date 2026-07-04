import { request, ApiError } from '../lib/api'
import { employees } from '../data'
import type { Employee } from '../types'

/** List employees, optionally filtered by a free-text query. */
export function listEmployees(search = '', signal?: AbortSignal): Promise<Employee[]> {
  return request(() => {
    const q = search.trim().toLowerCase()
    if (!q) return employees
    return employees.filter((e) =>
      `${e.name} ${e.role} ${e.team} ${e.location ?? ''}`.toLowerCase().includes(q),
    )
  }, { signal })
}

export function getEmployee(id: string, signal?: AbortSignal): Promise<Employee> {
  return request(() => {
    const found = employees.find((e) => e.id === id)
    if (!found) throw new ApiError(`Employee ${id} not found`, 404)
    return found
  }, { signal })
}

/** Look up several employees by id (used to resolve joins). */
export function getEmployeeMap(): Map<string, Employee> {
  return new Map(employees.map((e) => [e.id, e]))
}

/** Distinct team names, alphabetically sorted (for filter dropdowns). */
export function getTeams(signal?: AbortSignal): Promise<string[]> {
  return request(() => [...new Set(employees.map((e) => e.team))].sort(), { signal })
}
