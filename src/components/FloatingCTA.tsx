'use client';

import Link from 'next/link';

export default function FloatingCTA() {
  return (
    <Link href="/quero-comecar">
      <div className="fixed bottom-6 right-6 z-40 animate-bounce">
        <button className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-full p-4 shadow-2xl flex items-center gap-2 transition-all transform hover:scale-110">
          <span className="text-2xl">💰</span>
          <div className="text-sm font-bold whitespace-nowrap">
            <div>GANHE 100%</div>
            <div className="text-xs opacity-90">Calcule seu lucro</div>
          </div>
        </button>
      </div>
    </Link>
  );
}
