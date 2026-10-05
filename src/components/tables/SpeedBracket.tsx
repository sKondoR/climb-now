import { NAME_COL, COMMAND_COL } from '../../shared/tables.configs'
import { ROW_HIGHLIGHT_LABELS, WINNER_STRIPE, getRowClasses, getRowHighlight } from './tables.utils'

import { SpeedFinalItem } from '@/src/shared/types'

// Первая колонка — с запасом слева под полоску победителя забега
const FIRST_COL_PX = 'pl-2.5 pr-1 md:pl-3 md:pr-2'

interface SpeedBracketProps {
  results: SpeedFinalItem[]
  command: string
  isNamesFilterEnabled: boolean
  names: string
}

// Сетку-дерево не рисуем: в карточке группы (две в ряд на десктопе) четыре колонки раундов не помещаются.
// Раунды по порядку: 1/8, 1/4, полуфинал, финал. В широкой карточке — два столбца (1/8 и 1/4, затем полуфинал и финал),
// в узкой — друг под другом. С md карточки групп стоят по две в ряд: два столбца помещаются в них только с 2xl
export default function SpeedBracket({ results, command, isNamesFilterEnabled, names }: SpeedBracketProps) {
  const rounds = [...new Set(results.map((result) => result.round))]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 2xl:grid-cols-2 gap-x-12 gap-y-4">
      {rounds.map((round) => {
        const roundResults = results.filter((result) => result.round === round)
        const isFinal = round === 'Финал'
        const heats = [...new Set(roundResults.map((result) => result.heat))]
        return (
          <section key={round}>
            <h4 className="px-1 md:px-2 text-base font-semibold text-blue-800 mb-1">{round}</h4>
            {/* Одна ширина у всех раундов: на телефоне во всю карточку, в один столбец на широком экране не растягиваем */}
            <table className="w-full max-w-md table-fixed leading-none tabular-nums">
              <thead>
                <tr className="border-b bg-white">
                  {isFinal && <th className={`text-left ${FIRST_COL_PX} py-1 w-12`}>место</th>}
                  <th className={`text-left ${isFinal ? 'px-1 md:px-2' : FIRST_COL_PX} py-1`}>{NAME_COL}</th>
                  <th className="text-left px-1 md:px-2 py-1 w-16 md:w-20">{COMMAND_COL}</th>
                  <th className="text-right px-1 md:px-2 py-1 w-16">время</th>
                </tr>
              </thead>
              {/* Каждый забег — своя пара строк, между забегами зазор */}
              {heats.map((heat) => (
                <tbody key={heat} className="border-b-[20px] border-white">
                  {/* В финале победитель забега — выше, как на пьедестале */}
                  {roundResults.filter((result) => result.heat === heat)
                    .sort((a, b) => isFinal && a.rank && b.rank ? Number(a.rank) - Number(b.rank) : 0)
                    .map((result) => {
                    // Зелёным — только призёры финала: победителей забегов не красим, их время и так жирное
                    const rowProps = { result: { ...result, isHighlighted: false }, command, names, isNamesFilterEnabled, isFinal }
                    const rowClass = getRowClasses(rowProps)
                    const highlight = getRowHighlight(rowProps)
                    // Полоска победителя забега — на первой ячейке строки
                    const stripe = result.isHighlighted ? WINNER_STRIPE : ''
                    return (
                      <tr key={result.name} className={`border-b border-white ${rowClass || 'bg-gray-50'}`}>
                        {isFinal && <td className={`${FIRST_COL_PX} py-1 font-medium ${stripe}`}>{Number(result.rank) <= 3 ? result.rank : ''}</td>}
                        <td className={`${isFinal ? 'px-1 md:px-2' : `${FIRST_COL_PX} ${stripe}`} py-1 break-words ${highlight === 'own' ? 'font-bold' : 'font-medium'}`}>
                          {result.name}
                          {highlight && <span className="sr-only">, {ROW_HIGHLIGHT_LABELS[highlight]}</span>}
                          {result.isHighlighted && <span className="sr-only">, победитель забега</span>}
                        </td>
                        <td className={`px-1 md:px-2 py-1 font-medium ${rowClass ? 'text-gray-600' : 'text-gray-500'}`}>{result.command}</td>
                        <td className={`px-1 md:px-2 py-1 text-right whitespace-nowrap ${result.isHighlighted ? 'font-bold' : 'font-medium'}`}>{result.score}</td>
                      </tr>
                    )
                  })}
                </tbody>
              ))}
            </table>
          </section>
        )
      })}
    </div>
  )
}
