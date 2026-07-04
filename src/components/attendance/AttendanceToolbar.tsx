import { Button } from '../ui'
import { ChevronLeftIcon, ChevronRightIcon } from '../icons'
import { monthLabel } from '../../utils'
import styles from './attendance.module.css'

export interface AttendanceToolbarProps {
  year: number
  month: number
  onPrev: () => void
  onNext: () => void
  onToday: () => void
}

export function AttendanceToolbar({ year, month, onPrev, onNext, onToday }: AttendanceToolbarProps) {
  return (
    <div className={styles.toolbar}>
      <Button
        variant="secondary"
        size="sm"
        leftIcon={<ChevronLeftIcon />}
        aria-label="Previous month"
        onClick={onPrev}
      />
      <span className={styles.monthLabel}>{monthLabel(year, month)}</span>
      <Button
        variant="secondary"
        size="sm"
        leftIcon={<ChevronRightIcon />}
        aria-label="Next month"
        onClick={onNext}
      />
      <Button variant="ghost" size="sm" onClick={onToday}>
        Today
      </Button>
    </div>
  )
}
