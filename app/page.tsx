'use client'

import { useState } from 'react'
import ResultsForm from '@/components/forms/ResultsForm'
import GroupColumn from '@/components/tables/GroupColumn'
import { AllData } from '@/types'
import { DEFAULT_CITY, DEFAULT_URL_CODE } from '@/lib/constants'

export default function HomePage() {
  const [data, setData] = useState<AllData | null>(null)
  const [selectedCity, setSelectedCity] = useState(DEFAULT_CITY)
  const [urlCode, setUrlCode] = useState(DEFAULT_URL_CODE)
  const [isCityFilterEnabled, setIsCityFilterEnabled] = useState(false)

  const handleResultsUpdate = (newData: AllData | null) => {
    setData(newData);
    if (newData) {
      setUrlCode(newData.url)
    }
  }

  const handleCityFilterToggle = (enabled: boolean) => {
    setIsCityFilterEnabled(enabled)
  }

  console.log('data: ', data);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
        </div>
      </header>

      {/* Form Section */}
      <section className="bg-white py-5 border-b border-b-gray-300">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-around items-center">
            <div>
              <div className="text-5xl font-bold bg-gradient-to-r from-teal-500 via-emerald-500 to-blue-500  bg-clip-text text-transparent">
                ClimbNow
              </div>
              <div className="text text-gray-500">
                Real-time Climbing Results
              </div>
            </div>
            <ResultsForm 
              onCityChange={setSelectedCity}
              onResultsUpdate={handleResultsUpdate}
              onCityFilterToggle={handleCityFilterToggle}
            />
          </div>

        </div>
      </section>
            
      {/* Results Section */}
      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {data && data?.data[0]?.groups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 text-sm">
            {data?.data[0]?.groups.map((group) => (
            <GroupColumn 
              key={group.id}
              group={group}
              selectedCity={selectedCity}
              urlCode={urlCode}
              isCityFilterEnabled={isCityFilterEnabled}
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