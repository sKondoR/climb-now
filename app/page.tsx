'use client'

import { useState } from 'react'
import ResultsForm from '@/components/forms/ResultsForm'
import { AllData } from '@/types'
import { DEFAULT_CITY, DEFAULT_URL_CODE } from '@/lib/constants'
import PageContent from '@/components/PageContent'
import DisciplineTabs from '@/components/DisciplineTabs'

export default function HomePage() {
  const [data, setData] = useState<AllData | null>(null)
  const [selectedCity, setSelectedCity] = useState(DEFAULT_CITY)
  const [urlCode, setUrlCode] = useState(DEFAULT_URL_CODE)
  const [isCityFilterEnabled, setIsCityFilterEnabled] = useState(false)
  const [activeTab, setActiveTab] = useState<number>(0)

  const handleResultsUpdate = (newData: AllData | null) => {
    setData(newData)
    if (newData) {
      setUrlCode(newData.url)
    }
  }

  const handleCityFilterToggle = (enabled: boolean) => {
    setIsCityFilterEnabled(enabled)
  }

  return (
    <div className="min-h-screen bg-gray-50">
     {/* Form Section */}
      <header className="bg-white py-5 border-b border-b-gray-300">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-around items-center">
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
      </header>

          
      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DisciplineTabs
          disciplines={data?.data}
          setActiveTab={setActiveTab}
          activeTab={activeTab}
        />
        <PageContent
          discipline={data?.data[activeTab]}
          selectedCity={selectedCity}
          urlCode={urlCode}
          isCityFilterEnabled={isCityFilterEnabled}
        />
      </main>
    </div>
  )
}