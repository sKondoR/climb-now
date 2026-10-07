'use client'

import { useEffect } from 'react'

import { sendToHawk } from '@/src/shared/hawk'

// Ошибку, пойманную error boundary, React не пробрасывает в window.onerror, поэтому отправляем её вручную
export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string }
  retry: () => void
}) {
  useEffect(() => {
    sendToHawk(error)
  }, [error])

  return (
    <html lang="ru">
      <body style={{ fontFamily: 'system-ui, sans-serif', textAlign: 'center', paddingTop: '20vh' }}>
        <h1>Что-то пошло не так</h1>
        <button onClick={() => retry()}>Попробовать снова</button>
      </body>
    </html>
  )
}
