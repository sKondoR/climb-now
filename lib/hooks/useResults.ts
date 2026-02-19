import { SubGroupData, Results } from '@/types'
import { useState, useEffect } from 'react'

interface UseResultsOptions {
  urlCode: string
  subgroupLink: string
}

interface UseResultsState {
  results: Results
  isLead: boolean | null
  isQualResult: boolean | null
  isLoading: boolean
  error: string | null
}

export default function useResults({ urlCode, subgroupLink }: UseResultsOptions) {
  const [state, setState] = useState<UseResultsState>({
    results: [],
    isLead: null,
    isQualResult: null,
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
      const { data: results, isLead, isQualResult }: SubGroupData = await response.json()
      setState({ results, isLead, isQualResult, isLoading: false, error: null })
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }))
    }
  }

  // Auto-refresh results every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      loadResults()
    }, 30000)
    
    // Load immediately on mount
    loadResults()
    
    return () => clearInterval(interval)
  }, [urlCode, subgroupLink])

  return { ...state, loadResults }
}