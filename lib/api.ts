import { ApiResponse, Group, Qualification, Result } from '@/types'
import { GroupUpdate } from '@/types/api'

export const fetchResults = async (urlCode: string): Promise<ApiResponse | null> => {
  try {
    const response = await fetch(`/api/results?urlCode=${urlCode}`)
    
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

export const parseResultTable = (html: string): Result[] => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  
  const rows = doc.querySelectorAll('table tr')
  const results: Result[] = []
  
  rows.forEach((row, index) => {
    if (index === 0) return // Пропускаем заголовок
    
    const cells = row.querySelectorAll('td')
    if (cells.length < 5) return
    
    const rank = parseInt(cells[0].textContent?.trim() || '0')
    const name = cells[1].textContent?.trim() || ''
    const command = cells[2].textContent?.trim() || ''
    const score = parseFloat(cells[3].textContent?.trim() || '0')
    
    results.push({
      rank,
      name,
      command,
      score,
    })
  })
  
  return results
}
