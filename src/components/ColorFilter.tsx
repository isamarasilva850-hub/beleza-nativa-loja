"use client";

import { Product } from "@/data/products";
import { useState, useEffect } from "react";

interface ColorFilterProps {
  products: Product[];
  onColorSelect?: (color: string | null) => void;
}

export default function ColorFilter({ products, onColorSelect }: ColorFilterProps) {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  // Extrair todas as cores únicas e contar produtos
  const colorMap = new Map<string, { hex: string; name: string; count: number }>();

  products.forEach((product) => {
    product.variants.forEach((variant) => {
      const key = variant.colorHex;
      if (!colorMap.has(key)) {
        colorMap.set(key, { hex: variant.colorHex, name: variant.color, count: 0 });
      }
      const color = colorMap.get(key);
      if (color) color.count++;
    });
  });

  const colors = Array.from(colorMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 12); // Top 12 colors

  const handleColorSelect = (colorHex: string) => {
    const newColor = selectedColor === colorHex ? null : colorHex;
    setSelectedColor(newColor);
    onColorSelect?.(newColor ? colorHex : null);
  };

  return (
    <div className="border-b border-gray-200 pb-4 mb-4">
      <h3 className="text-xs font-bold text-gray-900 tracking-wide mb-3">CORES</h3>
      <div className="grid grid-cols-4 gap-3">
        {colors.map((color) => (
          <button
            key={color.hex}
            onClick={() => handleColorSelect(color.hex)}
            className={`relative group transition-all ${
              selectedColor === color.hex ? "scale-125" : "hover:scale-110"
            }`}
            title={`${color.name} (${color.count})`}
          >
            <div
              className="w-12 h-12 rounded-full border-2 shadow-md hover:shadow-lg transition-all"
              style={{
                backgroundColor: color.hex,
                borderColor: selectedColor === color.hex ? "#000" : "#ddd",
                borderWidth: selectedColor === color.hex ? "3px" : "2px",
              }}
            />
            {/* Badge with count */}
            <div className="absolute -bottom-1 -right-1 bg-gray-900 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow">
              {color.count}
            </div>
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              {color.name}
            </div>
          </button>
        ))}
      </div>

      {selectedColor && (
        <button
          onClick={() => handleColorSelect(selectedColor)}
          className="mt-3 w-full text-xs text-primary hover:text-primary-dark font-semibold transition-colors"
        >
          ✕ Limpar filtro de cor
        </button>
      )}
    </div>
  );
}
