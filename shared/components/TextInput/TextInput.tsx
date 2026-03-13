'use client'
import { useEffect, useState } from 'react'
import { useDebounce } from '@/shared/hooks/useDebounce'

interface TextInputProps {
  value: string
  onChange: (names: string) => void
  placeholder?: string
  label?: string
  labelTitle?: string
  dataLabel?: string
  debounceDelay?: number
}

export const TextInput = ({
  value = '',
  onChange = () => {},
  placeholder = '',
  label = '',
  labelTitle = '',
  dataLabel = '',
  debounceDelay = 800
}: TextInputProps) => {
  const [text, setText] = useState(value)
  
  const debouncedOnChange = useDebounce(onChange, debounceDelay)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setText(newValue)
    debouncedOnChange(newValue)
  }

  useEffect(() => {
    setText(value)
  }, [value])

  return (
    <div className="w-full md:w-auto relative">
      {label && (
        <label
          htmlFor={`TextInput-${String(label)}`}
          className="block text-sm font-medium text-gray-700 mb-2"
          title={labelTitle}
        >
          {label}
          {dataLabel && (
            <span className="text-xs text-gray-500"> (например {dataLabel})</span>
          )}
        </label>
      )}
      <div className="relative">
        <input
          type="text"
          id={`TextInput-${String(label)}`}
          value={text}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  )
}

export default TextInput