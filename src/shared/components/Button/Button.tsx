import { ButtonHTMLAttributes } from 'react'

// primary — основное действие на экране состояния (синий), danger — восстановление внутри красного блока ошибки
type ButtonVariant = 'primary' | 'danger'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'px-4 py-2 bg-blue-600 hover:bg-blue-700 focus-visible:ring-blue-500',
  danger: 'px-4 py-1.5 text-sm bg-red-600 hover:bg-red-700 focus-visible:ring-red-500',
}

export const Button = ({ variant = 'primary', type = 'button', className = '', ...props }: ButtonProps) => (
  <button
    type={type}
    className={`rounded-lg font-medium text-white transition-colors focus-ring focus-visible:ring-offset-2 ${VARIANT_CLASSES[variant]} ${className}`}
    {...props}
  />
)

export default Button
