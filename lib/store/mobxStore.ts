import { Discipline } from '@/types'
import { makeAutoObservable } from 'mobx'
import { DEFAULT_CITY } from '../constants'
export class MobxStore {
  code: string = ''
  command: string = DEFAULT_CITY
  isCommandFilterEnabled: boolean = false
  isDisciplinesLoading: boolean = false
  disciplinesData!: Discipline[] | null

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

  setIsDisciplinesLoading(enabled: boolean) {
    this.isDisciplinesLoading = enabled
  }

  setDisciplinesData(data: Discipline[] | null ) {
    this.disciplinesData = data
  }

  reset() {
    this.code = ''
    this.command = ''
    this.isCommandFilterEnabled = false
    this.disciplinesData = null
  }
}

export const mobxStore = new MobxStore()