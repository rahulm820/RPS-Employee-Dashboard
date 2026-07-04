import { useAsync } from './useAsync'
import { useDebounce } from './useDebounce'
import { employeeService } from '../services'

/** Directory list, debounced by the search query. */
export function useEmployees(search = '') {
  const debounced = useDebounce(search, 300)
  return useAsync((signal) => employeeService.listEmployees(debounced, signal), [debounced])
}

/** Distinct team names for filter dropdowns. */
export function useTeams() {
  return useAsync((signal) => employeeService.getTeams(signal), [])
}
