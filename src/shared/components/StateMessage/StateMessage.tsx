import { ReactNode } from 'react'

interface StateMessageProps {
  title: ReactNode
  // Пояснение: что случилось и что делать дальше
  children?: ReactNode
  // Кнопка или ссылка восстановления под пояснением
  action?: ReactNode
  // alert — ошибка, status — загрузка; для остальных состояний не нужен
  role?: 'alert' | 'status'
}

// Полноэкранное состояние страницы вместо списка групп: загрузка, ошибка, «не найдено», приветствие
export const StateMessage = ({ title, children, action, role }: StateMessageProps) => (
  <div className="text-center py-12" role={role}>
    <div className="text-2xl font-semibold text-gray-600 mb-4">
      {title}
    </div>
    {children && (
      <div className={`text-gray-500 max-w-md mx-auto ${action ? 'mb-6' : ''}`}>
        {children}
      </div>
    )}
    {action}
  </div>
)

export default StateMessage
