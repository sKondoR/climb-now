// Микрокеш прокси к c-f-r.ru: зрители одного онлайн-этапа опрашивают одни и те же протоколы,
// поэтому в пределах TTL на ФСР уходит один запрос, а одновременные запросы ждут его общий ответ.
// Ошибки не кешируются — следующий запрос снова идёт на сайт.
export const UPSTREAM_CACHE_TTL = 10_000

type Entry = { promise: Promise<unknown>, expiresAt: number }

const cache = new Map<string, Entry>()

export function cached<T>(key: string, loader: () => Promise<T>): Promise<T> {
  const now = Date.now()
  const hit = cache.get(key)
  if (hit && hit.expiresAt > now) {
    return hit.promise as Promise<T>
  }

  // Просроченные записи вычищаем здесь же, чтобы кеш не рос по всем когда-либо запрошенным протоколам
  cache.forEach((entry, entryKey) => {
    if (entry.expiresAt <= now) cache.delete(entryKey)
  })

  const promise = loader()
  const entry: Entry = { promise, expiresAt: now + UPSTREAM_CACHE_TTL }
  cache.set(key, entry)
  promise.catch(() => {
    if (cache.get(key) === entry) cache.delete(key)
  })
  return promise
}

export function clearUpstreamCache() {
  cache.clear()
}
