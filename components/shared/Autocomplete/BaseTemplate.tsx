export default function BaseTemplate(item: string, value: any) {
  const selectedClass = value === item ? 'bg-blue-200' : ''
    return (
      <div className={`px-3 py-2 hover:bg-blue-200 focus:bg-blue-200 focus:outline-none ${selectedClass}`}>
        {item}
      </div>
    )
  }
