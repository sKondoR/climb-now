import axios from 'axios'

import { cachedWithFallback } from './backendCache'
import { cached } from './upstreamCache'
import { ApiError } from './errorHandler'
import { parseEvents } from './parser/events.parser'
import { parseResults } from './parser/parsers'
import { EVENTS_SOURCE_URL, EXTERNAL_API_BASE_URL, EXTERNAL_API_TIMEOUT } from './constants'
import type { EventResponse } from './types/api.types'

// Суффиксы, с которыми протоколы лежат на c-f-r.ru, когда код с rusclimbing.ru даёт 404
const LINK_SUFFIXES = ['_vs', '_ch', '_perv']

// Исправленные коды событий (исходный → с суффиксом). Живут в памяти процесса: после рестарта
// первый же зритель снова подберёт суффикс и пришлёт PATCH. На globalThis — чтобы роуты GET и PATCH
// гарантированно делили одну карту.
const globalForEvents = globalThis as { eventLinkOverrides?: Map<string, string> }
const linkOverrides = globalForEvents.eventLinkOverrides ??= new Map<string, string>()

// Числовой id, как был у событий в БД: хеш (FNV-1a) исходного кода стабилен между загрузками календаря
const linkToId = (link: string): number => {
  let hash = 0x811c9dc5
  for (let i = 0; i < link.length; i++) {
    hash ^= link.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193)
  }
  return hash >>> 0
}

const buildSourceUrl = (): string => {
  // Окно с запасом покрывает диапазон, который запрашивает клиент (getDateRange)
  const year = new Date().getFullYear()
  const params = new URLSearchParams({ start: `${year - 1}-01-01`, end: `${year + 1}-12-31` })
  const filters = {
    ranks: ['Всероссийские', 'Международные', 'Региональные'],
    types: ['book_competition', 'book_festival'],
    groups: ['adults', 'juniors', 'teenagers', 'younger', 'v10', 'v13', 'v15', 'v19'],
    disciplines: ['bouldering', 'dvoerobye', 'etalon', 'skorost', 'trudnost', 'sv', 'mnogobore'],
  }
  Object.entries(filters).forEach(([key, values]) => values.forEach(value => params.append(`${key}[]`, value)))
  return `${EVENTS_SOURCE_URL}?${params}`
}

// События с исходными кодами rusclimbing.ru, без исправлений
const loadEvents = (): Promise<EventResponse[]> => cachedWithFallback('events', async () => {
  const response = await axios.get<string>(buildSourceUrl(), { timeout: EXTERNAL_API_TIMEOUT })
  const loadedAt = new Date().toISOString()
  return parseEvents(response.data).map(event => ({
    ...event,
    id: linkToId(event.link),
    created_at: loadedAt,
    updated_at: loadedAt,
  }))
})

const withOverride = (event: EventResponse): EventResponse => {
  const link = linkOverrides.get(event.link)
  return link ? { ...event, link } : event
}

export const getEvents = async (start?: string | null, end?: string | null): Promise<EventResponse[]> => {
  const events = await loadEvents()
  return events
    .filter(event => !start || (event.startdate != null && event.startdate >= start))
    .filter(event => !end || (event.enddate != null && event.enddate <= end))
    .map(withOverride)
    .sort((a, b) => a.link.localeCompare(b.link))
}

/**
 * Запоминает исправленный код события. Принимается только исходный код с одним из LINK_SUFFIXES,
 * под которым на c-f-r.ru действительно есть соревнование — иначе любой мог бы подменить ссылку.
 * @returns событие с новым кодом или null, если события с таким id нет
 */
export const patchEventLink = async (id: number, link: string): Promise<EventResponse | null> => {
  const event = (await loadEvents()).find(item => item.id === id)
  if (!event) return null

  if (!LINK_SUFFIXES.some(suffix => link === event.link + suffix)) {
    throw new ApiError(`Link ${link} is not a known variant of ${event.link}`, 400)
  }

  // Тот же ключ и загрузчик, что в /api/groups: клиент только что запрашивал этот код, ответ обычно в кеше
  const url = `${EXTERNAL_API_BASE_URL}${link}/index.html`
  const results = await cached(url, async () => {
    const response = await axios.get(url, { timeout: EXTERNAL_API_TIMEOUT })
    return parseResults(response.data)
  })
  if (!results) {
    throw new ApiError(`Competition ${link} not found`, 400)
  }

  linkOverrides.set(event.link, link)
  return withOverride(event)
}

export function clearLinkOverrides() {
  linkOverrides.clear()
}
