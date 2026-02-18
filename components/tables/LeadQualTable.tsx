import { isCityMatch } from '@/lib/isCityMatch';
import { Subgroup, Results } from '@/types'
import useResults from '@/lib/hooks/useResults'
import { leadQualConfig, leadQualResultsConfig } from './configs';

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
    
    const { results, isLead, isQualResult, isLoading, error } = useResults({
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

    const config = isQualResult ? leadQualResultsConfig : leadQualConfig;

    return (
      <div className="mt-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex justify-between">
          {subGroup.title}
          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {climbedCount} / {results.length} пролезло
          </span>
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                {config.map((col) => (
                  <th key={col.id} className={`text-left px-4 py-2 ${col.name === 'Имя' ? '' : 'w-12'}`}>
                    {col.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr className="border-b">
                  <td colSpan={config.length} className="px-4 py-4 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span className="text-gray-600">Загрузка результатов...</span>
                    </div>
                  </td>
                </tr>
              )}
              
              {error && (
                <tr className="border-b">
                  <td colSpan={config.length} className="px-4 py-4 text-center text-red-500">
                    Ошибка загрузки: {error}
                  </td>
                </tr>
              )}
              
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
        </div>
      </div>
    )
  }


//   <td className="px-4 py-2 text-center font-medium">{result.rank}</td>
// <td className="px-4 py-2 text-center font-medium">{result.stRank}</td>
// <td className="px-4 py-2">
//   <span className="font-medium">
//     {result.name}
//   </span>
// </td>
// <td className="px-4 py-2">
//   <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${
//     isCityMatch(result.command, selectedCity)
//       ? 'bg-blue-100 text-blue-800' 
//       : 'bg-gray-100 text-gray-800'
//   }`}>
//     {result.command}
//   </span>
// </td>
// <td className="px-4 py-2 text-center">{
//   'score' in result ? result.score : result.score1
// }</td>