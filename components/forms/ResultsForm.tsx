'use client'

import { useState, useCallback, useEffect } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { observer } from 'mobx-react-lite'
import { rootStore } from '@/lib/store/root.store'
import { DEFAULT_URL_CODE } from '@/lib/constants'
import { useRouter } from 'next/navigation'
import { TeamAutocomplete } from './TeamAutocomplete'

export default observer(
function ResultsForm() {
  const router = useRouter()
  const formStore = rootStore.formStore
  const disciplinesStore = rootStore.disciplinesStore
  const code = formStore.code
  const command = formStore.command
  const { isCommandFilterEnabled, isOnlyOnline } = formStore

  useEffect(() => {
    if (code) {
      disciplinesStore.fetchGroups(code)
    }
  }, [code, disciplinesStore])

  useEffect(() => {
    if (formStore.code) {
      disciplinesStore.fetchGroups(formStore.code)
    }
  }, [formStore.code, disciplinesStore])

  useEffect(() => {
    disciplinesStore.setIsDisciplinesLoading(disciplinesStore.isGroupsLoading)
  }, [disciplinesStore.isGroupsLoading, disciplinesStore])

  useEffect(() => {
    if (disciplinesStore.groupsError) {
      console.error('Ошибка загрузки данных:', disciplinesStore.groupsError)
      const url = new URL(window.location.href)
      router.replace(url.pathname)
    }
  }, [disciplinesStore.groupsError, router])

  useEffect(() => {
    if (disciplinesStore.groupsData && disciplinesStore.groupsData.length > 0) {
      const url = new URL(window.location.href)
      url.searchParams.set('code', code)
      window.history.replaceState({}, document.title, url.pathname + url.search)
    } else if (disciplinesStore.groupsData && disciplinesStore.groupsData.length === 0) {
      const url = new URL(window.location.href)
      url.searchParams.delete('code')
      window.history.replaceState({}, document.title, url.pathname + url.search)
    }
  }, [disciplinesStore.groupsData, code])


  const debouncedCommandFetch = useDebouncedCallback(
    (command: string) => {
      formStore.setCommand(command)
    },
    300
  )

  const handleUrlChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newCode = e.target.value
      formStore.setCode(newCode)
    },
    []
  )

  const handleCommandChange = useCallback(
    (value: string) => {
      formStore.setCommand(value)
      debouncedCommandFetch(value)
    },
    [debouncedCommandFetch]
  )

  const handleCommandFilterToggle = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const isEnabled = e.target.checked
      formStore.setIsCommandFilterEnabled(isEnabled)
    },
    []
  )

  const handleOnlyOnlineToggle = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const isEnabled = e.target.checked
      formStore.setIsOnlyOnline(isEnabled)
    },
    []
  )

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
      
      <TeamAutocomplete
        value={command}
        onChange={handleCommandChange}
      />
      <div className="w-full md:w-auto">
        <div className="flex flex-start align-center">
          <input
            type="checkbox"
            id="commandFilter"
            checked={isCommandFilterEnabled}
            onChange={handleCommandFilterToggle}
            className="cursor-pointer h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-[3px]"
          />
          <label htmlFor="commandFilter" className="cursor-pointer text-sm font-medium text-gray-700 ml-2">
            только команда
          </label>
        </div>
        <div className="flex flex-start align-center mt-2">
          <input
            type="checkbox"
            id="onlineFilter"
            checked={isOnlyOnline}
            onChange={handleOnlyOnlineToggle}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-[3px]"
          />
          <label htmlFor="onlineFilter" className="cursor-pointer text-sm font-medium text-gray-700 ml-2">
            только онлайн
          </label>
        </div>
      </div>
    </div>
  )
})