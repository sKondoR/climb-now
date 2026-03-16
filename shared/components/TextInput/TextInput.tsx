'use client'

import { useState } from 'react'
import { useDebounce } from '@/shared/hooks/useDebounce'
import ShareNamesBtn from '../ShareNamesBtn/ShareNamesBtn'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownLeftAndUpRightToCenter, faUpRightAndDownLeftFromCenter } from '@fortawesome/free-solid-svg-icons'

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
  label = '',
  labelTitle = '',
  dataLabel = '',
  debounceDelay = 800
}: TextInputProps) => {
  const [text, setText] = useState(value)
  const [isOpened, setIsOpened] = useState(false)
  
  const debouncedOnChange = useDebounce(onChange, debounceDelay)

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value || ''
    setText(newValue)
    debouncedOnChange(newValue)
  }

  const handleOpenClick = () => setIsOpened(prev => !prev)

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
            <span className="text-xs text-gray-500"> (например: {dataLabel})</span>
          )}
        </label>
      )}
      <div className="relative">
        <textarea
          id={`TextInput-${label}`}
          value={text}
          onChange={handleInputChange}
          rows={isOpened ? 4 : 1}
          className={`w-full px-3 py-2 pr-20 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none
            ${isOpened ? '' : 'overflow-auto no-scrollbar'}
          `}
          aria-label={label || 'TextInput'}
        />
        <button
          type="button"
          onClick={handleOpenClick}
          className={`absolute right-2 top-0 text-gray-500 hover:text-gray-700 focus:outline-none px-2 py-2`}
          aria-label={`Expand input`}
        >
          <FontAwesomeIcon icon={isOpened ? faDownLeftAndUpRightToCenter : faUpRightAndDownLeftFromCenter} />
        </button>
        <ShareNamesBtn />
      </div>
    </div>
  )
}

export default TextInput