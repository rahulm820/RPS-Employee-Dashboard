/**
 * Mock API abstraction.
 *
 * Simulates a network layer over the local JSON fixtures: artificial latency,
 * abort support, deep-cloned responses (so callers can't mutate the store),
 * and optional simulated failures. Swapping this file's internals for real
 * `fetch` calls is all it would take to move to a live backend — the service
 * layer above it stays unchanged.
 */

export class ApiError extends Error {
  readonly status: number
  constructor(message: string, status = 500) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export interface RequestOptions {
  signal?: AbortSignal
  /** Override the simulated latency (ms). */
  delay?: number
  /** Force a rejection with this error (for testing error states). */
  failWith?: ApiError
}

/** Default artificial latency window (ms). */
const MIN_DELAY = 250
const MAX_DELAY = 650

function randomDelay(): number {
  return MIN_DELAY + Math.floor(Math.random() * (MAX_DELAY - MIN_DELAY))
}

function clone<T>(value: T): T {
  return typeof structuredClone === 'function'
    ? structuredClone(value)
    : (JSON.parse(JSON.stringify(value)) as T)
}

/**
 * Resolve `resolver()` after a simulated delay. `resolver` runs at resolution
 * time so it can compute against the latest in-memory store and `throw`
 * `ApiError` for not-found / validation cases.
 */
export function request<T>(
  resolver: () => T,
  options: RequestOptions = {},
): Promise<T> {
  const { signal, delay = randomDelay(), failWith } = options

  return new Promise<T>((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('Aborted', 'AbortError'))
      return
    }

    const onAbort = () => {
      clearTimeout(timer)
      reject(new DOMException('Aborted', 'AbortError'))
    }

    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort)
      if (failWith) {
        reject(failWith)
        return
      }
      try {
        resolve(clone(resolver()))
      } catch (err) {
        reject(err instanceof Error ? err : new ApiError(String(err)))
      }
    }, delay)

    signal?.addEventListener('abort', onAbort, { once: true })
  })
}

/** Narrow an unknown rejection to a user-facing message. */
export function toErrorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message
  if (error instanceof Error) return error.message
  return 'Something went wrong'
}
