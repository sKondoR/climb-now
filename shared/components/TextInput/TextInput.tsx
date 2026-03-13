'use client'

interface TextInputProps {
  value: string
  onChange: (names: string) => void
  placeholder?: string
  label?: string
  labelTitle?: string
  dataLabel?: string
}

export const TextInput = ({
  value = '',
  onChange = () => {},
  placeholder = '',
  label = '',
  labelTitle = '',
  dataLabel = '',
}: TextInputProps) => {
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  return (
    <div className="w-full md:w-auto relative">
      {label && (
        <label
          htmlFor={`TextInput-${String(label)}`}
          className="block text-sm font-medium text-gray-700 mb-2"
          title={labelTitle}
        >
          {label}
          {dataLabel && (
            <span className="text-xs text-gray-500"> (например {dataLabel})</span>
          )}
        </label>
      )}
      <div className="relative">
        <input
          type="text"
          id={`TextInput-${String(label)}`}
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
        />
      </div>
    </div>
  )
}

export default TextInput
