'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExternalLinkSquare } from '@fortawesome/free-solid-svg-icons'
import { EXTERNAL_API_BASE_URL } from '@/lib/constants';
import { rootStore } from '@/lib/store/root.store';

interface LinkToEventProps {
  code: string | null
}

export default function LinkToEvent({ code }: LinkToEventProps): JSX.Element | null {
  const store = rootStore.eventsStore
  if (!code || !store.events) return null
  const hasLink = store.events?.find((event) => event.link === code)
  if (!hasLink) return null
  return (
    <a
      href={`${EXTERNAL_API_BASE_URL}${code}/index.html`}
      className="block text-2xl mt-8 absolute top-[2px] right-10 z-20"
      target="_blank"
      title="открыть на сайте федерации скалолазанья"
    >
      <FontAwesomeIcon icon={faExternalLinkSquare} className={`text-teal-500 hover:text-blue-700 cursor-pointer`}  />
    </a>
  )
}