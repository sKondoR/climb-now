import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'

import { SubGroupData, Results } from '@/shared/types'

interface UseResultsOptions {
  code: string
  isOnline: boolean
  subgroupLink?: string
}

interface UseResultsState {
  results: Results
  isLead: boolean
  isQualResult: boolean
  isFinal: boolean
  isBoulder: boolean
  isSpeed: boolean
  isLoading: boolean
  error: string | null
}

export default function useFetchResults({ code, subgroupLink, isOnline }: UseResultsOptions) {
  const fetchResults = async (): Promise<SubGroupData> => {
    if (!subgroupLink) {
      throw new Error('subgroupLink is required')
    }
    let response: Response
    try {
      response = await fetch(`/api/results?code=${encodeURIComponent(code)}&subgroup=${encodeURIComponent(subgroupLink)}`)
    } catch {
      throw new Error('Нет соединения с интернетом')
    }
    if (!response.ok) {
      throw new Error(response.status === 404 ? 'Протокол не найден на сайте ФСР' : 'Сайт ФСР не отвечает')
    }
    return response.json()
  }

  // Используем useQuery для управления состоянием и запросами
  const query = useQuery({
    queryKey: ['results', code, subgroupLink],
    queryFn: fetchResults,
    // Завершённый протокол не меняется: при переключении табов и разворачивании группы берём его из кеша, а не с сайта ФСР
    enabled: !!subgroupLink,
    refetchInterval: isOnline ? 30000 : false, // Обновление каждые 30 секунд только при isOnline=true
    retry: 3,
    retryDelay: 1000,
  })

  useEffect(() => {
    if (query.error) {
      // Логируем ошибку для диагностики
      console.error('Error in useFetchResults:', query.error)
    }
  }, [query.error])

  // React Query сохраняет последние data при ошибке обновления, поэтому результаты не пропадают
  const state: UseResultsState = {
    results: query.data?.data ?? [],
    isLead: query.data?.isLead ?? false,
    isQualResult: query.data?.isQualResult ?? false,
    isFinal: query.data?.isFinal ?? false,
    isBoulder: query.data?.isBoulder ?? false,
    isSpeed: query.data?.isSpeed ?? false,
    isLoading: query.isLoading,
    error: query.error ? (query.error instanceof Error ? query.error.message : 'Unknown error') : null
  }

  return { ...state, refetch: query.refetch }
}