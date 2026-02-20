import { Discipline } from '@/types'

export const fetchResults = async (code: string): Promise<Discipline[] | null> => {
  let lastError: Error | null = null;
  

    try {
      console.log(`Fetching results for code: ${code}`)
      const response = await fetch(`/api/groups?code=${code}`)
      
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json();
      console.log(`Successfully fetched results for code: ${code}`)
      return data as Discipline[]
      
    } catch (error) {
      lastError = error as Error;
      console.error(`Error fetching results:`, error)
    }
  
  // Обрабатываем специфические ошибки
  if (lastError) {
    if (lastError.name === 'AbortError') {
      console.error('Fetch request timed out for code:', code)
    } else if (lastError.name === 'TypeError' && lastError.message.includes('fetch failed')) {
      console.error('Network error occurred for code:', code, lastError.message)
    }
  }
  return null
}
