import { useEffect, useState } from 'react'
import { UPDATE_INTERVAL } from '@/lib/constants'

interface UseAutoRefreshOptions {
  enabled?: boolean
  delay?: number
}

export function useAutoRefresh(callback: () => void, options: UseAutoRefreshOptions = {}) {
  const { enabled = true, delay = UPDATE_INTERVAL } = options
  const [isRunning, setIsRunning] = useState(enabled)

  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(callback, delay)

    return () => clearInterval(interval)
  }, [callback, isRunning, delay])

  const start = () => setIsRunning(true)
  const stop = () => setIsRunning(false)
  const toggle = () => setIsRunning(!isRunning)

  return { isRunning, start, stop, toggle }
}