import { SubGroupData, Results } from '@/types'
import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'

interface UseResultsOptions {
  code: string
  isOnline: boolean
  subgroupLink: string
}

interface UseResultsState {
  results: Results
  isLead: boolean
  isQualResult: boolean
  isFinal: boolean
  isBoulder: boolean
  isLoading: boolean
  error: string | null
}

export default function useResults({ code, subgroupLink, isOnline }: UseResultsOptions) {
  const [state, setState] = useState<UseResultsState>({
    results: [],
    isLead: false,
    isQualResult: false,
    isFinal: false,
    isBoulder: false,
    isLoading: false,
    error: null
  })

  const fetchResults = async (): Promise<SubGroupData> => {
    if (!subgroupLink) {
      throw new Error('subgroupLink is required')
    }
    const response = await fetch(`/api/results?code=${code}&subgroup=${subgroupLink}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch results: ${response.statusText}`)
    }
    return response.json()
  }

  // Используем useQuery для управления состоянием и запросами
  const query = useQuery({
    queryKey: ['results', code, subgroupLink],
    queryFn: fetchResults,
    enabled: !!subgroupLink && isOnline,
    refetchInterval: isOnline ? 30000 : false, // Обновление каждые 30 секунд только при isOnline=true
    retry: 3,
    retryDelay: 1000,
  })

  useEffect(() => {
    if (query.isLoading) {
      setState(prev => ({ ...prev, isLoading: true, error: null }))
    } else if (query.error) {
      // Логируем ошибку для диагностики
      console.error('Error in useResults:', query.error)
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: query.error instanceof Error ? query.error.message : 'Unknown error'
      }))
    } else if (query.data) {
      const { data: results, isLead, isQualResult, isFinal, isBoulder } = query.data
      setState({ results, isLead, isQualResult, isFinal, isBoulder, isLoading: false, error: null })
    }
  }, [query.isLoading, query.error, query.data])

  // Для случая isOnline=false, мы делаем только один запрос при монтировании компонента
  useEffect(() => {
    if (!isOnline && subgroupLink) {
      // Вызываем запрос вручную один раз
      query.refetch()
    }
  }, [isOnline, subgroupLink, query.refetch])

  return { ...state, refetch: query.refetch }
}