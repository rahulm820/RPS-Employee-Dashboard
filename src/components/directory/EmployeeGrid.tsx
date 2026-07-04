import type { ReactNode } from 'react'
import { Card, Avatar, Skeleton, EmptyState, ErrorState } from '../ui'
import { EmployeeCard } from './EmployeeCard'
import type { Employee } from '../../types'
import styles from './directory.module.css'

export interface EmployeeGridProps {
  employees: Employee[]
  loading: boolean
  error?: Error
  onRetry?: () => void
  /** Empty-state description (varies with active search/filters). */
  emptyDescription?: ReactNode
}

function SkeletonCard() {
  return (
    <Card>
      <div className={styles.head}>
        <Skeleton variant="circle" width="3.5rem" height="3.5rem" />
        <div style={{ flex: 1 }}>
          <Skeleton width="70%" />
          <div style={{ height: 8 }} />
          <Skeleton width="45%" />
        </div>
      </div>
      <div style={{ marginTop: 'var(--space-md)' }}>
        <Skeleton variant="text" lines={2} />
      </div>
    </Card>
  )
}

/** Responsive grid of employee cards with loading/empty/error states. */
export function EmployeeGrid({
  employees,
  loading,
  error,
  onRetry,
  emptyDescription,
}: EmployeeGridProps) {
  if (error) {
    return <ErrorState description="Couldn't load the team directory." onRetry={onRetry} />
  }

  if (loading) {
    return (
      <div className={styles.grid}>
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  if (employees.length === 0) {
    return (
      <Card>
        <EmptyState
          icon={<Avatar size="lg" />}
          title="No people found"
          description={emptyDescription ?? 'Try adjusting your search or filters.'}
        />
      </Card>
    )
  }

  return (
    <div className={styles.grid}>
      {employees.map((e) => (
        <EmployeeCard key={e.id} employee={e} />
      ))}
    </div>
  )
}
