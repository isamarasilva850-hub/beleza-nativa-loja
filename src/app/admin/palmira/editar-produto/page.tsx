"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Color {
  id: string;
  color_name: string;
  color_hex: string;
  qty_p: number;
  qty_m: number;
  qty_g: number;
  qty_gg: number;
}

interface Image {
  id: string;
  image_base64?: string;
  image_url?: string;
}

interface Product {
  id: string;
  ref: string;
  name: string;
  price: number;
  gender: string;
  colors: Color[];
  images: Image[];
}

export default function EditarProdutoPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editingColor, setEditingColor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/products");
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      console.error("Erro ao carregar produtos:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.ref.toLowerCase().includes(search.toLowerCase()) ||
      p.name.toLowerCase().includes(search.toLowerCase())
  );

  const deleteColor = async (colorId: string) => {
    if (!window.confirm("Deletar esta cor?")) return;

    try {
      const response = await fetch("/api/admin/delete-color", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ colorId }),
      });

      if (response.ok) {
        setSelectedProduct((prev) =>
          prev
            ? {
                ...prev,
                colors: prev.colors.filter((c) => c.id !== colorId),
              }
            : null
        );
      }
    } catch (err) {
      console.error("Erro:", err);
    }
  };

  const deleteImage = async (imageId: string) => {
    if (!window.confirm("Deletar esta foto?")) return;

    try {
      const response = await fetch("/api/admin/delete-image", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageId }),
      });

      if (response.ok) {
        setSelectedProduct((prev) =>
          prev
            ? {
                ...prev,
                images: prev.images.filter((i) => i.id !== imageId),
              }
            : null
        );
      }
    } catch (err) {
      console.error("Erro:", err);
    }
  };

  const updateColor = async (colorId: string, updates: Partial<Color>) => {
    try {
      const response = await fetch("/api/admin/update-color", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ colorId, ...updates }),
      });

      if (response.ok) {
        setSelectedProduct((prev) =>
          prev
            ? {
                ...prev,
                colors: prev.colors.map((c) =>
                  c.id === colorId ? { ...c, ...updates } : c
                ),
              }
            : null
        );
        setEditingColor(null);
      }
    } catch (err) {
      console.error("Erro:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7BC9C2] mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando produtos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/admin/palmira" className="text-sm text-gray-500 hover:text-gray-700 mb-6 block">
          ← Voltar
        </Link>

        {!selectedProduct ? (
          <>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">✏️ Editar Produto</h1>

            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <input
                type="text"
                placeholder="Buscar por REF ou nome..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7BC9C2] focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.length === 0 ? (
                <p className="text-gray-500 col-span-full text-center py-8">
                  Nenhum produto encontrado
                </p>
              ) : (
                filteredProducts.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => setSelectedProduct(product)}
                    className="bg-white rounded-lg shadow hover:shadow-lg transition-all text-left p-4 border-l-4 border-[#7BC9C2] hover:bg-blue-50"
                  >
                    <p className="text-xs text-gray-400 font-mono">REF {product.ref}</p>
                    <h3 className="font-bold text-gray-800 line-clamp-2">{product.name}</h3>
                    <p className="text-sm text-[#7BC9C2] font-bold mt-2">
                      R$ {product.price.toFixed(2).replace(".", ",")}
                    </p>
                    <div className="flex gap-2 mt-3 text-xs">
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        {product.colors.length} cores
                      </span>
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                        {product.images.length} fotos
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <button
              onClick={() => setSelectedProduct(null)}
              className="text-sm text-gray-500 hover:text-gray-700 mb-4 block"
            >
              ← Voltar
            </button>

            <div className="mb-8">
              <p className="text-xs text-gray-400 font-mono">REF {selectedProduct.ref}</p>
              <h2 className="text-2xl font-bold text-gray-800">{selectedProduct.name}</h2>
              <p className="text-lg text-[#7BC9C2] font-bold mt-2">
                R$ {selectedProduct.price.toFixed(2).replace(".", ",")}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* CORES */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">🎨 Cores ({selectedProduct.colors.length})</h3>
                {selectedProduct.colors.length === 0 ? (
                  <p className="text-gray-500 text-sm">Nenhuma cor cadastrada</p>
                ) : (
                  <div className="space-y-3">
                    {selectedProduct.colors.map((color) => (
                      <div
                        key={color.id}
                        className="bg-gray-50 border border-gray-200 rounded-lg p-4"
                      >
                        {editingColor === color.id ? (
                          <div className="space-y-2">
                            <input
                              type="text"
                              defaultValue={color.color_name}
                              onBlur={(e) =>
                                updateColor(color.id, {
                                  ...color,
                                  color_name: e.target.value,
                                })
                              }
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                              placeholder="Nome da cor"
                            />
                            <div className="grid grid-cols-4 gap-1 text-xs">
                              {["P", "M", "G", "GG"].map((size, idx) => (
                                <input
                                  key={size}
                                  type="number"
                                  defaultValue={[color.qty_p, color.qty_m, color.qty_g, color.qty_gg][idx]}
                                  onBlur={(e) => {
                                    const updates: any = {};
                                    updates[`qty_${size.toLowerCase()}`] = parseInt(e.target.value) || 0;
                                    updateColor(color.id, updates);
                                  }}
                                  className="px-1 py-1 border border-gray-300 rounded text-center"
                                  placeholder={size}
                                />
                              ))}
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-semibold text-gray-800">{color.color_name}</span>
                              <div
                                className="w-6 h-6 rounded-full border-2 border-gray-300"
                                style={{ backgroundColor: color.color_hex }}
                              />
                            </div>
                            <div className="grid grid-cols-4 gap-2 text-xs mb-2">
                              <div>
                                <span className="text-gray-500">P:</span> {color.qty_p}
                              </div>
                              <div>
                                <span className="text-gray-500">M:</span> {color.qty_m}
                              </div>
                              <div>
                                <span className="text-gray-500">G:</span> {color.qty_g}
                              </div>
                              <div>
                                <span className="text-gray-500">GG:</span> {color.qty_gg}
                              </div>
                            </div>
                          </>
                        )}
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() =>
                              setEditingColor(
                                editingColor === color.id ? null : color.id
                              )
                            }
                            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded transition-colors"
                          >
                            {editingColor === color.id ? "✓ Pronto" : "✏️ Editar"}
                          </button>
                          <button
                            onClick={() => deleteColor(color.id)}
                            className="flex-1 bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 rounded transition-colors"
                          >
                            🗑️ Deletar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* FOTOS */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">📷 Fotos ({selectedProduct.images.length})</h3>
                {selectedProduct.images.length === 0 ? (
                  <p className="text-gray-500 text-sm">Nenhuma foto cadastrada</p>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {selectedProduct.images.map((image, idx) => (
                      <div key={image.id} className="relative group">
                        <div className="bg-gray-100 rounded-lg overflow-hidden h-32">
                          {image.image_base64 ? (
                            <img
                              src={image.image_base64}
                              alt={`Foto ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              📷
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => deleteImage(image.id)}
                          className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ✕
                        </button>
                        <p className="text-xs text-gray-500 mt-1 text-center">#{idx + 1}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
