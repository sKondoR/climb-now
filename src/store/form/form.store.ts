import { makeAutoObservable } from 'mobx'

import { DEFAULT_TEAM } from '@/shared/constants'

const STORAGE_KEY = 'climbnow-data'

export class FormStore {
  code: string = ''
  command: string = DEFAULT_TEAM
  isCommandFilterEnabled: boolean = false
  names: string = ''
  isNamesFilterEnabled: boolean = false
  isOnlyOnline: boolean = false

  constructor() {
    makeAutoObservable(this)
    this.loadFromStorage()
    this.loadFromUrl()
  }
  setCode(code: string) {
    this.code = code
  }
  loadFromUrl() {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      const names = url.searchParams.get('names')
      const code = url.searchParams.get('code')
      if (code) {
        this.code = code
      }
      if (names) {
        this.isNamesFilterEnabled = true
        this.names = names
        url.searchParams.delete('names')
        window.history.replaceState({}, document.title, url)
      }
    }
  }

  saveToStorage() {
    if (typeof window !== 'undefined') {
      try {
        const data = {
          command: this.command,
          names: this.names,
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      } catch (error) {
        console.error('Failed to save to localStorage:', error)
      }
    }
  }

  loadFromStorage() {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          const data = JSON.parse(stored)
          this.command = data.command ?? DEFAULT_TEAM
          this.names = data.names ?? ''
        }
      } catch (error) {
        console.error('Failed to load from localStorage:', error)
        localStorage.removeItem(STORAGE_KEY)
      }
    }
  }
  setCommand(command: string) {
    this.command = command
    this.saveToStorage()
  }
  setIsCommandFilterEnabled(enabled: boolean) {
    this.isCommandFilterEnabled = enabled
  }
  setNames(names: string) {
    this.names = names
    this.saveToStorage()
  }
  setIsNamesFilterEnabled(enabled: boolean) {
    this.isNamesFilterEnabled = enabled
  }
  setIsOnlyOnline(enabled: boolean) {
    this.isOnlyOnline = enabled
  }
  reset() {
    this.code = ''
    this.command = DEFAULT_TEAM
    this.isCommandFilterEnabled = false
    this.names = ''
    this.isNamesFilterEnabled = false
    this.isOnlyOnline = false
    this.saveToStorage()
  }
}