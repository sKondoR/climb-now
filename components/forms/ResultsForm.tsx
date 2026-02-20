'use client'

import { useState, useCallback, useEffect } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { fetchResults } from '@/lib/api'
import { observer } from 'mobx-react-lite'
import { mobxStore } from '@/lib/store/mobxStore'
import { DEFAULT_CITY, DEFAULT_URL_CODE } from '@/lib/constants'
import { useRouter } from 'next/navigation'

export default observer(
function ResultsForm() {
  const router = useRouter()
  const store = mobxStore()
  const [code, setCode] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('code') || store.code
  })
  const [command, setCommand] = useState(store.command)
  const { isCommandFilterEnabled } = store;

  // Debounced fetch для URL
  const debouncedFetch = useDebouncedCallback(
    async (code: string) => {
      store.setIsDisciplinesLoading(true)
      store.setDisciplinesData(null)
      const url = new URL(window.location.href)
      try {
        const data = await fetchResults(code)
        store.setCode(code)
        store.setDisciplinesData(data)
        store.setIsDisciplinesLoading(false)
        if (data?.length) {
          url.searchParams.set('code', code)
          router.replace(url.pathname + url.search)          
        } else {
          router.replace(url.pathname)
        }     
      } catch (error) {
        console.error('Ошибка загрузки данных:', error)
        store.setIsDisciplinesLoading(false)
        router.replace(url.pathname)
      }
    },
    500
  )

  // Debounced fetch для города
  const debouncedCommandFetch = useDebouncedCallback(
    (command: string) => {
      store.setCommand(command)
    },
    300
  )

  const handleUrlChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newCode = e.target.value
      setCode(newCode)
      debouncedFetch(newCode)
    },
    [debouncedFetch]
  )

  const handleCommandChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newCommand = e.target.value
      setCommand(newCommand)
      debouncedCommandFetch(newCommand)
    },
    [debouncedCommandFetch]
  )

  const handleCommandFilterToggle = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const isEnabled = e.target.checked
      store.setIsCommandFilterEnabled(isEnabled)
    },
    []
  )

  useEffect(() => {
    debouncedFetch(code)
  }, [])

  return (
    <div className="flex flex-wrap gap-4">
      <div className="w-full md:w-auto">
        <label
          htmlFor="url"
          className="block text-sm font-medium text-gray-700 mb-2"
          title="Введите код соревнований из URL"
        >
          код соревнований
          <span className="text-xs text-gray-500"> (например {DEFAULT_URL_CODE})</span>
        </label>
        <div className="relative">
          <input
            type="text"
            id="code"
            value={code}
            onChange={handleUrlChange}
            placeholder="2602vrn"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
          />
        </div>
      </div>
      
      <div className="w-full md:w-auto">
        <label
          htmlFor="command"
          className="block text-sm font-medium text-gray-700 mb-2"
          title="Скалолазы из этого города будут подсвечены"
        >
          команда
          <span className="text-xs text-gray-500"> (например {DEFAULT_CITY})</span>
        </label>
        <input
          type="text"
          id="command"
          value={command}
          onChange={handleCommandChange}
          placeholder="СПБ"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="w-full md:w-auto">
        <input
          type="checkbox"
          id="commandFilter"
          checked={isCommandFilterEnabled}
          onChange={handleCommandFilterToggle}
          className="cursor-pointer h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="commandFilter" className="text-sm font-medium text-gray-700 ml-2">
          только команда
        </label>
      </div>
    </div>
  )
})