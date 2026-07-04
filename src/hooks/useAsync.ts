import { useCallback, useEffect, useState } from 'react'
import type { AsyncState } from '../types'

export interface UseAsyncResult<T> extends AsyncState<T> {
  /** Re-run the async factory. */
  refetch: () => void
}

interface InternalState<T> {
  data: T | undefined
  error: Error | undefined
  /** Identifies which request the stored data/error belongs to. */
  settledKey: string | null
}

/**
 * Run an async factory on mount and whenever `deps` change, tracking
 * loading/error/data. The factory receives an AbortSignal so in-flight
 * requests are cancelled on unmount or when deps change (avoiding races and
 * state updates on unmounted components).
 *
 * `loading` is *derived* — true whenever the settled result doesn't match the
 * current request key — so the effect never calls setState synchronously; it
 * only updates state from the resolved/rejected promise.
 *
 * `deps` is the dependency array — the factory itself is intentionally not a
 * dependency (it's recreated each render), so pass any values it closes over.
 */
export function useAsync<T>(
  factory: (signal: AbortSignal) => Promise<T>,
  deps: unknown[] = [],
): UseAsyncResult<T> {
  const [state, setState] = useState<InternalState<T>>({
    data: undefined,
    error: undefined,
    settledKey: null,
  })
  const [nonce, setNonce] = useState(0)

  const key = `${nonce}:${JSON.stringify(deps)}`
  const refetch = useCallback(() => setNonce((n) => n + 1), [])

  useEffect(() => {
    const controller = new AbortController()

    factory(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) {
          setState({ data, error: undefined, settledKey: key })
        }
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return
        if (err instanceof DOMException && err.name === 'AbortError') return
        setState({
          data: undefined,
          error: err instanceof Error ? err : new Error(String(err)),
          settledKey: key,
        })
      })

    return () => controller.abort()
    // `factory` is intentionally omitted — it is re-created every render; `key`
    // captures the caller's real dependencies plus the refetch nonce.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  const loading = state.settledKey !== key

  return {
    data: loading ? undefined : state.data,
    error: loading ? undefined : state.error,
    loading,
    refetch,
  }
}
