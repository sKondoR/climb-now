import { makeAutoObservable } from 'mobx'

import { DEFAULT_TEAM } from '@/shared/constants'

export class FormStore {
  code: string = ''
  command: string = DEFAULT_TEAM
  isCommandFilterEnabled: boolean = false
  names: string = ''
  isNamesFilterEnabled: boolean = false
  isOnlyOnline: boolean = false
  constructor() {
    makeAutoObservable(this)
  }
  setCode(code: string) {
    this.code = code
  }
  loadCodeFromUrl() {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const code = urlParams.get('code')
      if (code) {
        this.code = code
      }
    }
  }
  setCommand(command: string) {
    this.command = command
  }
  setIsCommandFilterEnabled(enabled: boolean) {
    this.isCommandFilterEnabled = enabled
  }
  setNames(names: string) {
    this.names = names
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
  }
}