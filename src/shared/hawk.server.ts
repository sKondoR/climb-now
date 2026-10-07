import HawkCatcher, { type HawkNodeJSInitialSettings } from '@hawk.so/nodejs'
import { readFileSync } from 'node:fs'
import { SourceMap } from 'node:module'
import { join } from 'node:path'

type HawkEvent = Parameters<NonNullable<HawkNodeJSInitialSettings['beforeSend']>>[0]
type Frame = NonNullable<HawkEvent['backtrace']>[number]

const SOURCE_LINES_AROUND = 5

// Карты серверных чанков читаются с диска только при отправке ошибки: --enable-source-maps держал бы
// в памяти карты всех загруженных чанков ради редких событий. null — у файла карты нет
const sourceMaps = new Map<string, SourceMap | null>()

const loadSourceMap = (file: string): SourceMap | null => {
  if (!sourceMaps.has(file)) {
    try {
      sourceMaps.set(file, new SourceMap(JSON.parse(readFileSync(`${file}.map`, 'utf8'))))
    } catch {
      sourceMaps.set(file, null)
    }
  }
  return sourceMaps.get(file) ?? null
}

// error.stack указывает на минифицированные чанки .next/server: Next подменяет Error.prepareStackTrace,
// поэтому Node сам стек по картам не размечает — сопоставляем кадры здесь
const toOriginalFrame = (frame: Frame): Frame | null => {
  if (!frame.file || !frame.line || !frame.column) return null
  // Парсер стека в SDK оставляет «async » от кадров вида «at async C:\...\chunk.js:1:2» в имени файла
  const sourceMap = loadSourceMap(frame.file.replace(/^async /, ''))
  const origin = sourceMap?.findOrigin(frame.line, frame.column)
  if (!sourceMap || !origin || !('fileName' in origin)) return null

  const source = sourceMap.payload.sourcesContent?.[sourceMap.payload.sources.indexOf(origin.fileName)] ?? ''
  const from = Math.max(0, origin.lineNumber - 1 - SOURCE_LINES_AROUND)
  return {
    // Пути в картах относительны чанка (../../../src/...): показываем от корня проекта
    file: origin.fileName.replace(/^(\.\.\/)+/, ''),
    line: origin.lineNumber,
    column: origin.columnNumber,
    function: origin.name || frame.function,
    sourceCode: source
      .split('\n')
      .slice(from, origin.lineNumber + SOURCE_LINES_AROUND)
      .map((content, index) => ({ line: from + index + 1, content })),
  }
}

// Кадр без карты из минифицированного файла: SDK прикладывает строку на сотни КБ,
// и событие в мегабайты коллектор отклоняет с 400
const withoutMinifiedSource = (frame: Frame): Frame =>
  frame.sourceCode?.some(({ content }) => content.length > 1000) ? { ...frame, sourceCode: undefined } : frame

// Инициализация при первой отправке, а не в register(): бандлер может дать instrumentation и роутам разные копии SDK,
// и init в одной не действовал бы в другой. Флаг живёт рядом со своей копией SDK
let initialized = false

export function sendToHawk(error: unknown, context?: Record<string, string | number>) {
  const token = process.env.HAWK_TOKEN
  if (!token) return
  if (!initialized) {
    HawkCatcher.init({
      token,
      // Без глобальных обработчиков: подписка SDK на uncaughtException не даёт процессу упасть после фатальной ошибки
      disableGlobalErrorsHandling: true,
      beforeSend(event) {
        event.backtrace = event.backtrace?.map((frame) => toOriginalFrame(frame) ?? withoutMinifiedSource(frame))
        return event
      },
    })
    initialized = true
  }
  HawkCatcher.send(error instanceof Error ? error : new Error(String(error)), context)
}

let release: string | undefined

// Release для клиентского catcher'а — id сборки, под ним scripts/hawk-sourcemaps.mjs загружает browser source maps.
// Читается при запросе: при сборке BUILD_ID ещё нет
export function getHawkRelease() {
  if (process.env.NODE_ENV !== 'production') return undefined
  return release ??= readFileSync(join(process.cwd(), '.next', 'BUILD_ID'), 'utf8').trim()
}
