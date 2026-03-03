'use client'

import GroupCard from '@/components/groups/GroupCard'
import { useState } from 'react'
import DisciplineTabs from '../groups/DisciplineTabs'
import { observer } from 'mobx-react-lite'
import { rootStore } from '@/lib/store/root.store'
import { Group } from '@/types'
import { isGroupOnline } from '../groups/groups.utils'

export default observer(
function PageContent() {
  const [activeTab, setActiveTab] = useState<number>(0)
  const { groupsData, isGroupsLoading } = rootStore.disciplinesStore
  const { isOnlyOnline } = rootStore.formStore

   const discipline = groupsData?.[activeTab]
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

  const filteredOnline = isOnlyOnline ? discipline.groups.filter(isGroupOnline) : discipline.groups
  return (<>
      <div>{isGroupsLoading}</div>
      <DisciplineTabs
        disciplines={groupsData}
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