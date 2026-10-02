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
      // Справа вплотную к стрелке дропдауна: область клика расширена только влево и по вертикали, чтобы не перехватывать стрелку
      className="block text-2xl mt-8 absolute top-[2px] right-10 z-[5] rounded before:absolute before:content-[''] before:-inset-y-2.5 before:-left-2.5 before:right-0 focus-ring"
      target="_blank"
      rel="noopener noreferrer"
      title="Открыть соревнование на сайте ФСР"
      aria-label="Открыть соревнование на сайте ФСР"
    >
      <FontAwesomeIcon icon={faExternalLinkSquare} className={`text-teal-600 hover:text-blue-700 cursor-pointer`}  />
    </a>
  )
}