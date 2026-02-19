import { ApiResponse } from '@/types'

export const fetchResults = async (urlCode: string): Promise<ApiResponse | null> => {
  let lastError: Error | null = null;
  

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
      lastError = error as Error;
      console.error(`Error fetching results:`, error)
    }
  
  // Обрабатываем специфические ошибки
  if (lastError) {
    if (lastError.name === 'AbortError') {
      console.error('Fetch request timed out for urlCode:', urlCode)
    } else if (lastError.name === 'TypeError' && lastError.message.includes('fetch failed')) {
      console.error('Network error occurred for urlCode:', urlCode, lastError.message)
    }
  }
  return null
}
