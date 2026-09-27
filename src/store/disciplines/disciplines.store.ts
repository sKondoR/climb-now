import { makeAutoObservable } from 'mobx'
import { QueryClient } from '@tanstack/react-query'

import type { Discipline } from '@/shared/types/disciplines'
import { fetchResults, patchEvent } from '@/shared/services'
import { MIN_URL_CODE_LENGTH } from '@/shared/constants'
import { rootStore } from '@/store/root.store'

const getSuffixes = (name?: string) => {
  const suffixes = ['']
  if (name === undefined) {
    return suffixes
  }
  const lowercased = name.toLowerCase()
  if (lowercased.includes('всероссийские')) {
    suffixes.push('_vs')
  }
  if (lowercased.includes('чемпионат')) {
    suffixes.push('_ch')
  } 
  if (lowercased.includes('первенство')) {
    suffixes.push('_perv')
  }
  return suffixes
}

export class DisciplinesStore {
  private queryClient: QueryClient
  
  groupsData: Discipline[] | null = null
  isGroupsLoading: boolean = false
  groupsError: string | null = null
  // Защита от гонки: при наборе кода запросы уходят на каждый символ, учитываем только последний
  private requestId = 0
  private lastRequest: { code: string, name?: string } | null = null

  constructor(queryClient: QueryClient) {
    this.queryClient = queryClient
    makeAutoObservable(this)
  }

  async fetchGroups(code: string, name?: string) {
    const requestId = ++this.requestId
    this.lastRequest = { code, name }
    const url = new URL(window.location.href)
    this.setGroupsData(null)
    this.setGroupsError(null)
    if (code?.length < MIN_URL_CODE_LENGTH) {
      window.history.replaceState({}, document.title, url.pathname)
      this.setIsGroupsLoading(false)
      return
    }
    this.setIsGroupsLoading(true)

    const suffixes = getSuffixes(name)
    let data = null
    let usedCode = code
    let fetchError: unknown = null

    try {
      for (const suffix of suffixes) {
        const currentCode = code + suffix
        try {
          data = await fetchResults(currentCode)
          if (requestId !== this.requestId) return
          if (data) {
            usedCode = currentCode
            break
          }
        } catch (error) {
          if (requestId !== this.requestId) return
          console.error(error)
          fetchError = error
          continue
        }
      }

      // Код, который не удалось проверить из-за сети, не считаем «не найденным»
      if (!data && fetchError) {
        this.setGroupsError('Сайт ФСР не отвечает')
        return
      }

      this.setGroupsData(data)
      if (data) {
        url.searchParams.set('code', usedCode)
        if (usedCode !== code) {
          rootStore.formStore.setCode(usedCode)
          patchEvent(code, usedCode).catch(() => undefined)
        }
      } else {
        url.searchParams.delete('code')
      }
      window.history.replaceState({}, document.title, url.pathname + url.search)
    } catch (error) {
      this.setGroupsError(error instanceof Error ? error.message : 'Unknown error')
    } finally {
      if (requestId === this.requestId) {
        this.setIsGroupsLoading(false)
      }
    }
  }

  // Код последнего запроса: пока он не совпал с кодом из формы, запрос ещё не ушёл и «не найдено» показывать рано
  get requestedCode() {
    return this.lastRequest?.code ?? null
  }

  retryFetchGroups() {
    if (this.lastRequest) {
      this.fetchGroups(this.lastRequest.code, this.lastRequest.name)
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