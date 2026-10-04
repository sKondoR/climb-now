import { ROW_HIGHLIGHT_LABELS, getRowClasses, getRowHighlight, getSpeedBracketRounds } from './tables.utils'

import { SpeedFinalItem } from '@/src/shared/types'

interface SpeedBracketTreeProps {
  results: SpeedFinalItem[]
  command: string
  isNamesFilterEnabled: boolean
  names: string
}

// «Господарова Юлия» → «Господарова Ю.»: колонка раунда узкая, полное имя — во всплывающей подсказке
const shortName = (name: string) => {
  const [surname, firstName] = name.split(' ')
  return firstName && firstName.length > 2 ? `${surname} ${firstName[0]}.` : name
}

interface HeatProps extends Omit<SpeedBracketTreeProps, 'results'> {
  heat: SpeedFinalItem[]
  isFinal: boolean
}

function Heat({ heat, isFinal, command, names, isNamesFilterEnabled }: HeatProps) {
  // В забеге всегда две дорожки: недостающая — ещё не известный соперник (или его нет в сетке)
  const lanes = [heat[0], heat[1]]
  return (
    <div className={`overflow-hidden rounded border leading-none tabular-nums ${heat.length ? 'border-gray-300' : 'border-dashed border-gray-300'}`}>
      {lanes.map((result, i) => {
        if (!result) return <div key={i} className={`h-6 px-1.5 flex items-center text-gray-400 ${i ? 'border-t border-gray-200' : ''}`}>—</div>
        const rowProps = { result: { ...result, isHighlighted: false }, command, names, isNamesFilterEnabled, isFinal }
        const highlight = getRowHighlight(rowProps)
        const rowClass = getRowClasses(rowProps)
        return (
          <div
            key={result.name}
            title={[result.name, result.command].filter(Boolean).join(', ')}
            className={`h-6 px-1.5 flex items-center gap-1 ${i ? 'border-t border-gray-200' : ''} ${rowClass || 'bg-gray-50'}`}
          >
            {isFinal && result.rank && <span className="w-3 shrink-0 text-gray-600">{Number(result.rank) <= 3 ? result.rank : ''}</span>}
            <span className={`min-w-0 flex-1 truncate ${highlight === 'own' ? 'font-bold' : 'font-medium'}`}>
              {shortName(result.name)}
              <span className="sr-only">{result.name !== shortName(result.name) && ` (${result.name})`}</span>
              {highlight && <span className="sr-only">, {ROW_HIGHLIGHT_LABELS[highlight]}</span>}
              {result.isHighlighted && <span className="sr-only">, победитель забега</span>}
            </span>
            {/* Победителя забега видно не только по цвету: его время жирное */}
            <span className={`shrink-0 ${result.isHighlighted ? 'font-bold text-gray-900' : `font-medium ${rowClass ? 'text-gray-600' : 'text-gray-500'}`}`}>{result.score}</span>
          </div>
        )
      })}
    </div>
  )
}

// Сетка-дерево, как на c-f-r.ru: раунды слева направо, линии ведут победителя забега в следующий раунд.
// Строка сетки — забег первого раунда; забег раунда i занимает 2^i строк и стоит по их центру, поэтому
// линии между раундами — просто скобки от 1/4 до 3/4 высоты пары забегов. В узкой карточке сетка прокручивается вбок
export default function SpeedBracketTree({ results, ...rowProps }: SpeedBracketTreeProps) {
  const { rounds, bronze } = getSpeedBracketRounds(results)
  if (!rounds.length) return null
  const lastColumn = rounds.length * 2 - 1
  const firstRoundHeats = rounds[0].heats.length

  return (
    <div
      className="grid min-w-max px-1 pb-1"
      style={{
        gridTemplateColumns: rounds.map(() => 'minmax(9rem, 13rem)').join(' 0.75rem '),
        // Одинаковая высота строк: без неё центры забегов разъезжаются, и скобки бьют мимо
        gridTemplateRows: `auto repeat(${firstRoundHeats}, 1fr) auto`,
      }}
    >
      {rounds.map((round, i) => (
        <h4 key={round.name} className="text-base font-semibold text-blue-800 pb-1" style={{ gridColumn: i * 2 + 1, gridRow: 1 }}>
          {round.name}
        </h4>
      ))}
      {rounds.map((round, i) => round.heats.map((heat, h) => (
        <div
          key={`${round.name}-${h}`}
          className="self-center py-1.5"
          style={{ gridColumn: i * 2 + 1, gridRow: `${2 + h * 2 ** i} / span ${2 ** i}` }}
        >
          <Heat heat={heat} isFinal={i === rounds.length - 1} {...rowProps} />
        </div>
      )))}
      {rounds.slice(0, -1).map((round, i) => round.heats.filter((_, h) => h % 2 === 0).map((_, k) => (
        <div
          key={`line-${round.name}-${k}`}
          aria-hidden
          className="relative"
          style={{ gridColumn: i * 2 + 2, gridRow: `${2 + k * 2 ** (i + 1)} / span ${2 ** (i + 1)}` }}
        >
          <div className="absolute left-0 w-1/2 top-1/4 bottom-1/4 border-y border-r border-gray-300" />
          <div className="absolute left-1/2 right-0 top-1/2 border-t border-gray-300" />
        </div>
      )))}
      {bronze && (
        <div className="pt-3" style={{ gridColumn: lastColumn, gridRow: firstRoundHeats + 2 }}>
          <h4 className="text-base font-semibold text-blue-800 pb-1">За 3 место</h4>
          <Heat heat={bronze} isFinal {...rowProps} />
        </div>
      )}
    </div>
  )
}
