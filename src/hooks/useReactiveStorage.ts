import { useEffect, useState } from 'react';
import { observeStorageKey } from '@/lib/storageEvents';

export function useReactiveStorage<T>(key: string, parser?: (value: string) => T) {
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    // Carrega valor inicial
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        const parsed = parser ? parser(stored) : JSON.parse(stored);
        setData(parsed);
      } catch (err) {
        console.error(`Erro ao parsear ${key}:`, err);
      }
    }

    // Observa mudanças
    const unsubscribe = observeStorageKey(key, (_, newValue) => {
      setData(newValue);
    });

    return unsubscribe;
  }, [key, parser]);

  return data;
}
