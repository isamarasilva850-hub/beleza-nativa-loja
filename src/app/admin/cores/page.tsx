"use client";

import { useState, useEffect } from "react";
import { products } from "@/data/products";

interface ColorOverride {
  productRef: string;
  originalColor: string;
  newColor: string;
}

export default function CoresPage() {
  const [overrides, setOverrides] = useState<ColorOverride[]>([]);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("belezanativa_color_overrides");
    if (saved) setOverrides(JSON.parse(saved));
  }, []);

  const saveOverrides = (updated: ColorOverride[]) => {
    setOverrides(updated);
    localStorage.setItem("belezanativa_color_overrides", JSON.stringify(updated));
  };

  const getDisplayColor = (productRef: string, originalColor: string) => {
    const override = overrides.find(o => o.productRef === productRef && o.originalColor === originalColor);
    return override ? override.newColor : originalColor;
  };

  const handleEditColor = (productRef: string, originalColor: string) => {
    const key = `${productRef}-${originalColor}`;
    setEditingKey(key);
    setEditValue(getDisplayColor(productRef, originalColor));
  };

  const handleSaveEdit = (productRef: string, originalColor: string) => {
    if (!editValue.trim()) return;

    const updated = overrides.filter(o => !(o.productRef === productRef && o.originalColor === originalColor));

    if (editValue !== originalColor) {
      updated.push({ productRef, originalColor, newColor: editValue });
    }

    saveOverrides(updated);
    setEditingKey(null);
    setEditValue("");
  };

  const handleDeleteOverride = (productRef: string, originalColor: string) => {
    const updated = overrides.filter(o => !(o.productRef === productRef && o.originalColor === originalColor));
    saveOverrides(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Gerenciar Cores</h1>
        <p className="text-sm text-gray-500">Edite o nome das cores dos seus produtos</p>
      </div>

      <div className="space-y-4">
        {products.map((product) => (
          <div key={product.ref} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-1">
                <h3 className="font-bold text-gray-800">{product.name}</h3>
                <p className="text-xs text-gray-500">REF {product.ref}</p>
              </div>
              <span className="px-2 py-1 bg-gray-100 rounded text-xs font-semibold text-gray-600">
                {product.variants.length} cores
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {product.variants.map((variant, idx) => {
                const key = `${product.ref}-${variant.color}`;
                const isEditing = editingKey === key;
                const displayColor = getDisplayColor(product.ref, variant.color);

                return (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div
                      className="w-8 h-8 rounded border border-gray-300 flex-shrink-0"
                      style={{ backgroundColor: variant.colorHex }}
                      title={variant.colorHex}
                    />

                    <div className="flex-1 min-w-0">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="w-full px-2 py-1 border border-[#7BC9C2] rounded text-sm focus:outline-none"
                          autoFocus
                        />
                      ) : (
                        <button
                          onClick={() => handleEditColor(product.ref, variant.color)}
                          className="w-full text-left px-2 py-1 rounded hover:bg-gray-200 transition-colors text-sm font-medium text-gray-800 truncate"
                        >
                          {displayColor}
                        </button>
                      )}
                      <p className="text-[10px] text-gray-500 mt-0.5">Original: {variant.color}</p>
                    </div>

                    {isEditing ? (
                      <div className="flex gap-1 flex-shrink-0">
                        <button
                          onClick={() => handleSaveEdit(product.ref, variant.color)}
                          className="px-2 py-1 bg-green-500 text-white rounded text-xs font-bold hover:bg-green-600"
                        >
                          ✓
                        </button>
                        <button
                          onClick={() => setEditingKey(null)}
                          className="px-2 py-1 bg-gray-300 text-gray-700 rounded text-xs font-bold hover:bg-gray-400"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <>
                        {displayColor !== variant.color && (
                          <button
                            onClick={() => handleDeleteOverride(product.ref, variant.color)}
                            className="px-2 py-1 text-xs text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Restaurar nome original"
                          >
                            ⟲
                          </button>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
