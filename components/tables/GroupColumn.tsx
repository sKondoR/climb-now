import { Group } from '@/types'
import { useState, useEffect } from 'react'
import LeadQualTable from './LeadQualTable'
import StatusIcon from '../StatusIcon'

interface GroupColumnProps {
  group: Group
  selectedCity: string,
  urlCode: string
  isCityFilterEnabled: boolean
}

export default function GroupColumn({ group, selectedCity, urlCode, isCityFilterEnabled }: GroupColumnProps) {
  const [activeTab, setActiveTab] = useState<string>(
    group.subgroups.length > 0 ? group.subgroups[0].id : '0'
  )

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
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            {group.title}
          </h2>
        </div>
        
        {/* Табы */}
        <div className="flex space-x-1 mb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id)
              }}
              className={`flex border-2 px-4 py-1 rounded-lg text-sm font-medium transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200 ${
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
        <LeadQualTable
          subGroup={group.subgroups.find(s => s.id === activeTab)}
          urlCode={urlCode}
          isCityFilterEnabled={isCityFilterEnabled}
          selectedCity={selectedCity}
        />
      </div>
    </div>
  )
}