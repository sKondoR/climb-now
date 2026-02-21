import { DISCIPLINES } from '@/lib/constants';
import { Discipline } from '@/types'

interface DisciplineTabsProps {
  disciplines: Discipline[] | null
  setActiveTab: (index: number) => void
  activeTab: number
}

export default function DisciplineTabs({
  disciplines,
  setActiveTab,
  activeTab,
}: DisciplineTabsProps) {

  if (!disciplines) return null;
  return (
    <div className="flex flex-wrap space-x-1 mb-3 justify-center ">
        {disciplines.map(({ discipline }, index: number) => (
            <button
              key={discipline}
              onClick={() => {
                setActiveTab(index)
              }}
              disabled={discipline === DISCIPLINES.SPEED}
              title={discipline === DISCIPLINES.SPEED ? 'недоступно' : discipline}
              className={`px-4 py-1 mb-1 rounded-lg text-md md:text-lg font-medium transition-colors bg-gray-200 text-gray-700 hover:bg-blue-700 hover:text-white
                disabled:bg-gray-100 disabled:text-gray-300
                ${
                activeTab === index
                  ? 'bg-gradient-to-r from-teal-500 via-emerald-500 to-blue-500 text-white'
                  : ''
              }`}
            >
              {discipline}
            </button>
        ))}
    </div>
  )
}
