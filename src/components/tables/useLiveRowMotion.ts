import { RefObject, useLayoutEffect, useRef } from 'react'

// Живое обновление: строка, сменившая место, доезжает до новой позиции, строка с новым результатом коротко вспыхивает
const MOVE_DURATION = 450
const FLASH_DURATION = 1800
const FLASH_COLOR = 'rgb(254 240 138)' // yellow-200: не путается с подсветкой своей команды и призёров
const EASE_OUT = 'cubic-bezier(0.16, 1, 0.3, 1)'

type RowSnapshot = { top: number, signature: string }

export default function useLiveRowMotion(
  tbodyRef: RefObject<HTMLTableSectionElement | null>,
  data: unknown,
  tableKey: string,
) {
  const snapshot = useRef(new Map<string, RowSnapshot>())
  const previous = useRef({ data, tableKey })

  // Без зависимостей: позиции нужно снимать после каждого рендера, иначе сдвиг посчитается от устаревших
  useLayoutEffect(() => {
    const tbody = tbodyRef.current
    if (!tbody) return

    const isSameTable = previous.current.tableKey === tableKey
    const isDataUpdate = isSameTable && previous.current.data !== data && snapshot.current.size > 0
    previous.current = { data, tableKey }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const next = new Map<string, RowSnapshot>()

    tbody.querySelectorAll<HTMLTableRowElement>('tr[data-row-key]').forEach((row) => {
      const key = row.dataset.rowKey as string
      const signature = row.dataset.rowSignature ?? ''
      // offsetTop не учитывает transform, поэтому идущая анимация не искажает замер
      const top = row.offsetTop
      next.set(key, { top, signature })

      const before = snapshot.current.get(key)
      if (!isSameTable || !before) return

      const shift = before.top - top
      if (!reduceMotion && Math.abs(shift) > 1) {
        row.animate(
          [{ transform: `translateY(${shift}px)` }, { transform: 'none' }],
          { duration: MOVE_DURATION, easing: EASE_OUT },
        )
      }
      // Вспышка — это смысл («результат изменился»), а не движение, поэтому остаётся и при reduced motion
      if (isDataUpdate && before.signature !== signature) {
        row.animate(
          [{ backgroundColor: FLASH_COLOR }, { backgroundColor: getComputedStyle(row).backgroundColor }],
          { duration: FLASH_DURATION, easing: 'ease-out' },
        )
      }
    })

    snapshot.current = next
  })
}
