import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PageHeader } from '../components/layout/PageHeader'
import { DirectoryToolbar, EmployeeGrid, type StatusFilter } from '../components/directory'
import { useEmployees, useTeams } from '../hooks/useEmployees'

export default function DirectoryPage() {
  // Search term lives in the URL (?q=) so the topbar search can deep-link here.
  const [searchParams, setSearchParams] = useSearchParams()
  const search = searchParams.get('q') ?? ''
  const setSearch = (value: string) =>
    setSearchParams(value ? { q: value } : {}, { replace: true })

  const [team, setTeam] = useState('all')
  const [status, setStatus] = useState<StatusFilter>('all')

  const { data, loading, error, refetch } = useEmployees(search)
  const teams = useTeams()

  // Search is applied by the service; team/status are refined client-side.
  const filtered = useMemo(
    () =>
      (data ?? []).filter(
        (e) => (team === 'all' || e.team === team) && (status === 'all' || e.status === status),
      ),
    [data, team, status],
  )

  const filtersActive = search.trim() !== '' || team !== 'all' || status !== 'all'

  return (
    <>
      <PageHeader
        title="Team directory"
        description="Find colleagues across teams and see who's available."
      />

      <DirectoryToolbar
        search={search}
        onSearch={setSearch}
        team={team}
        onTeam={setTeam}
        teams={teams.data ?? []}
        status={status}
        onStatus={setStatus}
        count={filtered.length}
      />

      <EmployeeGrid
        employees={filtered}
        loading={loading}
        error={error}
        onRetry={refetch}
        emptyDescription={
          filtersActive
            ? 'No one matches your search and filters. Try broadening them.'
            : 'There are no employees to show yet.'
        }
      />
    </>
  )
}
