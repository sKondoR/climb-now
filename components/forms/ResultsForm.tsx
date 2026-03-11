'use client'

import { useCallback, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { rootStore } from '@/lib/store/root.store'
import { DEFAULT_TEAM, DEFAULT_URL_CODE } from '@/lib/constants'

import { EventTemplate } from './EventTemplate'
import { Item } from '@/components/shared/Autocomplete/Autocomplete.types'
import { Event } from '@/types/events'
import LinkToEvent from '@/components/shared/LinkToEvent/LinkToEvent'
import Autocomplete from '../shared/Autocomplete/Autocomplete'

export default observer(
function ResultsForm() {
  const formStore = rootStore.formStore
  const teamsStore = rootStore.teamsStore
  const disciplinesStore = rootStore.disciplinesStore
  const eventsStore = rootStore.eventsStore
  const command = formStore.command as Item | null
  const { isCommandFilterEnabled, isOnlyOnline } = formStore


  useEffect(() => {
    disciplinesStore.fetchGroups(formStore.code)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formStore.code])


  const handleUrlChange = useCallback(
    (value: Item | null) => {
      formStore.setCode(typeof value === 'string' ? value : '')
    },
    []
  )

  const handleCommandChange = useCallback(
    (value: Item | null) => {
      formStore.setCommand(typeof value === 'string' ? value : '')
    },
    []
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
      <div className="flex-1 relative">
        <Autocomplete
          value={formStore.code}
          onChange={handleUrlChange}
          placeholder="2602vrn"
          data={eventsStore.events as unknown as Item[]}
          label="код соревнований"
          labelTitle="Введите код соревнований из URL"
          dataLabel={DEFAULT_URL_CODE}
          property="link"
          renderItem={(item: Item, value: Item | null) => EventTemplate(item as unknown as Event, value as string | null)}
          dropdownWidth={400}
        />
        <LinkToEvent code={formStore.code as string}/>
      </div>
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