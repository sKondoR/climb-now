import { ReactNode, memo } from 'react'

interface BoulderCellProps {
  value: string;
}

// Значение — «попытки на топ/попытки на зону»; пробел — не пролезено
const BoulderCell = memo(({ value }: BoulderCellProps): ReactNode | null => {
  const [top, zone] = value.split('/');
  const hasTop = top !== ' ';
  const hasZone = zone !== ' ';
  if (!hasTop && !hasZone) {
    return <div className="mx-auto w-7 h-8 rounded-sm bg-gray-200" />
  }
  return (
      <div className="mx-auto w-7 h-8 rounded-sm overflow-hidden flex flex-col text-center text-xs font-bold leading-4 text-white">
        <div className={`flex-1 ${hasTop ? 'bg-red-500' : 'bg-gray-100'}`}>{hasTop ? top : ''}</div>
        <div className={`flex-1 ${hasTop ? 'bg-red-600' : 'bg-blue-500'}`}>{hasZone ? zone : ''}</div>
      </div>
  )
})

BoulderCell.displayName = 'BoulderCell'

export default BoulderCell
