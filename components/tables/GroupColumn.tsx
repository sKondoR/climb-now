import { Group, Qualification, Result } from '@/types'
import { useState, useEffect } from 'react'
import { parseResultTable } from '@/lib/parsers'

interface GroupColumnProps {
  group: Group
  selectedCity: string,
  urlCode: string
  isCityFilterEnabled: boolean
}

interface QualificationResults {
  [key: string]: {
    results: Result[]
    isLoading: boolean
    error: string | null
  }
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
  const [qualificationResults, setQualificationResults] = useState<QualificationResults>({})
  const isCityMatch = (city: string) => {
    return selectedCity && city.toLowerCase() === selectedCity.toLowerCase()
  }

  const filterResultsByCity = (results: Result[]) => {
    if (!isCityFilterEnabled || !selectedCity) {
      return results
    }
    return results.filter((result, index) => index===0 || isCityMatch(result.command))
  }

  const tabs = group.subgroups.map(subgroup => ({
    id: subgroup.id,
    label: subgroup.title
  }))

  const loadResults = async (subgroup: Qualification) => {
    if (!subgroup.link) return
    
    setQualificationResults(prev => ({
      ...prev,
      [subgroup.id]: { results: [], isLoading: true, error: null }
    }))
    try {
      const response = await fetch(`/api/results/${urlCode}/${subgroup.link}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch results: ${response.statusText}`)
      }
      
      const html = await response.text()
      const results = parseResultTable(html)
      
      setQualificationResults(prev => ({
        ...prev,
        [subgroup.id]: { results, isLoading: false, error: null }
      }))
      
    } catch (error) {
      setQualificationResults(prev => ({
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

  const renderTable = (qualification: Qualification | undefined) => {
    if (!qualification) return null;
    const currentResults = qualificationResults[qualification.id]
    const results = currentResults?.results || qualification.results
    const filteredResults = filterResultsByCity(results)
    const climbedCount = results.filter(result => result.score !== '').length;
    
    // Use subgroup title instead of qualification title to ensure consistency
    const displayTitle = group.subgroups.find(s => s.id === qualification.id)?.title || qualification.title
    
    return (
      <div className="mt-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex justify-between">
          {displayTitle}
          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {climbedCount} / {results.length} пролезло
          </span>
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left px-4 py-2 w-12">Место</th>
                <th className="text-left px-4 py-2 w-12">ст.#</th>
                <th className="text-left px-4 py-2">Имя</th>
                <th className="text-left px-4 py-2">Команда</th>
                <th className="text-left px-4 py-2 w-24">Результат</th>
              </tr>
            </thead>
            <tbody>
              {currentResults?.isLoading && (
                <tr className="border-b">
                  <td colSpan={5} className="px-4 py-4 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span className="text-gray-600">Загрузка результатов...</span>
                    </div>
                  </td>
                </tr>
              )}
              
              {currentResults?.error && (
                <tr className="border-b">
                  <td colSpan={5} className="px-4 py-4 text-center text-red-500">
                    Ошибка загрузки: {currentResults.error}
                  </td>
                </tr>
              )}
              
              {filteredResults.map((result: Result) => (
                <tr
                  key={result.name}
                  className={`border-b transition-colors ${
                    isCityMatch(result.command) ? 'bg-green-300 border-blue-200' : ''
                  }`}
                >
                  <td className="px-4 py-2 text-center font-medium">{result.rank}</td>
                  <td className="px-4 py-2 text-center font-medium">{result.stRank}</td>
                  <td className="px-4 py-2">
                    <span className="font-medium">
                      {result.name}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${
                      isCityMatch(result.command) 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {result.command}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-center">{result.score}</td>
                </tr>
              ))}
              
              {/* Сообщение если нет результатов */}
              {filteredResults.length === 0 && !currentResults?.isLoading && !currentResults?.error && (
                <tr className="border-b">
                  <td colSpan={4} className="px-4 py-4 text-center text-gray-500">
                    Результаты пока не доступны
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Статистика */}
        {filteredResults.length > 0 && (
          <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
            <div>
              Лучший: {filteredResults[0].name}
            </div>
            <div>
              Всего: {filteredResults.length} скалолазов
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            {group.title}
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                const currentSubgroup = group.subgroups.find(s => s.id === activeTab)
                if (currentSubgroup) {
                  loadResults(currentSubgroup)
                }
              }}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Обновить
            </button>
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
        {renderTable(group.subgroups.find(subgroup => subgroup.id === activeTab))}
      </div>
    </div>
  )
}