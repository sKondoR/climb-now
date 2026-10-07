import { useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

import { NAME_COL, COMMAND_COL } from '../../shared/tables.configs'
import { ROW_HIGHLIGHT_LABELS, getClimbedCount, getRowClasses, getRowHighlight, getRowKeys, getRowSignature, getTableConfig, withRouteColumns, filterOwnResults, filterOwnHeats } from './tables.utils'
import BoulderCell from './BoulderCell'
import SpeedBracket from './SpeedBracket'
import SpeedBracketTree from './SpeedBracketTree'
import RefreshTableBtn from './RefreshTableBtn'
import useFetchResults from './useFetchResults'
import useLiveRowMotion from './useLiveRowMotion'
import Button from '@/src/shared/components/Button/Button'

import { SPECIAL_STATUSES, STATUSES } from '@/src/shared/constants'
import { Subgroup, Results, LeadQualItem, LeadQualResultItem, LeadFinalsItem, BoulderQualItem, BoulderFinalItem, SpeedQualItem, SpeedFinalItem } from '@/src/shared/types'

interface TableProps {
  subGroup: Subgroup | undefined,
  code: string,
  isCommandFilterEnabled: boolean,
  command: string,
  isNamesFilterEnabled: boolean,
  names: string,
  isSpeedTree: boolean,
}

// Имя закреплено слева: на телефоне широкие таблицы (боулдеринг) прокручиваются, а строку всё равно видно, чья она
const STICKY_NAME_CLASS = 'sticky left-0 z-[1] bg-inherit max-md:shadow-[1px_0_0_theme(colors.gray.200)]'
// Второстепенные колонки — приглушённым цветом, чтобы взгляд шёл к месту, имени и результату.
// На подсвеченных строках (свои, лидеры) — на ступень темнее, чтобы на цветном фоне хватало контраста
const SECONDARY_PROPS = ['stRank', 'stRank2', 'command', 'qRank']

export default function Table({
  subGroup,
  code,
  isCommandFilterEnabled,
  command,
  isNamesFilterEnabled,
  names,
  isSpeedTree,
}: TableProps) {
    
    const { results, isLead, isBoulder, isSpeed, isFinal, isQualResult, isLoading, error, refetch } = useFetchResults({
      code,
      isOnline: subGroup?.status === STATUSES.ONLINE,
      subgroupLink: subGroup?.link
    })
    const tbodyRef = useRef<HTMLTableSectionElement>(null)
    useLiveRowMotion(tbodyRef, results, `${code}/${subGroup?.link}`)
    
    if (!subGroup) return null
    
    const isSpeedFinal = isSpeed && isFinal
    const ownProps = { command, names, isNamesFilterEnabled }
    const filteredResults = (isCommandFilterEnabled
      ? (isSpeedFinal ? filterOwnHeats(results as SpeedFinalItem[], ownProps) : filterOwnResults(results as Results, ownProps))
      : results) as Results
    const emptyMessage = !results.length
      ? 'Результатов пока нет'
      : (isNamesFilterEnabled ? names.trim() : command)
        // Без названия команды: «ваши» — это и команда, и скалолазы, введённые по фамилиям
        ? 'В этом протоколе нет ваших скалолазов'
        : isNamesFilterEnabled
          ? 'Введите фамилии, чтобы показать этих скалолазов'
          : 'Укажите команду, чтобы показать её скалолазов'
    const rowKeys = getRowKeys(filteredResults)
    const climbedCount = getClimbedCount({ results, isLead, isBoulder, isSpeed });

    const firstResult = results?.[0]
    const config = firstResult
      ? withRouteColumns(getTableConfig({ isFinal, isQualResult, isLead, isBoulder, isSpeed }), firstResult).filter((col) => col.prop && col.prop in firstResult)
      : []

    return (
      <div className="mt-2 relative">
        <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center justify-between gap-2">
          <span className="min-w-0 break-words">{subGroup.title}</span>
          <div className="shrink-0 whitespace-nowrap flex items-center">
            {/* Ширина с запасом на «100 / 120»: пока протокол грузится, «0 / 0» уже, и счётчик сдвигал заголовок */}
            {!isSpeedFinal && <span className="ml-2 inline-flex justify-center min-w-[8rem] items-center px-2.5 py-0.5 rounded-full text-xs font-medium tabular-nums bg-blue-100 text-blue-800">
              {climbedCount} / {results.length} пролезло
            </span>}
            <RefreshTableBtn refetch={refetch} />
          </div>
        </h3>
        {/* Упавшее обновление не прячет уже загруженные результаты */}
        {error && results.length > 0 && (
          <p className="-mt-2 mb-2 text-xs text-amber-700" role="status">
            {error}. Показаны последние загруженные результаты.
          </p>
        )}
        <div className="overflow-x-auto overscroll-x-contain relative max-md:-mx-1">
          {/* В сетке фильтр «только свои» не прячет забеги: дерево без них разваливается, свои и так подсвечены */}
          {isSpeedFinal && isSpeedTree ? <>
            <SpeedBracketTree results={results as SpeedFinalItem[]} command={command} names={names} isNamesFilterEnabled={isNamesFilterEnabled} />
            {results.length === 0 && !isLoading && !error && (
              <p className="px-2 py-3 text-center text-gray-500">{emptyMessage}</p>
            )}
          </> : isSpeedFinal ? <>
            <SpeedBracket results={filteredResults as SpeedFinalItem[]} command={command} names={names} isNamesFilterEnabled={isNamesFilterEnabled} />
            {filteredResults.length === 0 && !isLoading && !error && (
              <p className="px-2 py-3 text-center text-gray-500">{emptyMessage}</p>
            )}
          </> :
          <table className="w-full leading-none tabular-nums">
            <thead>
              <tr className="border-b bg-white">
                {config.map((col) => (
                  <th key={col.id} className={`text-left px-1 md:px-2 py-1 ${[NAME_COL, COMMAND_COL].includes(col.name as string) ? '' : 'w-4'} ${col.name === NAME_COL ? STICKY_NAME_CLASS : ''}`}>
                    {col.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody ref={tbodyRef}>
              {filteredResults.map((result, index) => {
                const isAfterHighlighted = index > 0 && filteredResults[index - 1].isHighlighted && !result.isHighlighted
                const finalBorderClass = isAfterHighlighted ? 'border-t-2 border-t-green-500' : ''

                const rowClass = getRowClasses({ result, command, names, isNamesFilterEnabled, isFinal })
                const highlight = getRowHighlight({ result, command, names, isNamesFilterEnabled, isFinal })

                return <tr
                  key={rowKeys[index]}
                  data-row-key={rowKeys[index]}
                  data-row-signature={getRowSignature(result)}
                  className={`border-b border-white transition-colors ${finalBorderClass} ${rowClass || 'bg-white'}`}
                >
                  {config.map((col, index) => {
                    const value = String((result as LeadQualItem | LeadQualResultItem | LeadFinalsItem | BoulderQualItem | BoulderFinalItem | SpeedQualItem)[col.prop as Exclude<keyof typeof result, 'isHighlighted'>] ?? '');
                    const isBoulderCell = value.includes('/') && !SPECIAL_STATUSES.includes(value.toLowerCase());
                    if (isBoulderCell) {
                      return <td key={`${col.id}-${index}`} className="px-0.5 py-1">
                        <BoulderCell value={value} />
                      </td>
                    }
                    return (
                      <td key={`${col.id}-${index}`} className={`px-1 md:px-2 py-1 text-left ${col.name === NAME_COL ? STICKY_NAME_CLASS : ''} ${col.name === NAME_COL && highlight === 'own' ? 'font-bold' : 'font-medium'} ${SECONDARY_PROPS.includes(col.prop as string) ? (rowClass ? 'text-gray-600' : 'text-gray-500') : ''}`}>
                        {value}
                        {/* Своих видно не только по цвету: имя жирное, а экранный чтец слышит приписку */}
                        {col.name === NAME_COL && highlight && <span className="sr-only">, {ROW_HIGHLIGHT_LABELS[highlight]}</span>}
                      </td>
                    );
                  })}
                </tr>
              })}
              
              {/* Сообщение если нет результатов */}
              {filteredResults.length === 0 && !isLoading && !error && (
                <tr className="border-b">
                  <td colSpan={config.length || 1} className="px-2 py-3 text-center text-gray-500">
                    {emptyMessage}
                  </td>
                </tr>
              )}
            </tbody>
          </table>}
          
          {/* Оверлей для загрузки */}
          {isLoading && (
            <div className="absolute inset-0 bg-white/30 flex items-center justify-center" role="status">
              <div className="flex items-center justify-center space-x-2 space-y-2 text-gray-500">
                <FontAwesomeIcon icon={faSpinner} spin />
                <span className="text-lg font-medium">Загружаем протокол…</span>
              </div>
            </div>
          )}
          
        </div>

        {error && !results.length && (
          <div className="mt-2 px-4 py-6 rounded-lg bg-red-50 text-red-800 text-center" role="alert">
            <h3 className="text-lg font-semibold mb-1">Не удалось загрузить протокол</h3>
            <p className="mb-4">{error}</p>
            <Button variant="danger" onClick={() => refetch()}>
              Повторить
            </Button>
          </div>
        )}
      </div>
    )
  }
