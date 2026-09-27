'use client'

import { ReactNode, useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'

import { rootStore } from '@/src/store/root.store'

import { MIN_URL_CODE_LENGTH } from '@/src/shared/constants'
import { Group } from '@/src/shared/types'

import Button from '@/src/shared/components/Button/Button'
import StateMessage from '@/src/shared/components/StateMessage/StateMessage'

import { isGroupOnline } from './groups/groups.utils'
// Статически: ленивые чанки грузились только после ответа с группами и выстраивались в цепочку перед запросом результатов.
// Серверного рендера всё равно нет — до монтирования компонент возвращает null
import DisciplineTabs from './groups/DisciplineTabs'
import GroupCard from './groups/GroupCard'

export default observer(
function PageContent({ footer }: { footer?: ReactNode }) {
  const [activeTab, setActiveTab] = useState<number>(0)
  const [isMounted, setIsMounted] = useState<boolean>(false)
  const disciplinesStore = rootStore.disciplinesStore
  const formStore= rootStore.formStore

  useEffect(() => {
      setActiveTab(0)
  }, [formStore.code])

  useEffect(() => {
      setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  // Подвал показываем вместе с итоговым состоянием: если он стоит внизу пустой страницы, пришедшие группы его сдвигают (CLS)
  const withFooter = (content: ReactNode) => <>{content}{footer}</>

  // Запрос групп запускает форма, а её чанк грузится отдельно: до этого код из ссылки уже есть, а данных ещё нет
  const isFetchPending = formStore.code.length >= MIN_URL_CODE_LENGTH && disciplinesStore.requestedCode !== formStore.code
  if (disciplinesStore.isGroupsLoading || isFetchPending) {
    return <StateMessage role="status" title="Загружаем соревнование…" />
  }

  if (formStore.code.length >= MIN_URL_CODE_LENGTH && disciplinesStore.groupsError) {
    return withFooter(
      <StateMessage
        role="alert"
        title="Не удалось загрузить соревнование"
        action={<Button onClick={() => disciplinesStore.retryFetchGroups()}>Повторить</Button>}
      >
        Сайт ФСР не отвечает или пропало соединение. Проверьте интернет и попробуйте ещё раз.
      </StateMessage>
    )
  }

  if (formStore.code.length >= MIN_URL_CODE_LENGTH && !disciplinesStore.isGroupsLoading && disciplinesStore.groupsData === null) {
    return withFooter(
      <StateMessage title="Соревнование не найдено">
        Проверьте код: он указан в адресе страницы онлайн-результатов на c-f-r.ru. Можно вставить эту ссылку целиком.
      </StateMessage>
    )
  }

  if (formStore.code.length >= MIN_URL_CODE_LENGTH && !disciplinesStore.isGroupsLoading && !disciplinesStore.groupsData?.length) {
    return withFooter(
      <StateMessage title="Протоколов пока нет">
        Соревнование найдено, но результаты ещё не опубликованы. Загляните позже.
      </StateMessage>
    )
  }

  const discipline = disciplinesStore.groupsData?.[activeTab]
  if (!discipline) {
    return withFooter(
      <StateMessage title="Добро пожаловать в ClimbNow!">
        Выберите соревнование из списка или введите его код. Укажите свою команду — её скалолазы будут подсвечены в протоколах.
      </StateMessage>
    )
  }

  const filteredOnline = formStore.isOnlyOnline ? discipline.groups.filter(isGroupOnline) : discipline.groups
  return withFooter(<>
      {/* Дисциплина остаётся на виду при прокрутке длинного списка групп */}
      <div className="sticky top-0 z-20 -mx-3 px-3 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 pt-1 mb-2 bg-gray-50">
      <DisciplineTabs
        disciplines={disciplinesStore.groupsData}
        setActiveTab={setActiveTab}
        activeTab={activeTab}
      />
      </div>
      {!filteredOnline.length && discipline.groups.length ?
          <div className="text-base text-center text-gray-600 py-6 max-w-md mx-auto">Сейчас ни одна группа не выступает. Снимите галочку «только онлайн», чтобы увидеть все.</div> : null}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 text-xs md:text-sm">
        {filteredOnline.map((group: Group) => (
          <GroupCard
            key={group.id}
            group={group}
          />
        ))}
      </div>
    </>
  )
})