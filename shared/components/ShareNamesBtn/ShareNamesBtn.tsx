import { ReactNode, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShareAlt } from '@fortawesome/free-solid-svg-icons'
import { copyToClipboard, getShareUrl } from '@/shared/utils/forms.utils'
import { rootStore } from '@/store/root.store'

export default function ShareNamesBtn(): ReactNode | null {
  const formStore = rootStore.formStore
  const names = formStore.names
  const [isCoping, setIsCoping] = useState(false);

  if (!names) return null

  const handleShareClick = () => {
    setIsCoping(true)
    const url = getShareUrl(names)
    copyToClipboard(url)
    setTimeout(() => setIsCoping(false), 700)
  }

  return (
    <button
      type="button"
      onClick={handleShareClick}
      className={`absolute right-0 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-800 focus:outline-none px-3 py-2`}
      aria-label={`Скопировать ссылку с именами: ${names}`}
    >
      <FontAwesomeIcon icon={faShareAlt}
        className={`
          ${isCoping ? 'animate-spin' : ''} 
        `}
      />
    </button>
  )
}