import { ReactNode } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExternalLinkSquare } from '@fortawesome/free-solid-svg-icons'
import { EXTERNAL_API_BASE_URL } from '@/lib/constants'

interface LinkToEventProps {
  code: string | null
}

export default function LinkToEvent({ code }: LinkToEventProps): ReactNode | null {
  if (!code) return null
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