import { Input, Select } from '../ui'
import { SearchIcon } from '../icons'
import { pluralize } from '../../utils'
import type { EmployeeStatus } from '../../types'
import styles from './directory.module.css'

export type StatusFilter = 'all' | EmployeeStatus

export interface DirectoryToolbarProps {
  search: string
  onSearch: (value: string) => void
  team: string
  onTeam: (value: string) => void
  teams: string[]
  status: StatusFilter
  onStatus: (value: StatusFilter) => void
  count: number
}

const STATUS_OPTIONS: { label: string; value: StatusFilter }[] = [
  { label: 'Any status', value: 'all' },
  { label: 'Online', value: 'online' },
  { label: 'Away', value: 'away' },
  { label: 'Busy', value: 'busy' },
  { label: 'Offline', value: 'offline' },
]

export function DirectoryToolbar({
  search,
  onSearch,
  team,
  onTeam,
  teams,
  status,
  onStatus,
  count,
}: DirectoryToolbarProps) {
  const teamOptions = [
    { label: 'All teams', value: 'all' },
    ...teams.map((t) => ({ label: t, value: t })),
  ]

  return (
    <div className={styles.toolbar}>
      <div className={styles.search}>
        <Input
          placeholder="Search by name, role, team, or location"
          leftIcon={<SearchIcon />}
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          aria-label="Search directory"
        />
      </div>
      <div className={styles.filter}>
        <Select
          aria-label="Filter by team"
          options={teamOptions}
          value={team}
          onChange={(e) => onTeam(e.target.value)}
        />
      </div>
      <div className={styles.filter}>
        <Select
          aria-label="Filter by status"
          options={STATUS_OPTIONS}
          value={status}
          onChange={(e) => onStatus(e.target.value as StatusFilter)}
        />
      </div>
      <span className={styles.count}>{pluralize(count, 'person', 'people')}</span>
    </div>
  )
}
