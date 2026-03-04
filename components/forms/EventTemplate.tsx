
import { isDateBefore } from '@/lib/utils/date.utils'
import { Event } from '@/types/events'
import { Item } from '@/components/shared/Autocomplete/Autocomplete.types'

export function EventTemplate(item: Event | null, value: Item | null) {
    if (!item?.link) return <>{item}</>
    const highlightClass = isDateBefore(item.enddate) ? 'bg-green-50 ' : ''
    const activeClass = value === item.link ? 'bg-blue-200' : highlightClass
    return (
      <div className={`px-3 py-2 hover:bg-blue-200 focus:bg-blue-200 focus:outline-none ${activeClass}`}>
        <div className="flex justify-beetween">
          <div className="flex-1 mr-3 font-bold">{item.location}</div><div className="text-right">{item.name}</div>
        </div>
        <div className="flex justify-beetween text-xs">
          <div className="flex-1 mr-3">{item.date} {item.year}</div><div className="text-gray-400">{item.link}</div>
        </div>
      </div>
    )
  }
