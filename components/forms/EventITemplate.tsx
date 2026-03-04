import { EventItem } from '@/types/events'

function EventTemplate(item: EventItem) {
    if (!item?.link) return <>{item}</>
    return (
      <>
        <div className="flex justify-beetween">
          <div className="flex-1 mr-3">{item.location}</div><div className="text-right">{item.name}</div>
        </div>
        <div className="flex justify-beetween text-gray-400">
          <div className="flex-1 mr-3 ">{item.date} {item.year}</div><div>{item.link}</div>
        </div>
      </>
    )
}
export default EventTemplate