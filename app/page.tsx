'use client'

import { useState, useEffect } from 'react'
import ResultsForm from '@/components/forms/ResultsForm'
import GroupColumn from '@/components/tables/GroupColumn'
import { ApiResponse } from '@/types'
import { fetchResults, updateAllGroupTables } from '@/lib/api'
import { UPDATE_INTERVAL } from '@/lib/constants'

export default function HomePage() {
  const [groups, setGroups] = useState<ApiResponse | null>(null)
  const [selectedCity, setSelectedCity] = useState('')
  const [urlCode, setUrlCode] = useState('2602vrn')

  // Автоматическое обновление данных
  useEffect(() => {
    const interval = setInterval(() => {
      fetchResults(urlCode)
        .then(data => {
          if (data) {
            setGroups(data)
          }
        })
    }, UPDATE_INTERVAL)

    return () => clearInterval(interval)
  }, [urlCode])

  const handleResultsUpdate = (data: ApiResponse | null) => {
    setGroups(data);
    console.log('data', data);
    if (data) {
      setUrlCode(data.url)
      updateAllGroupTables(data.groups)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="text-2xl font-bold text-gray-900">
              ClimbNow
            </div>
            <div className="text-sm text-gray-500">
              Real-time Climbing Results
            </div>
          </div>
        </div>
      </header>

      {/* Form Section */}
      <section className="bg-white py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ResultsForm 
            onCityChange={setSelectedCity}
            onResultsUpdate={handleResultsUpdate}
          />
        </div>
      </section>

      {/* Results Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {groups && groups.groups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {groups.groups.map((group) => (
              <GroupColumn 
                key={group.id}
                group={group}
                selectedCity={selectedCity}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-2xl font-semibold text-gray-600 mb-4">
              Добро пожаловать в ClimbNow!
            </div>
            <div className="text-gray-500 max-w-md mx-auto">
              Введите код соревнований и город для отображения результатов
            </div>
          </div>
        )}
      </main>
    </div>
  )
}