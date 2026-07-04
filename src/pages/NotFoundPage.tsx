import { useNavigate } from 'react-router-dom'
import { ErrorState, Button } from '../components/ui'

export default function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <div style={{ paddingTop: 'var(--space-xl)' }}>
      <ErrorState
        title="Page not found"
        description="The page you're looking for doesn't exist or has moved."
        action={
          <Button variant="secondary" onClick={() => navigate('/')}>
            Back to dashboard
          </Button>
        }
      />
    </div>
  )
}
