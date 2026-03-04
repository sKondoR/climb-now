'use client'

import { useState, useRef, useEffect, ReactNode } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown } from '@fortawesome/free-solid-svg-icons'

interface AutocompleteProps {
  value: any
  onChange: (value: any) => void
  placeholder?: string
  data: any[]
  label?: string
  labelTitle?: string
  dataLabel?: string
  property?: string
  renderItem?: (item: any) => ReactNode | string
}

interface DataItem<T = any> {
  [key: string]: T
}

export const Autocomplete: React.FC<AutocompleteProps> = ({
  value,
  onChange,
  placeholder = '',
  data = [],
  label = '',
  labelTitle = '',
  dataLabel = '',
  property = '',
  renderItem,
}: AutocompleteProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [filteredData, setFilteredData] = useState<any[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const getValue = (val: any | string, prop: string) => prop && typeof val === 'object' ? (val as any)[prop] : (typeof val === 'object' ? JSON.stringify(val) : val)
  const getTemplate = (val: any | string, prop: string) => prop && typeof val === 'object' && renderItem ? renderItem((val as any)) : val

  useEffect(() => {
    if (!value) {
      setFilteredData([])
      return
    }
    const text = getValue(value, property)
    const filtered = data?.filter((item) => {
      const itemString = getValue(item, property)
      return itemString.toLowerCase().includes(text.toLowerCase())
    }) || []
    setFilteredData(filtered)
  }, [value, data, property])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = getValue(e.target.value, property)
    onChange(newValue)
    setIsOpen(true)
  }

  const handleCaretClick = () => {
    setFilteredData(data)
    setIsOpen(true)
  }

  const handleSelect = (item: any) => {
    onChange(getValue(item, property))
    setIsOpen(false)
    setFilteredData([])
  }

  const visibleValue = getValue(value, property)

  return (
    <div className="w-full md:w-auto relative">
      {label && (
        <label
          htmlFor="autocomplete-input"
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
          ref={inputRef}
          type="text"
          id="autocomplete-input"
          value={visibleValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
        />
        <button
          type="button"
          onClick={handleCaretClick}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <FontAwesomeIcon icon={faCaretDown} />
        </button>
      </div>

      {isOpen && filteredData.length > 0 && (
        <div
          ref={dropdownRef}
          className="text-sm absolute z-10 w-auto md:w-[400px] mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
        >
        {filteredData.map((item) => {
          const itemValue = getTemplate(item, property)
          return (
            <button
              key={typeof item === 'object' ? JSON.stringify(item) : item}
              type="button"
              onClick={() => handleSelect(item)}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none border-b border-b-gray-200"
            >
              {itemValue}
            </button>
          )
        })}
        </div>
      )}
    </div>
  )
}
