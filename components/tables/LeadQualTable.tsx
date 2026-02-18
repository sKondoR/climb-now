import { isCityMatch } from '@/lib/isCityMatch';
import { Subgroup, Results, SubgroupResults } from '@/types'

export default function LeadQualTable({
  subGroup,
  subgroupResults,
  isCityFilterEnabled,
  selectedCity,
}: {
  subGroup: Subgroup | undefined,
  subgroupResults: SubgroupResults,
  isCityFilterEnabled: boolean,
  selectedCity: string,
}) {
    if (!subGroup) return null;
    const currentResults = subgroupResults[subGroup.id]
    const results = currentResults?.results || subGroup.results
    if (!results) return null;

  const filterResultsByCity = (results: Results) => {
    if (!isCityFilterEnabled || !selectedCity) {
      return results
    }
    return results.filter((result, index) => index===0 || isCityMatch(result.command, selectedCity))
  }

    const filteredResults: Results = filterResultsByCity(results)
    const climbedCount = results.filter((result) => result.score !== '').length;

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
                <th className="text-left px-4 py-2 w-12">Место</th>
                <th className="text-left px-4 py-2 w-12">ст.#</th>
                <th className="text-left px-4 py-2">Имя</th>
                <th className="text-left px-4 py-2">Команда</th>
                <th className="text-left px-4 py-2 w-24">Результат</th>
              </tr>
            </thead>
            <tbody>
              {currentResults?.isLoading && (
                <tr className="border-b">
                  <td colSpan={5} className="px-4 py-4 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span className="text-gray-600">Загрузка результатов...</span>
                    </div>
                  </td>
                </tr>
              )}
              
              {currentResults?.error && (
                <tr className="border-b">
                  <td colSpan={5} className="px-4 py-4 text-center text-red-500">
                    Ошибка загрузки: {currentResults.error}
                  </td>
                </tr>
              )}
              
              {filteredResults.map((result) => (
                <tr
                  key={result.name}
                  className={`border-b transition-colors ${
                    isCityMatch(result.command, selectedCity) ? 'bg-green-300 border-blue-200' : ''
                  }`}
                >
                  <td className="px-4 py-2 text-center font-medium">{result.rank}</td>
                  <td className="px-4 py-2 text-center font-medium">{result.stRank}</td>
                  <td className="px-4 py-2">
                    <span className="font-medium">
                      {result.name}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${
                      isCityMatch(result.command, selectedCity)
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {result.command}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-center">{result.score}</td>
                </tr>
              ))}
              
              {/* Сообщение если нет результатов */}
              {filteredResults.length === 0 && !currentResults?.isLoading && !currentResults?.error && (
                <tr className="border-b">
                  <td colSpan={4} className="px-4 py-4 text-center text-gray-500">
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
