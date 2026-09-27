import { ReactNode } from 'react'
import { Status } from '@/src/shared/types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { STATUSES } from '@/src/shared/constants'

export default function StatusIcon({ status, onlyOnline }: { status: Status, onlyOnline?: boolean }): ReactNode | null {
 if (status === STATUSES.PENDING) return null;
 if (onlyOnline && status !== STATUSES.ONLINE) return null;
 const isOnline = status === STATUSES.ONLINE;
 // Точка и галочка передают статус только цветом и формой — текст нужен экранному чтецу, подсказка — мыши
 const label = isOnline ? 'идёт сейчас' : 'есть результаты'
  return (
    <div className="w-4 mr-1 flex items-center justify-center" title={label}>
      {isOnline ? (
        // Точка «в эфире» видна всегда, пульсирует только ореол вокруг неё
        <span className="relative flex size-2.5">
          <span className="absolute inset-0 rounded-full bg-live-halo opacity-75 motion-safe:animate-ping" />
          <span className="relative size-2.5 rounded-full bg-live" />
        </span>
      ) : (
        <FontAwesomeIcon icon={faCheck} className="text-done" />
      )}
      {/* Запятая отделяет статус от названия протокола в имени кнопки: «есть результаты, Финал» */}
      <span className="sr-only">{label}, </span>
    </div>
  )
}
