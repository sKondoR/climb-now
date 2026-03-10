import { useState } from 'react';
import { Subgroup, Results } from '@/types'
import { NAME_COL } from './configs'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRefresh, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { getClimbedCount, getFinalBorderClass, getRowClasses, getTableConfig, isCommandMatch } from './tables.utils'
import BoulderCell from './BoulderCell'
import { SPECIAL_STATUSES, STATUSES } from '@/lib/constants'
import useFetchResults from '@/lib/hooks/useFetchResults'

interface TableProps {
  subGroup: Subgroup | undefined,
  code: string,
  isCommandFilterEnabled: boolean,
  command: string,
}

export default function Table({
  subGroup,
  code,
  isCommandFilterEnabled,
  command,
}: TableProps) {
    
    const { results, isLead, isBoulder, isFinal, isQualResult, isLoading, error, refetch } = useFetchResults({
      code,
      isOnline: subGroup?.status === STATUSES.ONLINE,
      subgroupLink: subGroup?.link
    })
    
    const [isRefreshing, setIsRefreshing] = useState(false);
    
    if (!subGroup) return null
    const filterResultsByCommand = (results: Results) => {
      if (!isCommandFilterEnabled || !command) {
        return results
      }
      const filtered = results.filter((result) => isCommandMatch(result.command, command))
      return filtered.length ? results.filter((result) => result.rank === '1' || isCommandMatch(result.command, command)) : []
    }

    const filteredResults: Results = filterResultsByCommand(results as Results)
    const climbedCount = getClimbedCount({ results, isLead, isBoulder });

    const config = getTableConfig({ isFinal, isQualResult, isLead, isBoulder })
    
    let isFinalBorderDrawed = false;
    return (
      <div className="mt-2 relative">
        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex justify-between">
          {subGroup.title}
          <div>
            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {climbedCount} / {results.length} пролезло
            </span>
            <FontAwesomeIcon icon={faRefresh}
              className={`cursor-pointer text-sm text-blue-600 rounded hover:text-blue-800 transition-colors ml-2 ${isRefreshing ? 'animate-spin' : ''}`}
              onClick={() => {
                setIsRefreshing(true);
                refetch();
                setTimeout(() => setIsRefreshing(false), 1000);
              }}
            />
          </div>
        </h3>
        <div className="overflow-x-auto relative">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                {config.map((col) => (
                  <th key={col.id} className={`text-left px-2 py-1 ${col.name === NAME_COL ? '' : 'w-4'}`}>
                    {col.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredResults.map((result, index) => {
                const finalBorderClass = isFinalBorderDrawed ? '' : getFinalBorderClass({ isFinalBorderDrawed, isLead, isQualResult, isFinal, isBoulder, rank: result.rank })
                if (finalBorderClass) {
                  isFinalBorderDrawed = true
                }
                return <tr
                  key={`${result.name}-${index}`}
                  className={`border-b border-white transition-colors ${finalBorderClass} ${getRowClasses({ result, isFinal, isQualResult, isLead, isBoulder, command })}`}
                >
                  {config.map((col, index) => {
                    const value = result[col.prop as keyof typeof result];
                    const isBoulderCell = value.includes('/') && !SPECIAL_STATUSES.includes(value.toLowerCase());
                    if (isBoulderCell) {
                      return <td key={`${col.id}-${index}`} className="text-left font-medium">
                        <BoulderCell value={value} />
                      </td>
                    }
                    return (
                      <td key={`${col.id}-${index}`} className="px-2 py-1 text-left font-medium">
                        {value}
                      </td>
                    );
                  })}
                </tr>
              })}
              
              {/* Сообщение если нет результатов */}
              {filteredResults.length === 0 && !isLoading && !error && (
                <tr className="border-b">
                  <td colSpan={config.length} className="px-2 py-1 text-center text-gray-500">
                    -
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          
          {/* Оверлей для загрузки */}
          {isLoading && (
            <div className="absolute inset-0 bg-white/30 flex items-center justify-center">
              <div className="flex items-center justify-center space-x-2 text-gray-500">
                <FontAwesomeIcon icon={faSpinner} spin />
                <span className="text-lg font-medium">Загрузка результатов...</span>
              </div>
            </div>
          )}
          
          {/* Оверлей для ошибки */}
          {error && (
            <div className="absolute inset-0 bg-red-500 bg-opacommand-80 flex items-center justify-center">
              <div className="text-white text-center">
                <h3 className="text-lg font-semibold mb-2">Ошибка загрузки</h3>
                <p className="text-white">{error}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }
