'use client'

import { useState } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRefresh } from '@fortawesome/free-solid-svg-icons'

interface RefreshTableBtnProps {
  refetch: () => Promise<unknown>
}

// Без минимума быстрый ответ даёт невнятный рывок иконки вместо заметного оборота
const MIN_SPIN_MS = 600

export default function RefreshTableBtn({
  refetch,
}: RefreshTableBtnProps) {
    const [isRefreshing, setIsRefreshing] = useState(false);
    return (
      <button
        type="button"
        aria-label="Обновить результаты"
        title="Обновить результаты"
        className="relative ml-2 text-sm text-blue-600 rounded before:absolute before:content-[''] before:-inset-3.5 hover:text-blue-800 transition-colors focus-ring"
        aria-busy={isRefreshing}
        onClick={async () => {
          if (isRefreshing) return
          setIsRefreshing(true)
          // Крутится, пока идёт запрос: иконка честно показывает, что данные ещё обновляются
          await Promise.all([refetch(), new Promise((resolve) => setTimeout(resolve, MIN_SPIN_MS))])
          setIsRefreshing(false)
        }}
      >
        <FontAwesomeIcon icon={faRefresh} className={isRefreshing ? 'animate-spin' : ''} />
      </button>
    )
  }
