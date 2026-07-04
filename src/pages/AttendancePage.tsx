import { useState } from 'react'
import { PageHeader } from '../components/layout/PageHeader'
import { Button, useToast } from '../components/ui'
import {
  AttendanceToolbar,
  AttendanceStats,
  AttendanceCalendar,
  AttendanceTable,
} from '../components/attendance'
import { useMyMonthlyAttendance } from '../hooks/useAttendance'
import { attendanceService } from '../services'
import { monthLabel } from '../utils'
import styles from '../components/attendance/attendance.module.css'

export default function AttendancePage() {
  const { info } = useToast()
  const [{ year, month }, setMonth] = useState(() =>
    attendanceService.getDefaultAttendanceMonth(),
  )

  const { data, loading, error, refetch } = useMyMonthlyAttendance(year, month)

  function shift(delta: number) {
    setMonth(({ year: y, month: m }) => {
      const next = new Date(y, m - 1 + delta, 1)
      return { year: next.getFullYear(), month: next.getMonth() + 1 }
    })
  }

  function goToday() {
    const now = new Date()
    setMonth({ year: now.getFullYear(), month: now.getMonth() + 1 })
  }

  return (
    <>
      <PageHeader
        title="Attendance"
        description="Your monthly attendance record — statistics, calendar, and daily log."
        actions={
          <Button variant="secondary" onClick={() => info('Export started', 'Your attendance export will download shortly.')}>
            Export
          </Button>
        }
      />

      <div className={styles.bar}>
        <AttendanceToolbar
          year={year}
          month={month}
          onPrev={() => shift(-1)}
          onNext={() => shift(1)}
          onToday={goToday}
        />
      </div>

      <div className={styles.stack}>
        <AttendanceStats
          summary={data?.summary}
          loading={loading}
          error={error}
          onRetry={refetch}
        />
        <AttendanceCalendar
          year={year}
          month={month}
          records={data?.records ?? []}
          loading={loading}
        />
        <AttendanceTable
          records={data?.records ?? []}
          loading={loading}
          monthName={monthLabel(year, month)}
        />
      </div>
    </>
  )
}
