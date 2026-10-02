import { Discipline } from '@/src/shared/types'

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

  if (!disciplines) return null
  return (
    // Один ряд: на узком экране прокручивается, на широком стоит по центру
    <div className="overflow-x-auto overscroll-x-contain no-scrollbar">
    <div className="flex gap-x-1 justify-center w-max min-w-full" role="group" aria-label="Дисциплина">
        {disciplines.map(({ discipline }, index: number) => (
            <button
              key={`${discipline}-${index}`}
              // Выбранная дисциплина отличается только цветом — экранному чтецу её сообщает aria-pressed
              aria-pressed={activeTab === index}
              onClick={() => {
                setActiveTab(index)
              }}
              className={`shrink-0 whitespace-nowrap px-4 py-2 md:py-1 mb-1 rounded-lg text-base md:text-lg font-medium transition-colors focus-ring focus-visible:ring-inset
                ${
                activeTab === index
                  ? 'bg-blue-600 text-white focus-visible:ring-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-900 focus-visible:ring-blue-500'
              }`}
            >
              {discipline}
            </button>
        ))}
    </div>
    </div>
  )
}
