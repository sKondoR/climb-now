import { ApiResponse } from '@/types'

export const fetchResults = async (urlCode: string): Promise<ApiResponse | null> => {
  try {
    const response = await fetch(`/api/groups?urlCode=${urlCode}`)
    
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    
    const data = await response.json();
    return data as ApiResponse
    
  } catch (error) {
    console.error('Error fetching results:', error)
    return null
  }
}
