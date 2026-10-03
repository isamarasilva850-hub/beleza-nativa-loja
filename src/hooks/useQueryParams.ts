import { useEffect, useState } from 'react';

export function useQueryParams() {
  const [params, setParams] = useState<Record<string, string>>({});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const paramsObj: Record<string, string> = {};
      searchParams.forEach((value, key) => {
        paramsObj[key] = value;
      });
      setParams(paramsObj);
    }
  }, [typeof window !== 'undefined' ? window.location.href : '']);

  return params;
}
