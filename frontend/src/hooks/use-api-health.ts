import { useCallback, useEffect, useRef, useState } from "react"

import { checkHealth } from "@/lib/api"

export type ApiHealthStatus = "checking" | "waking" | "online" | "offline"

export interface ApiHealth {
  status: ApiHealthStatus
  /** The `message` from the last successful health response. */
  message: string | null
  retry: () => void
}

// Free hosts (e.g. Render) sleep when idle and hold the first request while they boot,
// so a slow check is reported as "waking" rather than failing fast.
const WAKING_AFTER_MS = 3_000
const REQUEST_TIMEOUT_MS = 90_000
const RETRY_OFFLINE_MS = 15_000
const RECHECK_ONLINE_MS = 60_000

export function useApiHealth(): ApiHealth {
  const [status, setStatus] = useState<ApiHealthStatus>("checking")
  const [message, setMessage] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)
  const hasBeenOnline = useRef(false)

  const retry = useCallback(() => setAttempt((n) => n + 1), [])

  useEffect(() => {
    const controller = new AbortController()
    let cancelled = false
    let nextCheck: ReturnType<typeof setTimeout> | undefined

    // Keep showing "online" during background re-checks; only first loads and retries show progress.
    if (!hasBeenOnline.current) setStatus("checking")
    const wakingTimer = setTimeout(() => {
      if (!hasBeenOnline.current) setStatus("waking")
    }, WAKING_AFTER_MS)
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

    checkHealth(controller.signal)
      .then((health) => {
        if (cancelled) return
        const ok = health.status === "ok"
        hasBeenOnline.current = ok
        setStatus(ok ? "online" : "offline")
        setMessage(health.message)
        nextCheck = setTimeout(retry, ok ? RECHECK_ONLINE_MS : RETRY_OFFLINE_MS)
      })
      .catch(() => {
        // A timeout also aborts the request, but only an unmount/re-run should be ignored.
        if (cancelled) return
        hasBeenOnline.current = false
        setStatus("offline")
        nextCheck = setTimeout(retry, RETRY_OFFLINE_MS)
      })
      .finally(() => {
        clearTimeout(wakingTimer)
        clearTimeout(timeout)
      })

    return () => {
      cancelled = true
      controller.abort()
      clearTimeout(wakingTimer)
      clearTimeout(timeout)
      clearTimeout(nextCheck)
    }
  }, [attempt, retry])

  return { status, message, retry }
}
