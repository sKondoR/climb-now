'use client'

import { useEffect } from 'react'

import { initHawk } from '@/src/shared/hawk'

// Ловит window.onerror и unhandledrejection в браузере. Токен приходит из layout в рантайме, поэтому не нужен при сборке
const HawkInit = ({ token, release }: { token: string, release?: string }) => {
  useEffect(() => {
    initHawk(token, release)
  }, [token, release])

  return null
}

export default HawkInit
