import { useEffect, useState } from "react";

export default function useUrlParams() {
  const [params, setParams] = useState<{ code?: string }>({});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      setParams({
        code: urlParams.get('code') || undefined,
      });
    }
  }, []);

  return params;
}