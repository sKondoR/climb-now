import { ReactNode } from 'react'
import { Discipline } from '@/src/shared/types'
import { STATUSES } from '@/src/shared/constants'
import StatusIcon from './StatusIcon'

interface DisciplineTabsProps {
  disciplines: Discipline[] | null
  setActiveTab: (index: number) => void
  activeTab: number
  children?: ReactNode
}

export default function DisciplineTabs({
  disciplines,
  setActiveTab,
  activeTab,
  children,
}: DisciplineTabsProps) {

  if (!disciplines) return null
  return (
    // Один ряд: на узком экране прокручивается, на широком стоит по центру
    <div className="overflow-x-auto overscroll-x-contain no-scrollbar">
    <div className="flex gap-x-1 justify-center w-max min-w-full" role="group" aria-label="Дисциплина">
        {/* Равные поля по краям: появление элемента справа не сдвигает табы с центра. На узком экране места жалко — без полей */}
        <div className="shrink-0 w-24 max-md:hidden" aria-hidden />
        {disciplines.map(({ discipline, groups }, index: number) => (
            <button
              key={`${discipline}-${index}`}
              // Выбранная дисциплина отличается только цветом — экранному чтецу её сообщает aria-pressed
              aria-pressed={activeTab === index}
              onClick={() => {
                setActiveTab(index)
              }}
              className={`shrink-0 flex items-center whitespace-nowrap px-4 py-2 md:py-1 mb-1 rounded-lg text-base md:text-lg font-medium transition-colors focus-ring focus-visible:ring-inset
                ${
                activeTab === index
                  ? 'bg-blue-600 text-white focus-visible:ring-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-900 focus-visible:ring-blue-500'
              }`}
            >
              {discipline}
              {/* Точка «в эфире», если в дисциплине хоть одна подгруппа идёт сейчас */}
              <StatusIcon
                status={groups.some((group) => group.subgroups.some((subgroup) => subgroup.status === STATUSES.ONLINE)) ? STATUSES.ONLINE : STATUSES.PENDING}
                onDark={activeTab === index}
              />
            </button>
        ))}
        <div className="shrink-0 md:w-24 flex">{children}</div>
    </div>
    </div>
  )
}
