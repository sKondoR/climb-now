export const DEFAULT_URL_CODE = '2602vrn'
export const MIN_URL_CODE_LENGTH = 7
export const DEFAULT_TEAM = 'СПБ'
export const UPDATE_INTERVAL = 120000 
export const DEBOUNCE_DELAY = 500
// Сразу https: по http сайт отвечает 301, и каждый запрос платил лишний круг до ФСР (~0,3–0,6 с)
export const EXTERNAL_API_BASE_URL = 'https://c-f-r.ru/live/'
export const EXTERNAL_API_TIMEOUT = 10000
// Коды соревнований и ссылки на протоколы вида 2602vrn_vs, b_q_f13
export const SAFE_PATH_SEGMENT = /^[\w-]+$/
export const BACKEND_API_URL = 'https://cfr-search.vercel.app/api/'

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

export const SPECIAL_STATUSES = ['н/я', 'в/к']