import type { ReactNode } from 'react'
import { cx } from './utils'
import { Skeleton } from './Skeleton'
import { EmptyState } from './EmptyState'
import styles from './Table.module.css'

export interface Column<T> {
  /** Stable identifier for the column. */
  key: string
  header: ReactNode
  /** Cell renderer. Defaults to `String(row[key])` when omitted. */
  render?: (row: T, rowIndex: number) => ReactNode
  align?: 'left' | 'center' | 'right'
  width?: string
}

export interface TableProps<T> {
  columns: Column<T>[]
  data: T[]
  /** Unique key per row. */
  rowKey: (row: T, index: number) => string | number
  /** Show shimmer placeholder rows instead of data. */
  loading?: boolean
  /** Placeholder rows to render while loading. */
  loadingRows?: number
  /** Shown when data is empty and not loading. */
  empty?: ReactNode
  /** Highlight rows on hover (implies interactivity). */
  hoverable?: boolean
  onRowClick?: (row: T, index: number) => void
  className?: string
}

export function Table<T>({
  columns,
  data,
  rowKey,
  loading = false,
  loadingRows = 5,
  empty,
  hoverable = false,
  onRowClick,
  className,
}: TableProps<T>) {
  const showEmpty = !loading && data.length === 0

  return (
    <div className={cx(styles.wrapper, className)}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={cx(styles.th, col.align && styles[col.align])}
                style={{ width: col.width }}
                scope="col"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading
            ? Array.from({ length: loadingRows }).map((_, r) => (
                <tr key={`sk-${r}`} className={styles.tr}>
                  {columns.map((col) => (
                    <td key={col.key} className={styles.td}>
                      <Skeleton width="70%" />
                    </td>
                  ))}
                </tr>
              ))
            : data.map((row, rIdx) => (
                <tr
                  key={rowKey(row, rIdx)}
                  className={cx(
                    styles.tr,
                    (hoverable || onRowClick) && styles.hoverable,
                  )}
                  onClick={onRowClick ? () => onRowClick(row, rIdx) : undefined}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cx(styles.td, col.align && styles[col.align])}
                    >
                      {col.render
                        ? col.render(row, rIdx)
                        : String((row as Record<string, unknown>)[col.key] ?? '')}
                    </td>
                  ))}
                </tr>
              ))}
        </tbody>
      </table>
      {showEmpty && (
        <div className={styles.emptyWrap}>
          {empty ?? <EmptyState title="No records" description="There's nothing to show here yet." />}
        </div>
      )}
    </div>
  )
}
