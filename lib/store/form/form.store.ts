import { makeAutoObservable } from 'mobx'
import { DEFAULT_TEAM } from '@/lib/constants'
export class FormStore {
  code: string = ''
  command: string = DEFAULT_TEAM
  isCommandFilterEnabled: boolean = false
  isOnlyOnline: boolean = false
  constructor() {
    makeAutoObservable(this)
  }
  setCode(code: string) {
    this.code = code
  }
  setCommand(command: string) {
    this.command = command
  }
  setIsCommandFilterEnabled(enabled: boolean) {
    this.isCommandFilterEnabled = enabled
  }
  setIsOnlyOnline(enabled: boolean) {
    this.isOnlyOnline = enabled
  }
  reset() {
    this.code = ''
    this.command = DEFAULT_TEAM
    this.isCommandFilterEnabled = false
    this.isOnlyOnline = false
  }
}