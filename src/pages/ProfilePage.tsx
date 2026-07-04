import { useState } from 'react'
import { PageHeader } from '../components/layout/PageHeader'
import {
  Card,
  Avatar,
  Badge,
  Input,
  Select,
  Button,
  Skeleton,
  ErrorState,
  useToast,
} from '../components/ui'
import { useCurrentUser } from '../context/currentUserContext'
import { useTeams } from '../hooks/useEmployees'
import { employeeService } from '../services'
import { toErrorMessage } from '../lib/api'
import { formatDate, titleCase } from '../utils'
import type { EmployeeStatus } from '../types'
import type { UpdateEmployeeInput } from '../services/employeeService'
import styles from '../components/dashboard/dashboard.module.css'
import pageStyles from './pages.module.css'

const STATUS_OPTIONS: { label: string; value: EmployeeStatus }[] = [
  { label: 'Online', value: 'online' },
  { label: 'Away', value: 'away' },
  { label: 'Busy', value: 'busy' },
  { label: 'Offline', value: 'offline' },
]

type Errors = Partial<Record<keyof UpdateEmployeeInput, string>>

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^[+\d][\d\s-]{6,}$/

function validate(v: {
  name: string
  email: string
  phone: string
  location: string
}): Errors {
  const errors: Errors = {}
  if (!v.name.trim()) errors.name = 'Name is required'
  if (!v.email.trim()) errors.email = 'Email is required'
  else if (!EMAIL_RE.test(v.email.trim())) errors.email = 'Enter a valid email address'
  if (v.phone.trim() && !PHONE_RE.test(v.phone.trim())) errors.phone = 'Enter a valid phone number'
  return errors
}

export default function ProfilePage() {
  const { user, loading, error, refresh } = useCurrentUser()
  const teams = useTeams()
  const { success, error: toastError } = useToast()

  const [edits, setEdits] = useState<UpdateEmployeeInput>({})
  const [errors, setErrors] = useState<Errors>({})
  const [submitted, setSubmitted] = useState(false)
  const [saving, setSaving] = useState(false)

  if (error) {
    return (
      <>
        <PageHeader title="Profile" description="Manage your personal details." />
        <Card>
          <ErrorState description="Couldn't load your profile." onRetry={refresh} />
        </Card>
      </>
    )
  }

  if (loading || !user) {
    return (
      <>
        <PageHeader title="Profile" description="Manage your personal details." />
        <Card>
          <Skeleton variant="text" lines={6} />
        </Card>
      </>
    )
  }

  const me = user

  // Displayed value = local edit if present, otherwise the stored record.
  const merged = {
    name: edits.name ?? me.name,
    email: edits.email ?? me.email,
    role: edits.role ?? me.role,
    team: edits.team ?? me.team,
    status: edits.status ?? me.status,
    phone: edits.phone ?? me.phone ?? '',
    location: edits.location ?? me.location ?? '',
  }

  function set<K extends keyof UpdateEmployeeInput>(key: K, value: UpdateEmployeeInput[K]) {
    const next = { ...edits, [key]: value }
    setEdits(next)
    if (submitted) {
      setErrors(validate({ ...merged, ...next } as typeof merged))
    }
  }

  const isDirty = Object.keys(edits).length > 0
  const teamOptions = (teams.data ?? [me.team]).map((t) => ({ label: t, value: t }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
    const found = validate(merged)
    setErrors(found)
    if (Object.keys(found).length > 0) return

    setSaving(true)
    try {
      // Trim strings; empty phone/location become undefined.
      await employeeService.updateEmployee(me.id, {
        name: merged.name.trim(),
        email: merged.email.trim(),
        role: merged.role.trim(),
        team: merged.team,
        status: merged.status,
        phone: merged.phone.trim() || undefined,
        location: merged.location.trim() || undefined,
      })
      success('Profile updated', 'Your details have been saved.')
      setEdits({})
      setErrors({})
      setSubmitted(false)
      refresh()
    } catch (err) {
      toastError('Could not save', toErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <PageHeader
        title="Profile"
        description="Manage your personal details and preferences."
      />

      <div className={`${pageStyles.grid} ${pageStyles.twoCol}`}>
        <Card header={<span className={styles.widgetTitle}>Personal details</span>}>
          <form className={pageStyles.stack} onSubmit={handleSubmit} noValidate>
            <Input
              label="Full name"
              value={merged.name}
              error={errors.name}
              onChange={(e) => set('name', e.target.value)}
            />
            <Input
              label="Email"
              type="email"
              value={merged.email}
              error={errors.email}
              onChange={(e) => set('email', e.target.value)}
            />
            <div className={pageStyles.formRow}>
              <Input
                label="Phone"
                type="tel"
                placeholder="+91 98765 43210"
                value={merged.phone}
                error={errors.phone}
                onChange={(e) => set('phone', e.target.value)}
              />
              <Input
                label="City"
                placeholder="e.g. Mumbai, IN"
                value={merged.location}
                onChange={(e) => set('location', e.target.value)}
              />
            </div>
            <div className={pageStyles.formRow}>
              <Input
                label="Role"
                value={merged.role}
                onChange={(e) => set('role', e.target.value)}
              />
              <Select
                label="Team"
                options={teamOptions}
                value={merged.team}
                onChange={(e) => set('team', e.target.value)}
              />
            </div>
            <Select
              label="Availability"
              options={STATUS_OPTIONS}
              value={merged.status}
              onChange={(e) => set('status', e.target.value as EmployeeStatus)}
            />
            <div className={pageStyles.formActions}>
              {isDirty && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setEdits({})
                    setErrors({})
                    setSubmitted(false)
                  }}
                >
                  Discard
                </Button>
              )}
              <Button type="submit" variant="accent" loading={saving} disabled={!isDirty}>
                Save changes
              </Button>
            </div>
          </form>
        </Card>

        <Card header={<span className={styles.widgetTitle}>Overview</span>}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 'var(--space-sm)',
              textAlign: 'center',
            }}
          >
            <Avatar name={merged.name} size="xl" status={merged.status} />
            <div>
              <div style={{ fontWeight: 600 }}>{merged.name}</div>
              <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-small)' }}>
                {merged.role}
              </div>
            </div>
            <Badge variant="neutral" size="sm">
              {merged.team}
            </Badge>
            <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
              {titleCase(merged.status)} · Joined {formatDate(me.joinedAt)}
            </p>
          </div>
        </Card>
      </div>
    </>
  )
}
