'use client'

import { useState, useRef, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown } from '@fortawesome/free-solid-svg-icons'

import { rootStore } from '@/lib/store/root.store'
import { DEFAULT_TEAM } from '@/lib/constants'

interface TeamAutocompleteProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export const TeamAutocomplete: React.FC<TeamAutocompleteProps> = ({
  value,
  onChange,
  placeholder = DEFAULT_TEAM,
}) => {
  const teamsStore = rootStore.teamsStore
  const [isOpen, setIsOpen] = useState(false)
  const [filteredTeams, setFilteredTeams] = useState<string[]>([])
  const [allTeams, setAllTeams] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Load all teams and filter teams based on input value
  useEffect(() => {
    if (teamsStore.teams) {
      setAllTeams(teamsStore.teams)
      if (!value) {
        setFilteredTeams([])
        return
      }
      
      const filtered = teamsStore.teams.filter((team) =>
        team.toLowerCase().includes(value.toLowerCase())
      ) || []
      setFilteredTeams(filtered)
    }
  }, [value, teamsStore.teams])

  // Close dropdown when clicking outside
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
    const newValue = e.target.value
    onChange(newValue)
    setIsOpen(true)
  }

  const handleCaretClick = () => {
    // When caret is clicked, show all teams without filtering
    if (teamsStore.teams) {
      setFilteredTeams(teamsStore.teams)
    }
    setIsOpen(true)
  }

  const handleTeamSelect = (team: string) => {
    onChange(team)
    setIsOpen(false)
    // Reset filtered teams when an item is selected
    setFilteredTeams([])
  }

  return (
    <div className="w-full md:w-auto relative">
      <label
        htmlFor="command"
        className="block text-sm font-medium text-gray-700 mb-2"
        title="Скалолазы из команды будут подсвечены"
      >
        команда
        <span className="text-xs text-gray-500"> (например {DEFAULT_TEAM})</span>
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          id="command"
          value={value}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
        />
        {!teamsStore.isTeamsLoading && (<div className="absolute inset-y-0 right-0 flex items-center pr-3">
          <button
            onClick={handleCaretClick}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="Показать все команды"
          >
            <FontAwesomeIcon icon={faCaretDown} className="h-5 w-5" />
          </button>
        </div>)}
        {teamsStore.isTeamsLoading && (
          <div className="absolute right-10 top-2.5">
            <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        )}
      </div>

      {isOpen && (filteredTeams.length > 0 || allTeams.length > 0) && (
        <div
          ref={dropdownRef}
          className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
        >
          {(filteredTeams.length > 0 ? filteredTeams : allTeams).map((team) => (
            <div
              key={team}
              onClick={() => handleTeamSelect(team)}
              className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm text-gray-700"
            >
              {team}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

