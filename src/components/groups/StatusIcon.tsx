import { ReactNode } from 'react'
import { Status } from '@/src/shared/types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { STATUSES } from '@/src/shared/constants'

export default function StatusIcon({ status, onlyOnline, onDark }: { status: Status, onlyOnline?: boolean, onDark?: boolean }): ReactNode | null {
 if (status === STATUSES.PENDING) return null;
 if (onlyOnline && status !== STATUSES.ONLINE) return null;
 const isOnline = status === STATUSES.ONLINE;
 const label = isOnline ? 'идёт сейчас' : 'есть результаты'
  return (
    <div className={`flex items-center justify-center ${isOnline ? 'ml-1.5' : 'w-4 mr-1'}`} title={label}>
      {isOnline ? (
        <span className="relative flex size-2.5">
          <span className={`absolute inset-0 rounded-full opacity-75 motion-safe:animate-ping ${onDark ? 'bg-white' : 'bg-live-halo'}`} />
          <span className="relative size-2.5 rounded-full bg-live ring-1 ring-white" />
        </span>
      ) : (
        <FontAwesomeIcon icon={faCheck} className="text-done" />
      )}
      <span className="sr-only">{isOnline ? `, ${label}` : `${label}, `}</span>
    </div>
  )
}
