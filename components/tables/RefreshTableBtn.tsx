import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRefresh } from '@fortawesome/free-solid-svg-icons'

interface RefreshTableBtnProps {
  refetch: () => void
}

export default function RefreshTableBtn({
  refetch,
}: RefreshTableBtnProps) {
    const [isRefreshing, setIsRefreshing] = useState(false);
    return (
      <FontAwesomeIcon icon={faRefresh}
        className={`cursor-pointer text-sm text-blue-600 rounded hover:text-blue-800 transition-colors ml-2 ${isRefreshing ? 'animate-spin' : ''}`}
        onClick={() => {
          setIsRefreshing(true);
          refetch();
          setTimeout(() => setIsRefreshing(false), 1000);
        }}
      />
    )
  }
