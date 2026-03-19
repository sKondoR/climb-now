import { makeAutoObservable } from 'mobx'
import { QueryClient } from '@tanstack/react-query'

import type { Discipline } from '@/shared/types/disciplines'
import { fetchResults } from '@/shared/services'
import { MIN_URL_CODE_LENGTH } from '@/shared/constants'

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
    this.setGroupsData(null)
    this.setGroupsError(null)
    if (code?.length < MIN_URL_CODE_LENGTH) {
      window.history.replaceState({}, document.title, url.pathname)
      this.setIsGroupsLoading(false)
      return
    }
    this.setIsGroupsLoading(true)

    try {
      const data = await fetchResults(code)
      this.setGroupsData(data)
      if (data) {
        url.searchParams.set('code', code)
      } else {
        url.searchParams.delete('code')
      }
      window.history.replaceState({}, document.title, url.pathname + url.search)
    } catch (error) {
      this.setGroupsError(error instanceof Error ? error.message : 'Unknown error')
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

  setGroupsError(error: string | null) {
    this.groupsError = error
  }

  reset() {
    this.setGroupsData(null)
    this.setIsGroupsLoading(false)
    this.setGroupsError(null)
  }
}