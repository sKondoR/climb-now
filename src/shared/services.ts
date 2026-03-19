import { Discipline } from '@/shared/types'
import { BACKEND_API_URL } from './constants'
import { getDateRange } from './utils/date.utils'
import type {
  EventResponse,
  BaseResponseListEvent,
  BaseResponse,
  FetchEventsOperation
} from './types/api.types'

/**
 * Получает список команд
 * @returns Promise<string[]> - массив названий команд
 */
export const fetchTeams = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${BACKEND_API_URL}teams`)

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data.teams
  } catch (error) {
    console.error('Error fetching teams:', error)
    throw error
  }
}

/**
 * Получает список событий за указанный период
 * @returns Promise<EventResponse[]> - массив объектов событий
 */
export const fetchEvents = async (): Promise<EventResponse[]> => {
  try {
    const [startDate, endDate] = getDateRange()
    
    // Используем тип операции для типизации параметров запроса
    const params: FetchEventsOperation['parameters']['query'] = {
      start: startDate,
      end: endDate
    }
    
    const queryString = new URLSearchParams(params as Record<string, string>).toString()
    const response = await fetch(`${BACKEND_API_URL}events?${queryString}`)

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`)
    }

    // Используем типизированный ответ от API
    const data: BaseResponseListEvent = await response.json()
    return data.data || []
  } catch (error) {
    console.error('Error fetching events:', error)
    throw error
  }
}

/**
 * Проверяет здоровье API
 * @returns Promise<BaseResponse> - ответ с информацией о состоянии
 */
export const healthCheck = async (): Promise<BaseResponse> => {
  try {
    const response = await fetch(`${BACKEND_API_URL}health`)

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`)
    }

    const data: BaseResponse = await response.json()
    return data
  } catch (error) {
    console.error('Health check failed:', error)
    throw error
  }
}

/**
 * Получает результаты для указанной группы
 * @param code - код группы
 * @returns Promise<Discipline[] | null> - массив дисциплин или null в случае ошибки
 */
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
