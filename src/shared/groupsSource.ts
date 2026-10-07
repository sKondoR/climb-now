import axios from 'axios'

import { cached } from './upstreamCache'
import { parseResults } from './parser/parsers'
import { EXTERNAL_API_BASE_URL, EXTERNAL_API_TIMEOUT } from './constants'

// Список дисциплин/групп соревнования с c-f-r.ru. Общий для /api/groups и patchEventLink: они делят ключ кеша,
// поэтому и загрузчик должен быть один
export const loadGroups = (code: string) => {
  const url = `${EXTERNAL_API_BASE_URL}${code}/index.html`
  return cached(url, async () => {
    const response = await axios.get(url, { timeout: EXTERNAL_API_TIMEOUT })
    return parseResults(response.data, response.headers['last-modified'])
  })
}
