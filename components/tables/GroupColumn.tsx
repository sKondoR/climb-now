import { Group } from '@/types'
import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRefresh } from '@fortawesome/free-solid-svg-icons'
import LeadQualTable from './LeadQualTable'

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
    label: subgroup.title
  }))

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            {group.title}
          </h2>
          <div className="flex items-center space-x-2">
            <FontAwesomeIcon icon={faRefresh} 
              className="cursor-pointer px-3 py-1 text-sm text-blue-600 rounded hover:text-blue-800 transition-colors"
              onClick={() => {
                const currentSubgroup = group.subgroups.find(s => s.id === activeTab)
                if (currentSubgroup) {
                }
              }}
            />
          </div>
        </div>
        
        {/* Табы */}
        <div className="flex space-x-1 mb-4">
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id)
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab.label}
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