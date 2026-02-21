import { Status } from '@/types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faCircle } from '@fortawesome/free-solid-svg-icons'
import { STATUSES } from '@/lib/constants';

export default function StatusIcon({ status, onlyOnline }: { status: Status, onlyOnline?: boolean }): JSX.Element | null {
 if (status === STATUSES.PENDING) return null;
 if (onlyOnline && status !== STATUSES.ONLINE) return null;
 const isOnline = status === STATUSES.ONLINE;
 const icon = isOnline ? faCircle : faCheck;
  return (
    <div className="w-4 mr-1"><FontAwesomeIcon icon={icon} className={`text-green-500 ${isOnline ? 'animate-ping' : ''}`} /></div>
  )
}