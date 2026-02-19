import { isCityMatch } from '@/lib/isCityMatch';
import { Subgroup, Results } from '@/types'
import useResults from '@/lib/hooks/useResults'
import { leadFinalsConfig, leadQualConfig, leadQualResultsConfig, NAME_COL } from './configs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRefresh, faSpinner } from '@fortawesome/free-solid-svg-icons';

export default function LeadQualTable({
  subGroup,
  urlCode,
  isCityFilterEnabled,
  selectedCity,
}: {
  subGroup: Subgroup | undefined,
  urlCode: string,
  isCityFilterEnabled: boolean,
  selectedCity: string,
}) {
    if (!subGroup) return null;
    
    const { results, isLead, isFinal, isQualResult, isLoading, error, loadResults } = useResults({
      urlCode,
      subgroupLink: subGroup.link
    })
    
    const filterResultsByCity = (results: Results) => {
      if (!isCityFilterEnabled || !selectedCity) {
        return results
      }
      return results.filter((result, index) => index===0 || isCityMatch(result.command, selectedCity))
    }

    const filteredResults: Results = filterResultsByCity(results as Results)
    const climbedCount = results.filter((result: Results[number]) => 
      'score' in result ? result.score !== '' : result.score1 !== ''
    ).length;

    const config = isFinal ? leadFinalsConfig : (isQualResult ? leadQualResultsConfig : leadQualConfig);

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
                  <th key={col.id} className={`text-left px-4 py-2 ${col.name === NAME_COL ? '' : 'w-6'}`}>
                    {col.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredResults.map((result, index) => (
                <tr
                  key={`${result.name}-${index}`}
                  className={`border-b transition-colors ${
                    isCityMatch(result.command, selectedCity) ? 'bg-green-300 border-blue-200' : ''
                  }`}
                >
                  {config.map((col) => {
                    const value = result[col.prop as keyof typeof result];
                    return (
                      <td key={col.id} className="px-4 py-2 text-left font-medium">
                        {value}
                      </td>
                    );
                  })}
                </tr>
              ))}
              
              {/* Сообщение если нет результатов */}
              {filteredResults.length === 0 && !isLoading && !error && (
                <tr className="border-b">
                  <td colSpan={config.length} className="px-4 py-4 text-center text-gray-500">
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
            <div className="absolute inset-0 bg-red-500 bg-opacity-80 flex items-center justify-center">
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
