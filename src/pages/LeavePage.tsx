import { PageHeader } from '../components/layout/PageHeader'
import { Card, EmptyState, Button } from '../components/ui'

export default function LeavePage() {
  return (
    <>
      <PageHeader
        title="Leave"
        description="Track your balance and manage leave requests."
        actions={<Button variant="accent">New request</Button>}
      />
      <Card>
        <EmptyState
          title="No leave requests"
          description="You haven't submitted any leave requests. Create one to get started."
          action={<Button variant="accent">New request</Button>}
        />
      </Card>
    </>
  )
}
