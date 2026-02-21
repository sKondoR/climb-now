'use client'

import { Group } from '@/types'
import { useState, useEffect } from 'react'
import StatusIcon from './StatusIcon'
import { STATUSES } from '@/lib/constants'
import Table from '../tables/Table'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { observer } from 'mobx-react-lite'
import { mobxStore } from '@/lib/store/mobxStore'
import { isGroupOnline } from './groups.utils'

interface GroupCardProps {
  group: Group
}

export default observer(
function GroupCard({ group }: GroupCardProps) {
  const store = mobxStore()
  const [isExpanded, setIsExpanded] = useState(true)
  const { isOnlyOnline, isCommandFilterEnabled, code, command } = store

  const [activeTab, setActiveTab] = useState<string>(() => {
    if (group.subgroups.length === 0) return '0';
    const onlineSubgroup = group.subgroups.find(s => s.status === STATUSES.ONLINE);
    return onlineSubgroup ? onlineSubgroup.id : group.subgroups[group.subgroups.length - 1].id
  })

  const toggleHeader = () => {
    setIsExpanded(!isExpanded);
  }

  // Sync activeTab with available subgroups
  useEffect(() => {
    if (group.subgroups.length > 0 && !group.subgroups.find(s => s.id === activeTab)) {
      setActiveTab(group.subgroups[0].id)
    }
  }, [group.subgroups, activeTab])

  if (isOnlyOnline && !isGroupOnline(group)) return null
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
    <div className={`${isExpanded ? 'bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow ' : ' '}
     ${isOnline ? 'border-green-500' : 'border-gray-200'}`}>
      <div className={`${!isExpanded ? 'bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow ' : ' '} p-4`}>
        <div className="w-full flex flex-start items-center relative cursor-pointer" onClick={toggleHeader}>
          <h2 className="text-xl font-bold text-gray-900 mr-2">
            {group.title} 
          </h2>
          <StatusIcon status={isOnline} onlyOnline />
          <button
              className="absolute bottom-0 right-0 transform bg-white border border-gray-300 rounded-full w-8 h-8 flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors duration-200 focus:outline-none"
              aria-label={isExpanded ? "Свернуть шапку" : "Развернуть шапку"}
            >
              <FontAwesomeIcon 
                icon={isExpanded ? faChevronUp : faChevronDown} 
                className="text-gray-600 w-3 h-3"
              />
          </button>
        </div>
        <div 
          className={`overflow-hidden transition-all duration-300 ease-in-out  ${
            isExpanded ? 'opacommand-100' : 'max-h-0 opacommand-0'
          }`}
        >
        {/* Табы */}
        <div className="flex flex-wrap space-x-1 mb-1 mt-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id)
              }}
              className={`flex border-2 px-2 py-1 mb-1 rounded-lg text-sm font-medium transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200 ${
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
        <Table
          subGroup={group.subgroups.find(s => s.id === activeTab)}
          code={code}
          isCommandFilterEnabled={isCommandFilterEnabled}
          command={command}
        /> : null}
        </div>
      </div>
    </div>
  )
})