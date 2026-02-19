import { Discipline } from '@/types'

interface DisciplineTabsProps {
  disciplines?: Discipline[]
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
    <div className="flex space-x-1 mb-4 justify-center ">
        {disciplines.map(({ discipline }, index: number) => (
            <button
              key={discipline}
              onClick={() => {
                setActiveTab(index)
              }}
              className={`px-4 py-1 rounded-lg text-lg font-medium transition-colors bg-gray-100 text-gray-700 hover:bg-blue-700 hover:text-white ${
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
