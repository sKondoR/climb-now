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
// Календарь соревнований ФСР — источник списка событий
export const EVENTS_SOURCE_URL = 'https://www.rusclimbing.ru/competitions/'
// Календарь за 3 года сайт отдаёт за 6–9 с — общих 10 с не хватало. Меньше 20 с, после которых fetchEvents обрывает запрос
export const EVENTS_SOURCE_TIMEOUT = 18000
// Команды Всероссийских соревнований 13-14 лет 2026 года (отдаются /api/teams и служат запасным списком на клиенте)
export const DEFAULT_TEAMS = [
  'БАШК', 'ВОЛГ', 'ВОЛО', 'ВРНЖ', 'ДНР', 'КИРВ', 'КЛНД', 'КРДР', 'КРСК', 'КУРС',
  'ЛЕНГ', 'ЛНР', 'МОСК', 'МСК', 'НИЖГ', 'ПЕНЗ', 'ПЕРМ', 'ПРИМ', 'РКАР', 'РОСТ',
  'РЯЗН', 'САРТ', 'СВРД', 'СВСТ', 'СПБ', 'ТАТ', 'ТУЛС', 'УДМ', 'ХБРК', 'ЧЛБН',
]

export const DISCIPLINES = {
  LEAD: 'трудность' as const,
  SPEED: 'скорость' as const,
  // «ЛАЗАНИЕ НА СКОРОСТЬ (К)» — классическая скорость, свои протоколы s_*
  SPEED_CLASSIC: 'скорость (кл)' as const,
  BOULRER: 'боулдеринг' as const,
} as const

export const STATUSES = {
  PENDING: 'pending' as const,
  ONLINE: 'online' as const,
  PASSED: 'passed' as const,
} as const

export const SPECIAL_STATUSES = ['н/я', 'в/к', 'ф/с']