// Раунд называем по удалённости от финала: 0 — финал, 1 — полуфинал, 2 — 1/4, 3 — 1/8
export const getSpeedRoundName = (stepsToFinal: number) => {
  if (stepsToFinal === 0) return 'Финал'
  if (stepsToFinal === 1) return 'Полуфинал'
  return `1/${2 ** stepsToFinal} финала`
}

export const getSpeedStepsToFinal = (roundName: string) => {
  if (roundName === 'Финал') return 0
  if (roundName === 'Полуфинал') return 1
  return Math.log2(Number(roundName.match(/^1\/(\d+)/)?.[1] ?? 1))
}
