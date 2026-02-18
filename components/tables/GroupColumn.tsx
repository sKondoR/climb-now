import { Group, Qualification, Result } from '@/types'
import { useState, useEffect } from 'react'
import { parseResultTable } from '@/lib/parsers'

interface GroupColumnProps {
  group: Group
  selectedCity: string
}

interface QualificationResults {
  [key: string]: {
    results: Result[]
    isLoading: boolean
    error: string | null
  }
}

export default function GroupColumn({ group, selectedCity }: GroupColumnProps) {
  const [activeTab, setActiveTab] = useState<'qualification1' | 'qualification2' | 'final'>('qualification1')
  const [qualificationResults, setQualificationResults] = useState<QualificationResults>({})
  const isCityMatch = (city: string) => {
    return city.toLowerCase().includes(selectedCity.toLowerCase())
  }

  const tabs = [
    { id: 'qualification1', label: group.qualification1.title },
    { id: 'qualification2', label: group.qualification2.title },
    { id: 'final', label: group.final.title }
  ]

  const loadResults = async (qualification: Qualification) => {
    if (!qualification.id || !qualification.id.includes('qualification')) return
    
    setQualificationResults(prev => ({
      ...prev,
      [qualification.id]: { results: [], isLoading: true, error: null }
    }))
    
    try {
      const response = await fetch(`https://c-f-r.ru/live/${group.link}/${qualification.id}.html`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch results: ${response.statusText}`)
      }
      
      const html = await response.text()
      const results = parseResultTable(html)
      
      setQualificationResults(prev => ({
        ...prev,
        [qualification.id]: { results, isLoading: false, error: null }
      }))
      
    } catch (error) {
      setQualificationResults(prev => ({
        ...prev,
        [qualification.id]: { results: [], isLoading: false, error: error instanceof Error ? error.message : 'Unknown error' }
      }))
    }
  }

  useEffect(() => {
    const currentQualification = activeTab === 'qualification1' ? group.qualification1 :
                              activeTab === 'qualification2' ? group.qualification2 :
                              group.final
    loadResults(currentQualification)
  }, [activeTab, group])

  useEffect(() => {
    const interval = setInterval(() => {
      const currentQualification = activeTab === 'qualification1' ? group.qualification1 :
                                activeTab === 'qualification2' ? group.qualification2 :
                                group.final
      loadResults(currentQualification)
    }, 30000)
    
    return () => clearInterval(interval)
  }, [activeTab, group])

  const renderTable = (qualification: Qualification) => {
    const currentResults = qualificationResults[qualification.id]
    const results = currentResults?.results || qualification.results
    
    return (
      <div className="mt-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex justify-between">
          {qualification.title}
          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {results.length} пролезло
          </span>
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left px-4 py-2 w-12">#</th>
                <th className="text-left px-4 py-2">Имя</th>
                <th className="text-left px-4 py-2">Команда</th>
                <th className="text-left px-4 py-2 w-24">Результат</th>
              </tr>
            </thead>
            <tbody>
              {currentResults?.isLoading && (
                <tr className="border-b">
                  <td colSpan={4} className="px-4 py-4 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span className="text-gray-600">Загрузка результатов...</span>
                    </div>
                  </td>
                </tr>
              )}
              
              {currentResults?.error && (
                <tr className="border-b">
                  <td colSpan={4} className="px-4 py-4 text-center text-red-500">
                    Ошибка загрузки: {currentResults.error}
                  </td>
                </tr>
              )}
              
              {results.map((result: Result) => (
                <tr
                  key={result.name}
                  className={`border-b hover:bg-gray-50 transition-colors ${
                    isCityMatch(result.city) ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                >
                  <td className="px-4 py-2 text-center font-medium">{result.rank}</td>
                  <td className="px-4 py-2">
                    <span className="font-medium">
                      {result.name}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${
                      isCityMatch(result.city) 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {result.city}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-center">{result.points}</td>
                </tr>
              ))}
              
              {/* Сообщение если нет результатов */}
              {results.length === 0 && !currentResults?.isLoading && !currentResults?.error && (
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
        {results.length > 0 && (
          <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
            <div>
              Лучший: {results[0].name}
            </div>
            <div>
              Всего: {results.length} скалолазов
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
            <span className="text-sm text-gray-500">
              {group.qualification1.results.length + 
               group.qualification2.results.length + 
               group.final.results.length} всего
            </span>
            <button
              onClick={() => loadResults(activeTab === 'qualification1' ? group.qualification1 :
                                        activeTab === 'qualification2' ? group.qualification2 :
                                        group.final)}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Обновить
            </button>
          </div>
        </div>
        
        {/* Табы */}
        <div className="flex space-x-1 mb-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'qualification1' | 'qualification2' | 'final')}
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
        {activeTab === 'qualification1' && renderTable(group.qualification1)}
        {activeTab === 'qualification2' && renderTable(group.qualification2)}
        {activeTab === 'final' && renderTable(group.final)}
      </div>
    </div>
  )
}