'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function FloatingButton() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <button
      onClick={() => router.push('/quero-comecar')}
      className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-full p-4 shadow-2xl flex items-center gap-2 transition-all transform hover:scale-110 animate-bounce border-0 cursor-pointer"
      aria-label="Ganhe 100% - Calcule seu lucro"
    >
      <span className="text-2xl">💰</span>
      <div className="text-sm font-bold whitespace-nowrap">
        <div>GANHE 100%</div>
        <div className="text-xs opacity-90">Calcule seu lucro</div>
      </div>
    </button>
  );
}
