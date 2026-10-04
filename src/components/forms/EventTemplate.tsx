
import { isDateBefore } from '@/src/shared/utils/date.utils'
import { Event } from '@/src/shared/types/events'
import { Item } from '@/src/shared/components/Autocomplete/Autocomplete.types'

export function EventTemplate(item: Event | null, value: Item | null) {
    // Без кода событие не выбрать, а объект целиком React отрисовать не может — такая запись уронила бы всю страницу
    if (!item?.link) return null
    const highlightClass = isDateBefore(item.startdate) ? 'bg-live-tint ' : ''
    const activeClass = value === item.link ? 'bg-blue-200' : highlightClass
    return (
      <div className={`px-3 py-2 hover:bg-blue-200 focus:bg-blue-200 focus:outline-none ${activeClass}`}>
        <div className="flex justify-between">
          <div className="flex-1 mr-3 font-bold">{item.location}</div><div className="text-right">{item.name}</div>
        </div>
        <div className="flex justify-between text-xs">
          <div className="flex-1 mr-3">{item.date} {item.year}</div><div className="text-gray-600">{item.link}</div>
        </div>
      </div>
    )
  }
