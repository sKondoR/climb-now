import { makeAutoObservable, runInAction } from 'mobx'
import { QueryClient } from '@tanstack/react-query'
import type { Discipline } from '@/types/disciplines'
import { fetchResults } from '@/lib/api'

interface GroupsQueryData {
  code: string
  data: Discipline[] | null
  isLoading: boolean
  error: string | null
}

export class DisciplinesStore {
  private queryClient: QueryClient
  
  disciplinesData: Discipline[] | null = null
  isDisciplinesLoading: boolean = false
  error: string | null = null
  groupsData: Discipline[] | null = null
  isGroupsLoading: boolean = false
  groupsError: string | null = null

  constructor(queryClient: QueryClient) {
    this.queryClient = queryClient
    makeAutoObservable(this)
  }

  async fetchDisciplines(code: string) {
    this.setIsDisciplinesLoading(true)
    this.setDisciplinesData(null)
    this.error = null

    try {
      const data = await fetchResults(code)
      this.setDisciplinesData(data)
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Unknown error'
    } finally {
      this.setIsDisciplinesLoading(false)
    }
  }

  async fetchGroups(code: string) {
    this.setIsGroupsLoading(true)
    this.setGroupsData(null)
    this.groupsError = null

    try {
      const data = await fetchResults(code)
      this.setGroupsData(data)
    } catch (error) {
      this.groupsError = error instanceof Error ? error.message : 'Unknown error'
    } finally {
      this.setIsGroupsLoading(false)
    }
  }

  refetchDisciplines() {
    this.queryClient.refetchQueries({ queryKey: ['disciplines'] })
  }

  invalidateDisciplines() {
    this.queryClient.invalidateQueries({ queryKey: ['disciplines'] })
  }

  refetchGroups() {
    this.queryClient.refetchQueries({ queryKey: ['groups'] })
  }

  invalidateGroups() {
    this.queryClient.invalidateQueries({ queryKey: ['groups'] })
  }

  setGroupsData(data: Discipline[] | null) {
    this.groupsData = data
  }

  setIsGroupsLoading(enabled: boolean) {
    this.isGroupsLoading = enabled
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
    this.error = null
    this.groupsData = null
    this.isGroupsLoading = false
    this.groupsError = null
  }
}