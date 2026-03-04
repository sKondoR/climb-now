'use client'

import { useDebouncedCallback } from 'use-debounce'
import { observer } from 'mobx-react-lite'
import { rootStore } from '@/lib/store/root.store'
import { DEFAULT_TEAM, DEFAULT_URL_CODE } from '@/lib/constants'
import { useRouter } from 'next/navigation'
import { Autocomplete } from './Autocomplete'
import { Item } from './Autocomplete.types'
import { Event } from '@/types/events'
import { useCallback, useEffect } from 'react'
import EventTemplate from './EventTemplate'

export default observer(
function ResultsForm() {
  const router = useRouter()
  const formStore = rootStore.formStore
  const teamsStore = rootStore.teamsStore
  const disciplinesStore = rootStore.disciplinesStore
  const eventsStore = rootStore.eventsStore
  const code = formStore.code as Item | null
  const command = formStore.command as Item | null
  const { isCommandFilterEnabled, isOnlyOnline } = formStore

  useEffect(() => {
    if (code) {
      disciplinesStore.fetchGroups(typeof code === 'string' ? code : '')
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
      url.searchParams.set('code', typeof code === 'string' ? code : '')
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
    (value: Item | null) => {
      formStore.setCode(typeof value === 'string' ? value : '')
    },
    []
  )

  const handleCommandChange = useCallback(
    (value: Item | null) => {
      formStore.setCommand(typeof value === 'string' ? value : '')
      debouncedCommandFetch(typeof value === 'string' ? value : '')
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
      <Autocomplete
        value={code}
        onChange={handleUrlChange}
        placeholder="2602vrn"
        data={eventsStore.events as Item[]}
        label="код соревнований"
        labelTitle="Введите код соревнований из URL"
        dataLabel={DEFAULT_URL_CODE}
        property="link"
        renderItem={(item: Item, value: Item) => EventTemplate(item as Event, value as string)}
        dropdownWidth={400}
      />
      <Autocomplete
        value={command}
        onChange={handleCommandChange}
        placeholder={DEFAULT_TEAM}
        data={teamsStore.teams as Item[]}
        label="команда"
        labelTitle="Скалолазы из команды будут подсвечены"
        dataLabel={DEFAULT_TEAM}
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