import { Discipline } from '@/shared/types'
import { DEFAULT_TEAMS } from './constants'
import { getDateRange } from './utils/date.utils'
import type {
  EventResponse,
  BaseResponseListEvent,
  FetchEventsOperation
} from './types/api.types'
import { rootStore } from '@/src/store/root.store'

const CACHE_DURATION = 1000 * 60 * 60 * 24 // 24 часа
let eventsCache: EventResponse[] | null = null
let eventsCacheTime: number | null = null
const EVENTS_CACHE_DURATION = CACHE_DURATION * 3

/**
 * Получает список команд
 * @returns Promise<string[]> - массив названий команд
 */
export const fetchTeams = async (): Promise<string[]> => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 20000)

  try {
    const response = await fetch(`/api/teams`, {
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data.teams
  } catch (error) {
    clearTimeout(timeoutId)
    // Не бросаем ошибку, чтобы react-query не повторял запрос: берём запасной список
    console.warn('fetchTeams failed, using DEFAULT_TEAMS:', error)
    return DEFAULT_TEAMS
  }
}

/**
 * Получает список событий за указанный период
 * @returns Promise<EventResponse[]> - массив объектов событий
 */
export const fetchEvents = async (): Promise<EventResponse[]> => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 20000)
  try {
    const [startDate, endDate] = getDateRange()
    
    const params: FetchEventsOperation['parameters']['query'] = {
      start: startDate,
      end: endDate
    }
    
    const queryString = new URLSearchParams(params as Record<string, string>).toString()
    const response = await fetch(`/api/events?${queryString}`, {
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`)
    }

    const data: BaseResponseListEvent = await response.json()

    eventsCache = data.data || []
    eventsCacheTime = Date.now()

    return eventsCache
  } catch (error) {
        clearTimeout(timeoutId)

    if (error instanceof Error && error.name === 'AbortError') {
      console.warn('fetchEvents timed out, using cached value if available')
      if (eventsCache && eventsCacheTime && (Date.now() - eventsCacheTime < EVENTS_CACHE_DURATION)) {
        return eventsCache
      }
    } else {
      console.error('Error fetching events:', error)
    }
    throw error
  }
}

/**
 * Изменяет code события на новый 
 * @returns Promise<EventResponse> - возвращает событие после изменения
 */
export const patchEvent = async (code: string, newCode: string): Promise<EventResponse> => {
  try {
    const event = rootStore.eventsStore.events.find(ev => ev.link === code)
    if (!event) {
      throw `No event with link ${code}`
    }
    const response = await fetch(`/api/events/${event.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ link: newCode })
    })

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`)
    }

    const data: EventResponse = await response.json()
    return data
  } catch (error) {
    console.error('Patch event failed:', error)
    throw error
  }
}

/**
 * Получает результаты для указанной группы
 * @param code - код группы
 * @returns Promise<Discipline[] | null> - массив дисциплин или null, если соревнование не найдено
 * @throws Error - если сайт ФСР или сеть недоступны
 */
export const fetchResults = async (code: string): Promise<Discipline[] | null> => {
  const response = await fetch(`/api/groups?code=${encodeURIComponent(code)}`)

  // 400 — код с недопустимыми символами (например, набран в русской раскладке): такого соревнования нет, сайт ФСР тут ни при чём
  if (response.status === 400) {
    return null
  }

  if (!response.ok) {
    throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`)
  }

  return await response.json() as Discipline[] | null
}
