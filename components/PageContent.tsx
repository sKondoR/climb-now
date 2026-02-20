'use client'

import GroupColumn from '@/components/tables/GroupColumn'
import { useState } from 'react'
import DisciplineTabs from './DisciplineTabs'
import { observer } from 'mobx-react-lite'
import { useMobxStore } from '@/lib/store/mobxStore'

export default observer(
function PageContent() {
  const [activeTab, setActiveTab] = useState<number>(0)
  const store = useMobxStore()
  const { isCommandFilterEnabled, command, code, disciplinesData, isDisciplinesLoading } = store;

  const discipline = disciplinesData?.[activeTab];
  if (!discipline) {
    return (<div className="text-center py-12">
      <div className="text-2xl font-semibold text-gray-600 mb-4">
        Добро пожаловать в ClimbNow!
      </div>
      <div className="text-gray-500 max-w-md mx-auto">
        Введите код соревнований и город для отображения результатов
      </div>
    </div>)
  }

  return (<>
      <div>{isDisciplinesLoading}</div>
      <DisciplineTabs
        disciplines={disciplinesData}
        setActiveTab={setActiveTab}
        activeTab={activeTab}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 text-xs md:text-sm">
        {discipline.groups.map((group: any) => (
          <GroupColumn 
            key={group.id}
            group={group}
            command={command}
            code={code}
            isCommandFilterEnabled={isCommandFilterEnabled}
          />
        ))}
      </div>
    </>
  )
})