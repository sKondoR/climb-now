import { SubGroupData, Results, LeadResultsItem } from '@/types'
import { useState, useEffect } from 'react'

interface UseResultsOptions {
  urlCode: string
  subgroupLink: string
}

interface UseResultsState {
  results: Results
  isLead: boolean
  isQualResult: boolean
  isFinal: boolean
  isLoading: boolean
  error: string | null
}

export default function useResults({ urlCode, subgroupLink }: UseResultsOptions) {
  const [state, setState] = useState<UseResultsState>({
    results: [],
    isLead: false,
    isQualResult: false,
    isFinal: false,
    isLoading: false,
    error: null
  })

  const loadResults = async () => {
    if (!subgroupLink) return
    
    setState(prev => ({ ...prev, isLoading: true, error: null }))
    try {
      const response = await fetch(`/api/results?urlCode=${urlCode}&subgroup=${subgroupLink}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch results: ${response.statusText}`)
      }
      const { data: results, isLead, isQualResult, isFinal }: SubGroupData = await response.json()
      setState({ results, isLead, isQualResult, isFinal, isLoading: false, error: null })
    } catch (error) {
      // Логируем ошибку для диагностики
      console.error('Error in loadResults:', error)
      // Проверяем, является ли ошибка таймаутом
      if (error instanceof Error && error.name === 'AbortError') {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Request timeout. Please try again later.'
        }))
      } else {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }))
      }
    }
  }

  // Auto-refresh results every 30 seconds
  useEffect(() => {
    loadResults();
  }, [urlCode, subgroupLink])

  return { ...state, loadResults }
}