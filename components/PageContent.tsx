'use client'

import GroupColumn from '@/components/tables/GroupColumn'
import { useState, useEffect } from 'react'
import DisciplineTabs from './DisciplineTabs'
import { observer } from 'mobx-react-lite';
import { mobxStore } from '@/lib/store/mobxStore'

export default observer(
function PageContent() {
  const [activeTab, setActiveTab] = useState<number>(0)
  const { isCityFilterEnabled, city, code, disciplinesData } = mobxStore;

  // Дополнительный observer для disciplinesData
  useEffect(() => {
    console.log('disciplinesData updated:', disciplinesData);
  }, [disciplinesData]);

  console.log('mobxStore: ', mobxStore.disciplinesData)
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
      <DisciplineTabs
        disciplines={disciplinesData}
        setActiveTab={setActiveTab}
        activeTab={activeTab}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 text-sm">
        {discipline.groups.map((group) => (
          <GroupColumn 
            key={group.id}
            group={group}
            city={city}
            code={code}
            isCityFilterEnabled={isCityFilterEnabled}
          />
        ))}
      </div>
    </>
  )
})