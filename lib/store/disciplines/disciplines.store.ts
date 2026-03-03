import { makeAutoObservable } from 'mobx'
import type { Discipline } from '@/types/disciplines'

export class DisciplinesStore {
  disciplinesData: Discipline[] | null = null
  isDisciplinesLoading: boolean = false

  constructor() {
    makeAutoObservable(this)
  }

  setDisciplinesData(data: Discipline[] | null) {
    this.disciplinesData = data
  }

  setIsDisciplinesLoading(enabled: boolean) {
    this.isDisciplinesLoading = enabled
  }

  reset() {
    this.disciplinesData = null
    this.isDisciplinesLoading = false
  }
}
