import { Subgroup, Results } from '@/types'
import useResults from '@/lib/hooks/useResults'
import { NAME_COL } from './configs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRefresh, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { getRowClasses, getTableConfig, isCommandMatch } from './utils';
import BoulderCell from './BoulderCell';


export default function Table({
  subGroup,
  code,
  isCommandFilterEnabled,
  command,
}: {
  subGroup: Subgroup | undefined,
  code: string,
  isCommandFilterEnabled: boolean,
  command: string,
}) {
    if (!subGroup) return null;
    
    const { results, isLead, isBoulder, isFinal, isQualResult, isLoading, error, loadResults } = useResults({
      code,
      subgroupLink: subGroup.link
    })
    
    const filterResultsByCommand = (results: Results) => {
      if (!isCommandFilterEnabled || !command) {
        return results
      }
      return results.filter((result, index) => index===0 || isCommandMatch(result.command, command))
    }

    const filteredResults: Results = filterResultsByCommand(results as Results)
    const climbedCount = results.filter((result: Results[number]) => 
      'score' in result ? result.score !== '' : result.score1 !== ''
    ).length

    const config = getTableConfig({ isFinal, isQualResult, isLead, isBoulder })

    return (
      <div className="mt-4 relative">
        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex justify-between">
          {subGroup.title}
          <div>
            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {climbedCount} / {results.length} пролезло
            </span>
            <FontAwesomeIcon icon={faRefresh} 
              className="cursor-pointer text-sm text-blue-600 rounded hover:text-blue-800 transition-colors ml-2"
              onClick={loadResults}
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
              {filteredResults.map((result, index) => (
                <tr
                  key={`${result.name}-${index}`}
                  className={`border-b transition-colors ${getRowClasses({ result, isFinal, isQualResult, isLead, command })}`}
                >
                  {config.map((col) => {
                    const value = result[col.prop as keyof typeof result];
                    const isBoulder = value.includes('/');
                    if (isBoulder) {
                      return <BoulderCell id={col.id} value={value} />
                    }
                    return (
                      <td key={col.id} className="px-2 py-1 text-left font-medium">
                        {value}
                      </td>
                    );
                  })}
                </tr>
              ))}
              
              {/* Сообщение если нет результатов */}
              {filteredResults.length === 0 && !isLoading && !error && (
                <tr className="border-b">
                  <td colSpan={config.length} className="px-2 py-1 text-center text-gray-500">
                    Результаты пока не доступны
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
