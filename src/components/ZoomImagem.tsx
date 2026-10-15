"use client";

import { useRef, useState } from "react";

// Foto que amplia onde o mouse estiver (estilo lupa) e volta ao normal ao sair.
// Use dentro de um contêiner com tamanho fixo.
export default function ZoomImagem({ src, alt, zoom = 2.2 }: { src: string; alt: string; zoom?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  const mover = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    setPos({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };

  return (
    <div
      ref={ref}
      onMouseMove={mover}
      onMouseLeave={() => setPos(null)}
      className="relative w-full h-full overflow-hidden cursor-zoom-in"
    >
      <img
        src={src}
        alt={alt}
        draggable={false}
        className="w-full h-full object-cover select-none"
        style={
          pos
            ? { transform: `scale(${zoom})`, transformOrigin: `${pos.x}% ${pos.y}%`, transition: "transform 0.05s linear" }
            : { transform: "scale(1)", transition: "transform 0.2s ease" }
        }
      />
    </div>
  );
}
