import { Discipline, Group } from '@/types'
import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'

interface UseGroupsOptions {
  code: string
  enabled?: boolean
}

interface UseGroupsState {
  disciplines: Discipline[]
  isLoading: boolean
  error: string | null
}

export default function useFetchGroups({ code, enabled = true }: UseGroupsOptions) {
  const [state, setState] = useState<UseGroupsState>({
    disciplines: [],
    isLoading: false,
    error: null
  })

  const fetchGroups = async (): Promise<Discipline[]> => {
    if (!code) {
      throw new Error('code is required')
    }
    const response = await fetch(`/api/groups?code=${code}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch groups: ${response.statusText}`)
    }
    return response.json()
  }

  // Используем useQuery для управления состоянием и запросами
  const query = useQuery({
    queryKey: ['groups', code],
    queryFn: fetchGroups,
    enabled: enabled && !!code,
    refetchInterval: 120000, // Обновление каждые 10 минут
    retry: 3,
    retryDelay: 1000,
  })

  useEffect(() => {
    if (query.isLoading) {
      setState(prev => ({ ...prev, isLoading: true, error: null }))
    } else if (query.error) {
      // Логируем ошибку для диагностики
      console.error('Error in useFetchGroups:', query.error)
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: query.error instanceof Error ? query.error.message : 'Unknown error'
      }))
    } else if (query.data) {
      const disciplines = query.data
      // Извлекаем все группы из всех дисциплин
      const groups = disciplines.flatMap(discipline => discipline.groups)
      setState({ 
        disciplines, 
        isLoading: false, 
        error: null 
      })
    }
  }, [query.isLoading, query.error, query.data])

  return { 
    ...state, 
    refetch: query.refetch,
    disciplines: state.disciplines,
  }
}