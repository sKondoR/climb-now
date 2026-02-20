import { Discipline } from '@/types'
import { makeAutoObservable } from 'mobx'
import { DEFAULT_CITY } from '../constants'
export class MobxStore {
  code: string = ''
  city: string = DEFAULT_CITY
  isCityFilterEnabled: boolean = false
  isDisciplinesLoading: boolean = false
  disciplinesData!: Discipline[] | null

  constructor() {
    makeAutoObservable(this)
  }

  setCode(code: string) {
    this.code = code
  }

  setCity(city: string) {
    this.city = city
  }

  setIsCityFilterEnabled(enabled: boolean) {
    this.isCityFilterEnabled = enabled
  }

  setIsDisciplinesLoading(enabled: boolean) {
    this.isDisciplinesLoading = enabled
  }

  setDisciplinesData(data: Discipline[] | null ) {
    this.disciplinesData = data
  }

  reset() {
    this.code = ''
    this.city = ''
    this.isCityFilterEnabled = false
    this.disciplinesData = null
  }
}

export const mobxStore = new MobxStore()