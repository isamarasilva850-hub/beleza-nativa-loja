"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Product {
  id: string;
  ref: string;
  name: string;
  price: number;
}

export default function CorrigirPrecosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingPrice, setEditingPrice] = useState("");
  const [saving, setSaving] = useState(false);

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

  const handleSavePrice = async (productId: string, newPrice: string) => {
    if (!newPrice.trim()) return;

    try {
      setSaving(true);
      const response = await fetch("/api/admin/update-product-price", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          newPrice: parseFloat(newPrice),
        }),
      });

      if (response.ok) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === productId
              ? { ...p, price: parseFloat(newPrice) }
              : p
          )
        );
        setEditingId(null);
        setEditingPrice("");
      }
    } catch (err) {
      console.error("Erro ao salvar preço:", err);
    } finally {
      setSaving(false);
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
      <div className="max-w-5xl mx-auto">
        <Link href="/admin/palmira" className="text-sm text-gray-500 hover:text-gray-700 mb-6 block">
          ← Voltar
        </Link>

        <h1 className="text-3xl font-bold text-gray-800 mb-6">💰 Corrigir Preços</h1>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <input
            type="text"
            placeholder="Buscar por REF ou nome..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7BC9C2] focus:border-transparent"
          />
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {filteredProducts.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Nenhum produto encontrado
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-[#7BC9C2] to-[#5fb3ac] text-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">REF</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Nome do Produto</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Preço Atual</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product, idx) => (
                    <tr
                      key={product.id}
                      className={`border-b ${idx % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-blue-50 transition-colors`}
                    >
                      <td className="px-6 py-4 text-sm font-mono font-bold text-gray-700">
                        {product.ref}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800">
                        {product.name}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-[#7BC9C2]">
                        {editingId === product.id ? (
                          <div className="flex gap-2">
                            <input
                              type="number"
                              step="0.01"
                              value={editingPrice}
                              onChange={(e) => setEditingPrice(e.target.value)}
                              className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                              placeholder="Novo preço"
                              autoFocus
                            />
                            <button
                              onClick={() => handleSavePrice(product.id, editingPrice)}
                              disabled={saving}
                              className="bg-green-500 hover:bg-green-600 disabled:bg-green-400 text-white text-xs px-2 py-1 rounded transition-colors"
                            >
                              ✓
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="bg-gray-400 hover:bg-gray-500 text-white text-xs px-2 py-1 rounded transition-colors"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <span>R$ {product.price.toFixed(2).replace(".", ",")}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {editingId !== product.id && (
                          <button
                            onClick={() => {
                              setEditingId(product.id);
                              setEditingPrice(product.price.toString());
                            }}
                            className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-4 py-2 rounded transition-colors"
                          >
                            ✏️ Editar
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <p className="text-blue-900">
            <strong>💡 Dica:</strong> Procure o produto por REF ou nome, clique em "Editar", digite o novo preço e aperte ✓ para salvar.
          </p>
        </div>
      </div>
    </div>
  );
}
