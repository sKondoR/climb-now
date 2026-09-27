import { ReactNode } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExternalLinkSquare } from '@fortawesome/free-solid-svg-icons'

import { EXTERNAL_API_BASE_URL } from '@/src/shared/constants'
import { sanitizeEventCode } from '@/src/shared/utils/forms.utils'

interface LinkToEventProps {
  code: string | null
}

export default function LinkToEvent({ code }: LinkToEventProps): ReactNode | null {
  const sanitizedCode = sanitizeEventCode(code)
  if (!sanitizedCode) return null
  return (
    <a
      href={`${EXTERNAL_API_BASE_URL}${sanitizedCode}/index.html`}
      className="block text-2xl mt-8 absolute top-[2px] right-9 z-[5] rounded before:absolute before:content-[''] before:-inset-2.5 focus-ring"
      target="_blank"
      rel="noopener noreferrer"
      title="Открыть соревнование на сайте ФСР"
      aria-label="Открыть соревнование на сайте ФСР"
    >
      <FontAwesomeIcon icon={faExternalLinkSquare} className={`text-teal-600 hover:text-blue-700 cursor-pointer`}  />
    </a>
  )
}