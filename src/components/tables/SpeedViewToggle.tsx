import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSitemap, faList } from '@fortawesome/free-solid-svg-icons'

interface SpeedViewToggleProps {
  isSpeedTree: boolean
  setIsSpeedTree: (isTree: boolean) => void
}

// Финал скорости — деревом, как на c-f-r.ru, или списком по раундам. Один переключатель на все группы дисциплины
export default function SpeedViewToggle({ isSpeedTree, setIsSpeedTree }: SpeedViewToggleProps) {
  return (
    <span className="shrink-0 self-center mb-1 ml-2 inline-flex rounded-lg bg-blue-100 p-0.5 text-base" role="group" aria-label="Вид финала">
      {[{ label: 'Сетка', icon: faSitemap, iconClass: 'rotate-90', isTree: true, roundClass: 'rounded-l-md' }, { label: 'Список', icon: faList, iconClass: '', isTree: false, roundClass: 'rounded-r-md' }].map(({ label, icon, iconClass, isTree, roundClass }) => (
        <button
          key={label}
          type="button"
          aria-label={label}
          title={label}
          aria-pressed={isSpeedTree === isTree}
          onClick={() => setIsSpeedTree(isTree)}
          className={`w-10 h-8 inline-flex items-center justify-center ${roundClass} transition-colors focus-ring ${isSpeedTree === isTree ? 'bg-blue-600 text-white' : 'text-blue-800 hover:bg-blue-200'}`}
        >
          <FontAwesomeIcon icon={icon} className={iconClass} />
        </button>
      ))}
    </span>
  )
}
