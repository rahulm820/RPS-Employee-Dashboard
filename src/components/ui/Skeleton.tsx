import type { CSSProperties, HTMLAttributes } from 'react'
import { cx } from './utils'
import styles from './Skeleton.module.css'

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'rect' | 'circle'
  width?: number | string
  height?: number | string
  /** Number of stacked lines to render (text variant only). */
  lines?: number
  /** Disable the shimmer animation. */
  animate?: boolean
}

function toDim(v: number | string | undefined): string | undefined {
  if (v == null) return undefined
  return typeof v === 'number' ? `${v}px` : v
}

export function Skeleton({
  variant = 'text',
  width,
  height,
  lines = 1,
  animate = true,
  className,
  style,
  ...rest
}: SkeletonProps) {
  const baseClass = cx(
    styles.skeleton,
    styles[variant],
    animate && styles.animate,
    className,
  )

  if (variant === 'text' && lines > 1) {
    return (
      <div className={styles.group} {...rest}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={baseClass}
            style={{
              width: i === lines - 1 ? '70%' : toDim(width) ?? '100%',
              height: toDim(height),
              ...style,
            }}
          />
        ))}
      </div>
    )
  }

  const dims: CSSProperties = {
    width: toDim(width),
    height: toDim(height),
    ...style,
  }

  return <div className={baseClass} style={dims} {...rest} />
}
