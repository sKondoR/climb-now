'use client'

import { useState, useRef, useEffect, ReactNode } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { Item } from './Autocomplete.types'
import BaseTemplate from './BaseTemplate'

type RenderItem<T extends Item = any> = (item: T, value: T | null) => ReactNode

interface AutocompleteProps<T extends Item = any> {
  value: T | null
  onChange: (value: T | null) => void
  placeholder?: string
  data: T[]
  label?: string
  labelTitle?: string
  dataLabel?: string
  property?: keyof T | string
  renderItem?: RenderItem<T> | ((item: any, value: any) => ReactNode)
  dropdownWidth?: number
}

export const Autocomplete = <T extends Item = any>({
  value,
  onChange,
  placeholder = '',
  data = [],
  label = '',
  labelTitle = '',
  dataLabel = '',
  property = '',
  renderItem,
  dropdownWidth,
}: AutocompleteProps<T>) => {
  const [isOpen, setIsOpen] = useState(false)
  const [filteredData, setFilteredData] = useState<T[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const getValue = (item: T, prop: keyof T | string): string | T => {
    if (prop && typeof item === 'object' && prop in item) {
      return item[prop as keyof T] as string
    }
    return typeof item === 'object' ? JSON.stringify(item) : item
  }

  const getTemplate = (item: T) => renderItem ? renderItem(item, value!) : BaseTemplate(item as string, value!)

  useEffect(() => {
    if (!value) {
      setFilteredData([])
      return
    }
    const textValue = String(getValue(value, property)).toLowerCase()
    const filtered = data?.filter((item) => {
      const itemValue = String(getValue(item, property)).toLowerCase()
      return itemValue.includes(textValue)
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
    const textValue = e.target.value
    // Если property указан и value - объект, берем свойство, иначе берем строку
    const newValue = value
      ? (property && typeof value === 'object' && property in value
          ? value[property as keyof T]
          : textValue)
      : textValue
    onChange(newValue as T)
    setIsOpen(true)
  }

  const handleCaretClick = () => {
    setFilteredData(data)
    setIsOpen(true)
  }

  const handleSelect = (item: T) => {
    const newValue = property && typeof item === 'object' && property in item
      ? item[property as keyof T]
      : item
    onChange(newValue as T)
    setIsOpen(false)
    setFilteredData([])
  }

  const visibleValue = getValue(value!, property)

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
          value={String(visibleValue)}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
          disabled={!data.length}
        />
        <button
          type="button"
          onClick={handleCaretClick}
          className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none`}
        >
          <FontAwesomeIcon icon={data.length ? faCaretDown : faSpinner} spin={!data.length} />
        </button>
      </div>

      {isOpen && filteredData.length > 0 && (
        <div
          ref={dropdownRef}
          className={`text-sm absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-[500px] overflow-y-auto
          `}
          style={{ minWidth: dropdownWidth ? `${dropdownWidth}px` : undefined }}
        >
        {filteredData.map((item) => {
          const itemValue = getTemplate(item)
          return (
            <button
              key={typeof item === 'object' ? JSON.stringify(item) : item}
              type="button"
              onClick={() => handleSelect(item)}
              className="w-full text-left text-sm text-gray-700 border-b border-b-gray-200 border-r border-r-gray-200"
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
