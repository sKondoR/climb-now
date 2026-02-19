import { ApiResponse } from '@/types'

export const fetchResults = async (urlCode: string): Promise<ApiResponse | null> => {
  const maxRetries = 3;
  let lastError: Error | null = null;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      console.log(`Fetching results for urlCode: ${urlCode} (attempt ${i + 1})`)
      const response = await fetch(`/api/groups?urlCode=${urlCode}`, {
        // Добавляем таймаут для самого внешнего запроса
        signal: AbortSignal.timeout(60000)
      })
      
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json();
      console.log(`Successfully fetched results for urlCode: ${urlCode}`)
      return data as ApiResponse
      
    } catch (error) {
      lastError = error as Error;
      console.error(`Error fetching results (attempt ${i + 1}):`, error)
      
      // Если это последняя попытка, возвращаем null
      if (i === maxRetries - 1) {
        break;
      }
      
      // Ждем перед следующей попыткой (экспоненциальная задержка)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
    }
  }
  
  // Обрабатываем специфические ошибки
  if (lastError && lastError.name === 'AbortError') {
    console.error('Fetch request timed out for urlCode:', urlCode)
  }
  return null
}
