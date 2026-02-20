import { Discipline } from '@/types'
import { makeAutoObservable } from 'mobx'

export class MobxStore {
  code: string = ''
  city: string = ''
  isCityFilterEnabled: boolean = false
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

  setDisciplinesData(data: Discipline[] | null ) {
    console.log('setDisciplinesData', data);
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