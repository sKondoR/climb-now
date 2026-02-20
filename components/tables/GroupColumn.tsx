import { Group } from '@/types'
import { useState, useEffect } from 'react'
import StatusIcon from '../StatusIcon'
import { STATUSES } from '@/lib/constants'
import Table from './Table'

interface GroupColumnProps {
  group: Group
  command: string
  code: string
  isCommandFilterEnabled: boolean
}

export default function GroupColumn({ group, command, code, isCommandFilterEnabled }: GroupColumnProps) {
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (group.subgroups.length === 0) return '0';
    const onlineSubgroup = group.subgroups.find(s => s.status === STATUSES.ONLINE);
    return onlineSubgroup ? onlineSubgroup.id : group.subgroups[group.subgroups.length - 1].id;
  })

  // Sync activeTab with available subgroups
  useEffect(() => {
    if (group.subgroups.length > 0 && !group.subgroups.find(s => s.id === activeTab)) {
      setActiveTab(group.subgroups[0].id)
    }
  }, [group.subgroups, activeTab])

  const tabs = group.subgroups.map(subgroup => ({
    id: subgroup.id,
    label: subgroup.title,
    status: subgroup.status
  }))

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            {group.title}
          </h2>
        </div>
        
        {/* Табы */}
        <div className="flex flex-wrap space-x-1 mb-3">
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
        
        {/* Контент табов */}
        <Table
          subGroup={group.subgroups.find(s => s.id === activeTab)}
          code={code}
          isCommandFilterEnabled={isCommandFilterEnabled}
          command={command}
        />
      </div>
    </div>
  )
}