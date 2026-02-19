import { ApiResponse } from '@/types'

export const fetchResults = async (urlCode: string): Promise<ApiResponse | null> => {
  try {
    console.log(`Fetching results for urlCode: ${urlCode}`)
    const response = await fetch(`/api/groups?urlCode=${urlCode}`)
    
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`)
    }
    
    const data = await response.json();
    console.log(`Successfully fetched results for urlCode: ${urlCode}`)
    return data as ApiResponse
    
  } catch (error) {
    console.error('Error fetching results:', error)
    return null
  }
}
