import GroupColumn from '@/components/tables/GroupColumn'
import { Discipline } from '@/types'

interface PageContentProps {
  discipline?: Discipline
  selectedCity: string
  urlCode: string
  isCityFilterEnabled: boolean
}


export default function PageContent({
  discipline,
  selectedCity,
  urlCode,
  isCityFilterEnabled
}: PageContentProps) {

  if (!discipline) {
    return (<div className="text-center py-12">
      <div className="text-2xl font-semibold text-gray-600 mb-4">
        Добро пожаловать в ClimbNow!
      </div>
      <div className="text-gray-500 max-w-md mx-auto">
        Введите код соревнований и город для отображения результатов
      </div>
    </div>)
  }
  console.log('discipline', discipline);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 text-sm">
      {discipline.groups.map((group) => (
        <GroupColumn 
          key={group.id}
          group={group}
          selectedCity={selectedCity}
          urlCode={urlCode}
          isCityFilterEnabled={isCityFilterEnabled}
        />
      ))}
    </div>
  )
}