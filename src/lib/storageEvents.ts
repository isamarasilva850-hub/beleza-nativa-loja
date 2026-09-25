// Sistema centralizado de notificação de mudanças em localStorage
// Quando a Palmira salva algo, todos os observadores são notificados

type StorageEventCallback = (key: string, newValue: any) => void;

const listeners: Map<string, Set<StorageEventCallback>> = new Map();

export function notifyStorageChange(key: string, value: any) {
  // Dispara evento nativo do browser (funciona entre abas)
  window.dispatchEvent(
    new StorageEvent('storage', {
      key,
      newValue: JSON.stringify(value),
      storageArea: localStorage,
    })
  );

  // Dispara para observadores locais (mesma página)
  const callbacks = listeners.get(key);
  if (callbacks) {
    callbacks.forEach((callback) => callback(key, value));
  }
}

export function observeStorageKey(key: string, callback: StorageEventCallback) {
  // Registra observador local
  if (!listeners.has(key)) {
    listeners.set(key, new Set());
  }
  listeners.get(key)!.add(callback);

  // Também escuta evento nativo do browser
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === key && e.newValue) {
      try {
        const newValue = JSON.parse(e.newValue);
        callback(key, newValue);
      } catch (err) {
        console.error('Erro ao parsear valor de localStorage:', err);
      }
    }
  };

  window.addEventListener('storage', handleStorageChange);

  // Retorna função para parar de observar
  return () => {
    listeners.get(key)?.delete(callback);
    window.removeEventListener('storage', handleStorageChange);
  };
}

export function useStorageListener(key: string) {
  return (callback: (value: any) => void) => {
    return observeStorageKey(key, (_, value) => callback(value));
  };
}
