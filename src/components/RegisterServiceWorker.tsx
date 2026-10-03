'use client';

import { useEffect } from 'react';

export default function RegisterServiceWorker() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js', { scope: '/' }).then((reg) => {
        console.log('✅ Service Worker registrado');

        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          newWorker?.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('🔄 Nova versão disponível, recarregando...');
              window.location.reload();
            }
          });
        });
      }).catch((err) => {
        console.error('❌ Erro ao registrar SW:', err);
      });
    }
  }, []);

  return null;
}
