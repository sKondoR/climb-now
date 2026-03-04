import { Discipline } from '@/types'

export const fetchTeams = async (): Promise<string[]> => {
  try {
    const response = await fetch('https://cfr-search.vercel.app/api/teams')
    
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`)
    }
    
    const data = await response.json()
    return data.teams
  } catch (error) {
    console.error('Error fetching teams:', error)
    return []
  }
}

const getCurrentDatePlusOneMonth = (): string => {
  const currentDate = new Date()
  const nextMonth = new Date(currentDate.setMonth(currentDate.getMonth() + 1))
  
  const year = nextMonth.getFullYear()
  const month = String(nextMonth.getMonth() + 1).padStart(2, '0')
  const day = String(nextMonth.getDate()).padStart(2, '0')
  
  return `${year}-${month}-${day}`
}

export const fetchEvents = async (): Promise<string[]> => {
  try {
    const endDate = getCurrentDatePlusOneMonth()
    const response = await fetch(`https://cfr-search.vercel.app/api/events?start=01-01-2024&end=${endDate}`)
    
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`)
    }
    
    const data = await response.json()
    return data.data
  } catch (error) {
    console.error('Error fetching events:', error)
    return []
  }
}

export const fetchResults = async (code: string): Promise<Discipline[] | null> => {
  let lastError: Error | null = null
  

    try {
      console.log(`Fetching results for code: ${code}`)
      const response = await fetch(`/api/groups?code=${code}`)
      
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json()
      console.log(`Successfully fetched results for code: ${code}`)
      return data as Discipline[]
      
    } catch (error) {
      lastError = error as Error
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
