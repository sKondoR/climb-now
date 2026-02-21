export const DEFAULT_URL_CODE = '2602vrn'
export const DEFAULT_CITY = 'СПБ'
export const UPDATE_INTERVAL = 120000 
export const DEBOUNCE_DELAY = 500
export const EXTERNAL_API_BASE_URL = 'http://c-f-r.ru/live/'

export const DISCIPLINES = {
  LEAD: 'трудность' as const,
  SPEED: 'скорость' as const,
  BOULRER: 'боулдеринг' as const,
} as const

export const STATUSES = {
  PENDING: 'pending' as const,
  ONLINE: 'online' as const,
  PASSED: 'passed' as const,
} as const
