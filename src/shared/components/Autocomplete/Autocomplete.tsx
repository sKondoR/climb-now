'use client'

import { useState, useRef, useEffect, useId, ReactNode } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faSpinner } from '@fortawesome/free-solid-svg-icons'

import { Item } from './Autocomplete.types'
import BaseTemplate from './BaseTemplate'

type RenderItem<T extends Item = string | Record<string, unknown>> = (item: T, value: T | null) => ReactNode

interface AutocompleteProps<T extends Item = string | Record<string, unknown>> {
  value: T | null
  onChange: (value: T | null) => void
  placeholder?: string
  data: T[]
  label?: string
  labelTitle?: string
  dataLabel?: string
  property?: keyof T | string
  renderItem?: RenderItem<T>
  dropdownWidth?: number
  isLoading?: boolean
}

export const Autocomplete = <T extends Item = string>({
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
  isLoading = false,
}: AutocompleteProps<T>) => {
  const [isOpen, setIsOpen] = useState(false)
  // true после клика по стрелке — показываем все варианты без фильтра до следующего ввода/выбора
  const [showAll, setShowAll] = useState(false)
  // Вариант, подсвеченный стрелками: фокус остаётся в поле, список только отмечает активный пункт (паттерн combobox)
  const [activeIndex, setActiveIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const listId = useId()
  const getOptionId = (index: number) => `${listId}-option-${index}`

  const getValue = (item: T, prop: keyof T | string): string | T => {
    if (prop && typeof item === 'object' && prop in item) {
      return item[prop as keyof T] as string
    }
    return typeof item === 'object' ? JSON.stringify(item) : item
  }

  const getTemplate = (item: T) => renderItem ? renderItem(item, value!) : BaseTemplate(item as string, value as string)

  const getFilteredData = (): T[] => {
    if (showAll) return data
    if (!value) return []
    const textValue = String(getValue(value, property)).toLowerCase()
    return data?.filter((item) => {
      const itemValue = String(getValue(item, property)).toLowerCase()
      return itemValue.includes(textValue)
    }) || []
  }
  const filteredData = getFilteredData()
  const isListOpen = isOpen && filteredData.length > 0

  useEffect(() => {
    if (activeIndex >= 0) document.getElementById(getOptionId(activeIndex))?.scrollIntoView({ block: 'nearest' })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex])

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
    setShowAll(false)
    setIsOpen(true)
    setActiveIndex(-1)
  }

  const handleCaretClick = () => {
    setShowAll(true)
    setIsOpen(true)
    setActiveIndex(-1)
  }

  const handleSelect = (item: T) => {
    const newValue = property && typeof item === 'object' && property in item
      ? item[property as keyof T]
      : item
    onChange(newValue as T)
    setIsOpen(false)
    setShowAll(false)
    setActiveIndex(-1)
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      // Пустое поле: стрелка открывает весь список, как клик по треугольнику
      if (!isListOpen) {
        if (!filteredData.length) setShowAll(true)
        setIsOpen(true)
        setActiveIndex(e.key === 'ArrowDown' ? 0 : (filteredData.length || data.length) - 1)
        return
      }
      const step = e.key === 'ArrowDown' ? 1 : -1
      setActiveIndex((index) => (index + step + filteredData.length) % filteredData.length)
    } else if (e.key === 'Enter' && isListOpen && filteredData[activeIndex] !== undefined) {
      e.preventDefault()
      handleSelect(filteredData[activeIndex])
    }
  }

  const visibleValue = getValue(value!, property)

  return (
    <div
      className="w-full md:w-auto relative"
      // Фокус ушёл из поля и списка (Tab дальше) — список закрываем, иначе соседние выпадашки открыты одновременно и перекрывают друг друга
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setIsOpen(false)
      }}
      onKeyDown={(e) => {
        if (e.key === 'Escape' && isOpen) {
          setIsOpen(false)
          inputRef.current?.focus()
        }
      }}
    >
      {label && (
        <label
          htmlFor={`autocomplete-${String(property)}`}
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
        <input
          ref={inputRef}
          type="text"
          id={`autocomplete-${String(property)}`}
          value={String(visibleValue)}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleInputKeyDown}
          role="combobox"
          aria-expanded={isListOpen}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={isListOpen && activeIndex >= 0 ? getOptionId(activeIndex) : undefined}
          placeholder={placeholder}
          // Иначе на телефоне поверх нашего списка всплывает автозаполнение браузера, а клавиатура правит коды
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-20"
        />
        <button
          type="button"
          onClick={handleCaretClick}
          className={`absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 rounded focus-ring px-2 py-2`}
          aria-label={label ? `Показать варианты: ${label}` : 'Показать варианты'}
          disabled={!data.length}
        >
          <FontAwesomeIcon icon={isLoading ? faSpinner : faCaretDown} spin={isLoading} />
        </button>
      </div>

      {isListOpen && (
        <div
          ref={dropdownRef}
          id={listId}
          role="listbox"
          aria-label={label || undefined}
          // Фокус остаётся в поле: Safari не фокусирует кнопки по клику, и blur закрыл бы список раньше выбора
          onMouseDown={(e) => e.preventDefault()}
          className={`text-sm absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-[min(500px,50dvh)] overflow-y-auto overscroll-contain
          `}
          // Не шире экрана телефона и не под экранной клавиатурой
          style={{ minWidth: dropdownWidth ? `min(${dropdownWidth}px, calc(100vw - 1.5rem))` : undefined }}
        >
        {filteredData.map((item, index) => {
          const itemValue = getTemplate(item)
          const isActive = index === activeIndex
          return (
            // Не кнопка: внутри combobox пункты не получают фокус, выбор — клик или Enter из поля
            <div
              key={typeof item === 'object' ? JSON.stringify(item) : item}
              id={getOptionId(index)}
              role="option"
              aria-selected={isActive}
              onClick={() => handleSelect(item)}
              onMouseEnter={() => setActiveIndex(index)}
              // Контур рисуется поверх фона шаблона пункта (фон текущего соревнования, выбранного значения)
              className={`w-full cursor-pointer text-left text-sm text-gray-700 border-b border-b-gray-200 border-r border-r-gray-200 ${isActive ? 'outline outline-2 -outline-offset-2 outline-blue-500' : ''}`}
            >
              {itemValue}
            </div>
          )
        })}
        </div>
      )}
    </div>
  )
}

export default Autocomplete
