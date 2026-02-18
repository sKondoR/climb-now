import { useState, useCallback, useEffect } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { ApiResponse } from '@/types/api'
import { fetchResults } from '@/lib/api'
import { parseResultTable } from '@/lib/parsers'
import { DEFAULT_CITY, DEFAULT_URL_CODE } from '@/lib/constants'

interface ResultsFormProps {
  onCityChange: (city: string) => void
  onResultsUpdate: (data: ApiResponse | null) => void
  onCityFilterToggle: (enabled: boolean) => void
}

export default function ResultsForm({ onCityChange, onResultsUpdate, onCityFilterToggle }: ResultsFormProps) {
  const [url, setUrl] = useState(DEFAULT_URL_CODE)
  const [city, setCity] = useState(DEFAULT_CITY)
  const [isCityFilterEnabled, setIsCityFilterEnabled] = useState(false)

  // Debounced fetch для URL
  const debouncedFetch = useDebouncedCallback(
    async (url: string) => {
      try {
        const data = await fetchResults(url)
        onResultsUpdate(data)
      } catch (error) {
        console.error('Ошибка загрузки данных:', error)
        onResultsUpdate(null)
      }
    },
    500
  )

  // Debounced fetch для города
  const debouncedCityFetch = useDebouncedCallback(
    (city: string) => {
      onCityChange(city)
    },
    300
  )

  const handleUrlChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newUrl = e.target.value
      setUrl(newUrl)
      debouncedFetch(newUrl)
    },
    [debouncedFetch]
  )

  const handleCityChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newCity = e.target.value
      setCity(newCity)
      debouncedCityFetch(newCity)
    },
    [debouncedCityFetch]
  )

  const handleCityFilterToggle = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const isEnabled = e.target.checked
      setIsCityFilterEnabled(isEnabled)
      onCityFilterToggle(isEnabled)
    },
    [onCityFilterToggle]
  )
  // Автофокус на поле URL
  useEffect(() => {
    const urlInput = document.getElementById('url') as HTMLInputElement
    if (urlInput) {
      urlInput.focus()
    }
    
    // Начальный запрос если url и city не пустые
    if (url.trim() && city.trim()) {
      fetchResults(url).then(data => {
        onResultsUpdate(data)
      }).catch(error => {
        console.error('Error fetching initial results:', error)
        onResultsUpdate(null)
      })
    }
  }, [])

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label 
            htmlFor="url" 
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            URL соревнований
            <span className="text-xs text-gray-500"> (например, {DEFAULT_URL_CODE})</span>
          </label>
          <div className="relative">
            <input
              type="text"
              id="url"
              value={url}
              onChange={handleUrlChange}
              placeholder="2602vrn"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
            />
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Введите код соревнований из URL
          </p>
        </div>
        
        <div>
          <label 
            htmlFor="city" 
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Город для подсветки
            <span className="text-xs text-gray-500"> (например, {DEFAULT_CITY})</span>
          </label>
          <input
            type="text"
            id="city"
            value={city}
            onChange={handleCityChange}
            placeholder="СПБ"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="mt-1 text-sm text-gray-500">
            Скалолазы из этого города будут подсвечены
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-2 mt-4">
        <input
          type="checkbox"
          id="cityFilter"
          checked={isCityFilterEnabled}
          onChange={handleCityFilterToggle}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="cityFilter" className="text-sm text-gray-700">
          Показывать только скалолазов из города
        </label>
      </div>
    </div>
  )
}