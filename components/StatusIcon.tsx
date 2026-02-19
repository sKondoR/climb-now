import { Status } from '@/types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faCircle } from '@fortawesome/free-solid-svg-icons'
import { STATUSES } from '@/lib/constants';

export default function StatusIcon({ status }: { status: Status }): JSX.Element | null {
 if (status === STATUSES.PENDING) return null;
 const icon = status === STATUSES.ONLINE ? faCircle : faCheck;
  return (
    <div className="w-4 mr-1"><FontAwesomeIcon icon={icon} className="text-green-500" /></div>
  )
}