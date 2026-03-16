'use client'

import { useEffect, useState } from 'react'
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

  const handleInputChange = (e: React.InputEvent<HTMLDivElement>) => {
    const newValue = e.currentTarget.textContent || ''
    setText(newValue)
    debouncedOnChange(newValue)
  }

  const handleOpenClick = () => setIsOpened(prev => !prev)

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
            <span className="text-xs text-gray-500"> (например: {dataLabel})</span>
          )}
        </label>
      )}
      <div className="relative">
        <div
          className={`w-full px-3 py-2 pr-20 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500
            ${isOpened ? '' : ''}
          `}
        >
          <div
            role="textbox" 
            contentEditable
            // toDo: check
            dangerouslySetInnerHTML={{ __html: text }}
            onInput={handleInputChange}
            className={`no-scrollbar focus:outline-none
              ${isOpened ? '' : 'text-nowrap overflow-auto'}
            `}
          />          
        </div>
        <button
          type="button"
          onClick={handleOpenClick}
          className={`absolute right-0 top-0 text-gray-500 hover:text-gray-700 focus:outline-none px-2 py-2`}
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