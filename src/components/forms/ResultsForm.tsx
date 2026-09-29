'use client'

import { useCallback, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { rootStore } from '@/src/store/root.store'
import { DEFAULT_TEAM, DEFAULT_URL_CODE } from '@/src/shared/constants'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers, faFlag } from '@fortawesome/free-solid-svg-icons'

import { EventTemplate } from './EventTemplate'
import { Item } from '@/src/shared/components/Autocomplete/Autocomplete.types'
import { Event } from '@/src/shared/types/events'
import LinkToEvent from '@/src/shared/components/LinkToEvent/LinkToEvent'
import Autocomplete from '../../shared/components/Autocomplete/Autocomplete'
import TextInput from '@/src/shared/components/TextInput/TextInput'
import { normalizeEventCode } from '@/src/shared/utils/forms.utils'

// Без DOMPurify: значения выводятся React-ом как текст (он сам экранирует), в URL попадают через searchParams,
// а код соревнования ещё и проверяется регуляркой на сервере. DOMPurify лишь добавлял ~13 КБ gzip
// и портил ввод: возвращал сериализованный HTML, и «A & B» превращалось в «A &amp; B»

export default observer(
function ResultsForm() {
  const formStore = rootStore.formStore
  const teamsStore = rootStore.teamsStore
  const disciplinesStore = rootStore.disciplinesStore
  const eventsStore = rootStore.eventsStore
  const command = formStore.command as Item | null
  const names = formStore.names
  const { isCommandFilterEnabled, isNamesFilterEnabled, isOnlyOnline } = formStore

  useEffect(() => {
    const currentEvent = eventsStore.events?.find((event) => event.link === formStore.code)
    disciplinesStore.fetchGroups(formStore.code, currentEvent?.name)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formStore.code])


  const handleUrlChange = useCallback(
    (value: Item | null) => {
      const rawValue = typeof value === 'string' ? value : ''
      formStore.setCode(normalizeEventCode(rawValue))
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const handleCommandChange = useCallback(
    (value: Item | null) => {
      const rawValue = typeof value === 'string' ? value : ''
      formStore.setCommand(rawValue)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const handleNamesChange = useCallback(
    (value: string) => {
      formStore.setNames(value)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const handleCommandFilterToggle = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const isEnabled = e.target.checked
      formStore.setIsCommandFilterEnabled(isEnabled)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const handleOnlyOnlineToggle = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const isEnabled = e.target.checked
      formStore.setIsOnlyOnline(isEnabled)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const handleNamesFilterToggle = useCallback(
    () => {
      formStore.setIsNamesFilterEnabled(!isNamesFilterEnabled)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isNamesFilterEnabled]
  )
  return (
    <div className="flex flex-wrap gap-4">
      <div className="w-full md:flex-1 md:w-auto relative md:min-w-80 md:max-w-80">
        <Autocomplete
          value={formStore.code}
          onChange={handleUrlChange}
          placeholder="2602vrn"
          data={eventsStore.events.filter((event) => event.link) as unknown as Item[]}
          isLoading={!eventsStore.events.length && !eventsStore.error}
          label="код соревнования"
          labelTitle="Код из адреса страницы соревнования на c-f-r.ru — можно вставить ссылку целиком"
          dataLabel={DEFAULT_URL_CODE}
          property="link"
          renderItem={(item: Item, value: Item | null) => EventTemplate(item as unknown as Event, value as string | null)}
          dropdownWidth={400}
        />
        {disciplinesStore.groupsData && <LinkToEvent code={formStore.code as string} />}
      </div>
      <div className="w-full md:flex-1 md:w-auto relative md:min-w-80 md:max-w-80">
        {isNamesFilterEnabled ? (
          <TextInput
            value={names}
            onChange={handleNamesChange}
            placeholder="Петров, Иванов"
            label="скалолазы"
            labelTitle="Скалолазы из списка будут подсвечены"
            dataLabel="Петров, Иванов"
          />
        ) : (
          <Autocomplete
            value={command}
            onChange={handleCommandChange}
            placeholder={DEFAULT_TEAM}
            data={teamsStore.teams as Item[]}
            isLoading={!teamsStore.teams.length && !teamsStore.error}
            label="команда"
            labelTitle="Скалолазы из команды будут подсвечены"
            dataLabel={DEFAULT_TEAM}
          />          
        )}
        <button
          type="button"
          className="absolute top-0 right-0 px-1 before:absolute before:content-[''] before:-inset-2 text-blue-600 hover:text-blue-800 cursor-pointer rounded focus-ring"
          onClick={handleNamesFilterToggle}
          aria-label={isNamesFilterEnabled ? 'Подсвечивать по команде' : 'Подсвечивать по фамилиям скалолазов'}
          title={isNamesFilterEnabled ? 'Подсвечивать по команде' : 'Подсвечивать по фамилиям скалолазов'}
        >
          <FontAwesomeIcon icon={isNamesFilterEnabled ? faUsers : faFlag} className=""  />
        </button>
      </div>
      <div className="w-full md:w-auto">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="commandFilter"
            checked={isCommandFilterEnabled}
            onChange={handleCommandFilterToggle}
            className="cursor-pointer h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="commandFilter" className="cursor-pointer text-sm font-medium text-gray-700 pl-2 pr-4 py-2.5 md:py-0">
            только команда
          </label>
        </div>
        <div className="flex items-center md:mt-2">
          <input
            type="checkbox"
            id="onlineFilter"
            checked={isOnlyOnline}
            onChange={handleOnlyOnlineToggle}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="onlineFilter" className="cursor-pointer text-sm font-medium text-gray-700 pl-2 pr-4 py-2.5 md:py-0">
            только онлайн
          </label>
        </div>
      </div>
    </div>
  )
})