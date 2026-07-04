import { PageHeader } from '../components/layout/PageHeader'
import { Card, EmptyState, Button, DatePicker } from '../components/ui'

export default function AttendancePage() {
  return (
    <>
      <PageHeader
        title="Attendance"
        description="Review your clock-in history and daily attendance log."
        actions={<Button variant="secondary">Export</Button>}
      />
      <Card>
        <div style={{ maxWidth: 220, marginBottom: 'var(--space-md)' }}>
          <DatePicker label="Jump to date" />
        </div>
        <EmptyState
          title="No attendance records yet"
          description="Once your team starts clocking in, the daily log will appear here."
        />
      </Card>
    </>
  )
}
