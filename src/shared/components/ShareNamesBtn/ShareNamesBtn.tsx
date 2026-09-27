import { ReactNode, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faShareAlt } from '@fortawesome/free-solid-svg-icons'
import { copyToClipboard, getShareUrl } from '@/src/shared/utils/forms.utils'
import { rootStore } from '@/src/store/root.store'

const COPIED_FEEDBACK_MS = 1500

export default function ShareNamesBtn(): ReactNode | null {
  const formStore = rootStore.formStore
  const names = formStore.names
  const [isCopied, setIsCopied] = useState(false);

  if (!names) return null

  const handleShareClick = async () => {
    const url = getShareUrl(names)
    if (await copyToClipboard(url)) {
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), COPIED_FEEDBACK_MS)
      return
    }
    // Буфер обмена недоступен — отдаём ссылку, чтобы скопировать вручную
    window.prompt('Скопируйте ссылку', url)
  }

  return (
    <button
      type="button"
      onClick={handleShareClick}
      className={`text-base absolute top-0 text-blue-600 hover:text-blue-800 rounded focus-ring px-2 py-2 right-9 z-[5]`}
      aria-label={`Скопировать ссылку с именами: ${names}`}
      title={isCopied ? 'Ссылка скопирована' : 'Скопировать ссылку с именами'}
    >
      <FontAwesomeIcon icon={isCopied ? faCheck : faShareAlt} className={isCopied ? 'text-green-600' : ''} />
      <span className="sr-only" aria-live="polite">{isCopied ? 'Ссылка скопирована' : ''}</span>
    </button>
  )
}
