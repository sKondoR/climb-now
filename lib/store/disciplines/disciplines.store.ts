import { makeAutoObservable } from 'mobx'
import { QueryClient } from '@tanstack/react-query'
import type { Discipline } from '@/types/disciplines'
import { fetchResults } from '@/lib/api'
import { MIN_URL_CODE_LENGTH } from '@/lib/constants'

export class DisciplinesStore {
  private queryClient: QueryClient
  
  groupsData: Discipline[] | null = null
  isGroupsLoading: boolean = false
  groupsError: string | null = null

  constructor(queryClient: QueryClient) {
    this.queryClient = queryClient
    makeAutoObservable(this)
  }

  async fetchGroups(code: string) {
    const url = new URL(window.location.href)
    this.groupsData = null
    this.groupsError = null
    if (code?.length < MIN_URL_CODE_LENGTH) {
      window.history.replaceState({}, document.title, url.pathname)
      this.isGroupsLoading = false
      return
    }
    this.isGroupsLoading = true

    try {
      const data = await fetchResults(code)
      this.groupsData = data
      if (data) {
        url.searchParams.set('code', code)
      } else {
        url.searchParams.delete('code')
      }
      window.history.replaceState({}, document.title, url.pathname + url.search)
    } catch (error) {
      this.groupsError = error instanceof Error ? error.message : 'Unknown error'
    } finally {
      this.setIsGroupsLoading(false)
    }
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


  reset() {
    this.groupsData = null
    this.isGroupsLoading = false
    this.groupsError = null
  }
}