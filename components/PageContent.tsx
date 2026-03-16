'use client'

import { useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import dynamic from 'next/dynamic'

import { rootStore } from '@/store/root.store'

import { MIN_URL_CODE_LENGTH } from '@/shared/constants'
import { Group } from '@/shared/types'

import { isGroupOnline } from './groups/groups.utils'

const DisciplineTabs = dynamic(
  () => import('./groups/DisciplineTabs'),
  { ssr: false }
)

const GroupCard = dynamic(
  () => import('./groups/GroupCard'),
  { ssr: false }
)

export default observer(
function PageContent() {
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

  if (disciplinesStore.isGroupsLoading) {
    return (<div className="text-center py-12">
      <div className="text-2xl font-semibold text-gray-600 mb-4">
        загрузка...
      </div>
    </div>)
  }

  if (formStore.code.length >= MIN_URL_CODE_LENGTH && !disciplinesStore.isGroupsLoading && disciplinesStore.groupsData === null) {
    return (<div className="text-center py-12">
      <div className="text-2xl font-semibold text-gray-600 mb-4">
        Соревнование не найденно
      </div>
    </div>)
  }

  if (formStore.code.length >= MIN_URL_CODE_LENGTH && !disciplinesStore.isGroupsLoading && !disciplinesStore.groupsData?.length) {
    return (<div className="text-center py-12">
      <div className="text-2xl font-semibold text-gray-600 mb-4">
        Нет данных по этому соревнованию
      </div>
    </div>)
  }

  const discipline = disciplinesStore.groupsData?.[activeTab]
  if (!discipline) {
    return (<div className="text-center py-12">
      <div className="text-2xl font-semibold text-gray-600 mb-4">
        Добро пожаловать в ClimbNow!
      </div>
      <div className="text-gray-500 max-w-md mx-auto">
        Введите код соревнований и свою команду для отображения результатов
      </div>
    </div>)
  }

  const filteredOnline = formStore.isOnlyOnline ? discipline.groups.filter(isGroupOnline) : discipline.groups
  return (<>
      <div>{disciplinesStore.isGroupsLoading}</div>
      <DisciplineTabs
        disciplines={disciplinesStore.groupsData}
        setActiveTab={setActiveTab}
        activeTab={activeTab}
      />
      {!filteredOnline.length && discipline.groups.length ?
          <div className="text-md text-center">нет онлайн групп</div> : null}
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