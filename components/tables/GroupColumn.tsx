import { Group, Subgroup, SubgroupResults } from '@/types'
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
  const [subgroupResults, setSubgroupResults] = useState<SubgroupResults>({})

  const tabs = group.subgroups.map(subgroup => ({
    id: subgroup.id,
    label: subgroup.title
  }))

  const loadResults = async (subgroup: Subgroup) => {
    if (!subgroup.link) return
    
    setSubgroupResults(prev => ({
      ...prev,
      [subgroup.id]: { results: [], isLoading: true, error: null }
    }))
    try {
      const response = await fetch(`/api/results?urlCode=${urlCode}&subgroup=${subgroup.link}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch results: ${response.statusText}`)
      }
      const { data: results } = await response.json()      
      setSubgroupResults(prev => ({
        ...prev,
        [subgroup.id]: { results, isLoading: false, error: null }
      }))
      
    } catch (error) {
      setSubgroupResults(prev => ({
        ...prev,
        [subgroup.id]: { results: [], isLoading: false, error: error instanceof Error ? error.message : 'Unknown error' }
      }))
    }
  }

  // Load results for current active tab
  useEffect(() => {
    const currentSubgroup = group.subgroups.find(s => s.id === activeTab)
    if (currentSubgroup) {
      loadResults(currentSubgroup)
    }
  }, [activeTab])

  // Auto-refresh results every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const currentSubgroup = group.subgroups.find(s => s.id === activeTab)
      if (currentSubgroup) {
        loadResults(currentSubgroup)
      }
    }, 30000)
    
    return () => clearInterval(interval)
  }, [activeTab, group])

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
                  loadResults(currentSubgroup)
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
          subgroupResults={subgroupResults}
          isCityFilterEnabled={isCityFilterEnabled}
          selectedCity={selectedCity}
        />
      </div>
    </div>
  )
}