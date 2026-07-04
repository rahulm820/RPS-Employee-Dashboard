/** Shared primitive and envelope types. */

export type ID = string

/** ISO-8601 date string, e.g. "2026-07-04". */
export type ISODate = string

/** ISO-8601 date-time string, e.g. "2026-07-04T09:30:00Z". */
export type ISODateTime = string

/** "HH:mm" 24-hour clock time, e.g. "09:05". */
export type ClockTime = string

export interface Paginated<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}

/** Generic async view state used by data hooks. */
export interface AsyncState<T> {
  data: T | undefined
  loading: boolean
  error: Error | undefined
}
