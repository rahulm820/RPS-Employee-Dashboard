import { useState } from 'react'
import { PageHeader } from '../components/layout/PageHeader'
import { Card, Avatar, Badge, Input, Skeleton, EmptyState, ErrorState } from '../components/ui'
import { SearchIcon } from '../components/icons'
import { useEmployees } from '../hooks/useEmployees'
import type { EmployeeStatus } from '../types'
import styles from './pages.module.css'

const STATUS: Record<EmployeeStatus, 'online' | 'offline' | 'busy' | 'away'> = {
  online: 'online',
  offline: 'offline',
  busy: 'busy',
  away: 'away',
}

export default function DirectoryPage() {
  const [search, setSearch] = useState('')
  const { data, loading, error, refetch } = useEmployees(search)

  return (
    <>
      <PageHeader
        title="Team directory"
        description="Find colleagues across teams and their current status."
      />

      <div style={{ maxWidth: 340, marginBottom: 'var(--space-md)' }}>
        <Input
          placeholder="Search by name, role, or team"
          leftIcon={<SearchIcon />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search directory"
        />
      </div>

      {error && <ErrorState description="Couldn't load the directory." onRetry={refetch} />}

      {loading && (
        <div className={`${styles.grid} ${styles.people}`}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <div className={styles.person}>
                <Skeleton variant="circle" width="3.5rem" height="3.5rem" />
                <div style={{ flex: 1 }}>
                  <Skeleton width="70%" />
                  <div style={{ height: 8 }} />
                  <Skeleton width="45%" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {data && data.length === 0 && (
        <Card>
          <EmptyState
            title="No matches"
            description={`No one matches “${search}”. Try a different name or team.`}
          />
        </Card>
      )}

      {data && data.length > 0 && (
        <div className={`${styles.grid} ${styles.people}`}>
          {data.map((p) => (
            <Card key={p.id}>
              <div className={styles.person}>
                <Avatar name={p.name} size="lg" status={STATUS[p.status]} />
                <div className={styles.personText}>
                  <span className={styles.personName}>{p.name}</span>
                  <span className={styles.personRole}>{p.role}</span>
                  <span style={{ marginTop: 6 }}>
                    <Badge variant="neutral" size="sm">
                      {p.team}
                    </Badge>
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  )
}
