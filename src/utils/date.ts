import type { ClockTime, ISODate, ISODateTime } from '../types'

/** Today's date as an ISO "yyyy-mm-dd" string. */
export function todayISO(): ISODate {
  return new Date().toISOString().slice(0, 10)
}

/** Format an ISO date as e.g. "4 Jul 2026". */
export function formatDate(
  iso: ISODate | ISODateTime,
  options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' },
): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return String(iso)
  return new Intl.DateTimeFormat('en-GB', options).format(d)
}

/** Format an ISO datetime's time portion, e.g. "2:30 PM". */
export function formatTime(iso: ISODateTime): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return String(iso)
  return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(d)
}

/** Format a "HH:mm" clock string as "9:02 AM" (returns "—" for null). */
export function formatClock(time: ClockTime | null): string {
  if (!time) return '—'
  const [h, m] = time.split(':').map(Number)
  if (Number.isNaN(h) || Number.isNaN(m)) return time
  const period = h < 12 ? 'AM' : 'PM'
  const hour12 = h % 12 === 0 ? 12 : h % 12
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`
}

/** Format a start/end date pair, collapsing single-day ranges. */
export function formatDateRange(start: ISODate, end: ISODate): string {
  if (start === end) return formatDate(start)
  return `${formatDate(start, { day: 'numeric', month: 'short' })} – ${formatDate(end)}`
}

/** Whole days between two ISO dates, inclusive of both ends. */
export function daysInclusive(start: ISODate, end: ISODate): number {
  const ms = new Date(end).getTime() - new Date(start).getTime()
  if (Number.isNaN(ms)) return 0
  return Math.floor(ms / 86_400_000) + 1
}

export function isToday(iso: ISODate | ISODateTime): boolean {
  return new Date(iso).toISOString().slice(0, 10) === todayISO()
}

/** Human "time ago" string, e.g. "3 hours ago", "2 days ago". */
export function relativeTime(iso: ISODateTime, now: Date = new Date()): string {
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return String(iso)
  const diffSec = Math.round((then - now.getTime()) / 1000)
  const abs = Math.abs(diffSec)
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

  const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ['year', 31_536_000],
    ['month', 2_592_000],
    ['week', 604_800],
    ['day', 86_400],
    ['hour', 3_600],
    ['minute', 60],
  ]
  for (const [unit, secs] of units) {
    if (abs >= secs) return rtf.format(Math.round(diffSec / secs), unit)
  }
  return rtf.format(diffSec, 'second')
}
