export default function BoulderCell({ id, value }: { id: string, value: string }): JSX.Element | null {
  const [val1, val2] = value.split('/');
  return (
    <td key={id} className="text-left font-medium">
      <div className="bg-gray-200 inset text-center flex flex-col h-full">
        {val1 !== ' ' ?
          <div className={`flex-1 ${val1 !== ' ' ? 'bg-red-300' : ''}`}>{val1}</div> : 
          <div className="flex-1 text-white/0">-</div>
        }
        {val2 !== ' ' ?
          <div className={`flex-1 ${val2 !== ' ' ? 'bg-red-300' : ''}`}>{val2}</div> : 
          <div className="flex-1 text-white/0">-</div>
        }
      </div>
    </td>
  )
}