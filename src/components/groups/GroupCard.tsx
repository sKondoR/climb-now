'use client'

import { Group } from '@/src/shared/types'
import { useState, useEffect } from 'react'
import StatusIcon from './StatusIcon'
import { STATUSES } from '@/src/shared/constants'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { observer } from 'mobx-react-lite'
import { rootStore } from '@/src/store/root.store'

import { LazyLoader } from './LazyLoader'
// Статический импорт: ленивый чанк таблицы (~4 КБ) добавлял отдельный запрос перед загрузкой результатов
import Table from '../tables/Table'
import ErrorBoundary from '@/src/shared/components/ErrorBoundary/ErrorBoundary'

interface GroupCardProps {
  group: Group
}

export default observer(
function GroupCard({ group }: GroupCardProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const { isCommandFilterEnabled, code, command, isNamesFilterEnabled, names } = rootStore.formStore

  const [activeTab, setActiveTab] = useState<string>(() => {
    if (group.subgroups.length === 0) return '0';
    const onlineSubgroup = group.subgroups.find(s => s.status === STATUSES.ONLINE);
    return onlineSubgroup ? onlineSubgroup.id : group.subgroups[group.subgroups.length - 1].id
  })

  const toggleHeader = () => {
    setIsExpanded(!isExpanded);
  }

  useEffect(() => {
    if (group.subgroups.length > 0 && !group.subgroups.find(s => s.id === activeTab)) {
      setActiveTab(group.subgroups[0].id)
    }
  }, [group.subgroups, activeTab])

  let isOnline = null;
  const tabs = group.subgroups.map(subgroup => {
    if (subgroup.status === STATUSES.ONLINE) isOnline = STATUSES.ONLINE
    return {
      id: subgroup.id,
      label: subgroup.title,
      status: subgroup.status
    }
  })  

  return (
      <div className={`
        ${isExpanded ? 'bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow ' : ' '}
        ${isExpanded && !isCommandFilterEnabled ? 'min-h-[400px] ' : ' '}
        ${isOnline ? 'border-live ' : 'border-gray-200 '}`}
      >
        <div className={`p-3 md:p-4
          ${!isExpanded ? 'bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow ' : ' '}
          ${isOnline ? 'border-live' : 'border-gray-200'}`}
        >
          <div className="w-full flex items-center relative cursor-pointer pr-10" onClick={toggleHeader}>
            <h2 className="text-xl font-bold text-gray-900 mr-2 min-w-0 break-words">
              {group.title} 
            </h2>
            <StatusIcon status={isOnline} onlyOnline />
            <button
                className="absolute bottom-0 right-0 transform before:absolute before:content-[''] before:-inset-1.5 bg-white border border-gray-300 rounded-full w-8 h-8 flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors duration-200 focus-ring"
                aria-label={isExpanded ? "Свернуть группу" : "Развернуть группу"}
                aria-expanded={isExpanded}
              >
                <FontAwesomeIcon 
                  icon={isExpanded ? faChevronUp : faChevronDown} 
                  className="text-gray-600 w-3 h-3"
                />
            </button>
          </div>
          <LazyLoader>
          <div
            inert={!isExpanded}
            className={`overflow-hidden transition-all duration-300 ease-in-out  ${
              isExpanded ? 'opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
          {/* Табы */}
          <div className="flex flex-wrap gap-x-1 mb-1 mt-2" role="group" aria-label={`Протоколы: ${group.title}`}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                aria-pressed={activeTab === tab.id}
                onClick={() => {
                  setActiveTab(tab.id)
                }}
                className={`flex items-center border-2 px-2 py-2 md:py-1 mb-1 rounded-lg text-sm font-medium transition-colors focus-ring focus-visible:ring-inset bg-gray-100 text-gray-700 hover:bg-gray-200 ${
                  activeTab === tab.id
                    ? 'border-blue-600'
                    : 'border-gray-100'
                }`}
              > 
                <StatusIcon status={tab.status} />
                <div>{tab.label}</div>
              </button>
            ))}
          </div>
          
          {isExpanded ?
          <ErrorBoundary resetKey={`${code}/${activeTab}`}>
          <Table
            subGroup={group.subgroups.find(s => s.id === activeTab)}
            code={code}
            isCommandFilterEnabled={isCommandFilterEnabled}
            command={command}
            isNamesFilterEnabled={isNamesFilterEnabled}
            names={names}            
          />
          </ErrorBoundary> : null}
          </div>
          </LazyLoader>
        </div>
      </div>
  )
})