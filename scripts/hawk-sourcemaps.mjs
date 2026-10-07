// Отправляет browser source maps сборки в Hawk и удаляет их, чтобы исходники не раздавались с сайта.
// Запускается перед next start, а не после сборки: на Amvera переменные окружения (HAWK_TOKEN) при сборке недоступны.
// Повторный запуск безопасен: Hawk пропускает карты, уже сохранённые для этого релиза
import { readFile, readdir, rm } from 'node:fs/promises'
import { join } from 'node:path'

const STATIC_DIR = join('.next', 'static')

const maps = (await readdir(STATIC_DIR, { recursive: true }))
  .filter((file) => file.endsWith('.map'))
  .map((file) => file.replaceAll('\\', '/'))

const token = process.env.HAWK_TOKEN
// Без карт — они уже отправлены и удалены при прошлом запуске в этом контейнере
if (maps.length && !token) {
  console.warn('[hawk] HAWK_TOKEN не задан: source maps не отправлены')
} else if (maps.length) {
  // Release совпадает с тем, что layout передаёт клиентскому catcher'у
  const release = (await readFile(join('.next', 'BUILD_ID'), 'utf8')).trim()
  const { integrationId } = JSON.parse(Buffer.from(token, 'base64').toString('utf8'))
  const endpoint = `https://${integrationId}.k1.hawk.so/release`

  const results = await Promise.allSettled(maps.map(async (file) => {
    const body = new FormData()
    body.append('release', release)
    // Hawk ищет карту по вхождению имени файла без .map в URL кадра: static/chunks/x.js ⊂ /_next/static/chunks/x.js
    body.append('file', new Blob([await readFile(join(STATIC_DIR, file))]), `static/${file}`)
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body,
      signal: AbortSignal.timeout(30_000),
    })
    const result = await response.json().catch(() => null)
    if (!response.ok || result?.error !== false) {
      throw new Error(`${file}: ${response.status} ${result?.message ?? ''}`)
    }
  }))

  const failed = results.filter((result) => result.status === 'rejected')
  console.log(`[hawk] source maps release ${release}: отправлено ${maps.length - failed.length} из ${maps.length}`)
  failed.forEach(({ reason }) => console.warn('[hawk]', reason.message))
}

// Удаляем в любом случае: сбой Hawk не должен ни останавливать запуск, ни открывать исходники
await Promise.all(maps.map((file) => rm(join(STATIC_DIR, file))))
