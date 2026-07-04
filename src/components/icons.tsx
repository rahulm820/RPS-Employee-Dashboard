import type { SVGProps } from 'react'

export type IconProps = SVGProps<SVGSVGElement>

/** Shared defaults: 24-grid viewBox, currentColor stroke, rounded joins. */
function Svg(props: IconProps) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    />
  )
}

export function DashboardIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </Svg>
  )
}

export function AttendanceIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3" y="4.5" width="18" height="16" rx="2" />
      <path d="M3 9h18M8 2.5v4M16 2.5v4" />
      <path d="M8.5 14.5l2.2 2.2 4-4.4" />
    </Svg>
  )
}

export function LeaveIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3" y="4.5" width="18" height="16" rx="2" />
      <path d="M3 9h18M8 2.5v4M16 2.5v4" />
      <circle cx="12" cy="14.5" r="2.6" />
      <path d="M12 12.6v1.9l1.2 1.2" />
    </Svg>
  )
}

export function DirectoryIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
      <path d="M16 5.2a3.2 3.2 0 0 1 0 5.6M17.5 19a5.5 5.5 0 0 0-2.3-4.5" />
    </Svg>
  )
}

export function AnnouncementsIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 9v4a1 1 0 0 0 1 1h2l7 4V4L7 8H5a1 1 0 0 0-1 1Z" />
      <path d="M17.5 8.5a4 4 0 0 1 0 5M7 14v4" />
    </Svg>
  )
}

export function ProfileIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="10" r="3" />
      <path d="M6.5 18.3a6 6 0 0 1 11 0" />
    </Svg>
  )
}

export function MenuIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </Svg>
  )
}

export function CloseIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M6 6l12 12M18 6L6 18" />
    </Svg>
  )
}

export function SearchIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16l4 4" />
    </Svg>
  )
}

export function BellIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </Svg>
  )
}

export function SunIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </Svg>
  )
}

export function MoonIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M20 14.5A8 8 0 0 1 9.5 4a7 7 0 1 0 10.5 10.5Z" />
    </Svg>
  )
}

export function LogoIcon(props: IconProps) {
  return (
    <Svg strokeWidth="1.6" {...props}>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
      <path d="M8 15c1-5 3-7 8-8-1 5-3 7-8 8Z" />
      <path d="M8 15c2-1 3.5-2.5 4.5-4.5" />
    </Svg>
  )
}
