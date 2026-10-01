"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Product {
  id: string;
  ref: string;
  name: string;
  order: number;
  image?: string;
}

export default function ReordenarProdutosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [draggedItem, setDraggedItem] = useState<number | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/products");
      const data = await response.json();

      const formatted = data.map((item: any, index: number) => ({
        id: item.id || index.toString(),
        ref: item.ref,
        name: item.name,
        order: item.display_order ?? index,
        image: item.images?.[0]?.image_base64 || item.images?.[0]?.image_url,
      }));

      formatted.sort((a: Product, b: Product) => a.order - b.order);
      setProducts(formatted);
    } catch (err) {
      console.error("Erro ao carregar produtos:", err);
      setError("Erro ao carregar produtos");
    } finally {
      setLoading(false);
    }
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newProducts = [...products];
    [newProducts[index], newProducts[index - 1]] = [newProducts[index - 1], newProducts[index]];
    setProducts(newProducts);
  };

  const moveDown = (index: number) => {
    if (index === products.length - 1) return;
    const newProducts = [...products];
    [newProducts[index], newProducts[index + 1]] = [newProducts[index + 1], newProducts[index]];
    setProducts(newProducts);
  };

  const handleDragStart = (index: number) => {
    setDraggedItem(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (index: number) => {
    if (draggedItem === null || draggedItem === index) return;

    const newProducts = [...products];
    const draggedProduct = newProducts[draggedItem];
    newProducts.splice(draggedItem, 1);
    newProducts.splice(index, 0, draggedProduct);
    setProducts(newProducts);
    setDraggedItem(null);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const updates = products.map((product, index) => ({
        ref: product.ref,
        display_order: index,
      }));

      const response = await fetch("/api/admin/update-product-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates }),
      });

      if (!response.ok) {
        throw new Error("Erro ao salvar ordem");
      }

      setSuccess("✅ Ordem dos produtos atualizada com sucesso!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.message || "Erro ao salvar");
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
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/admin/palmira" className="text-sm text-gray-500 hover:text-gray-700 mb-6 block">
          ← Voltar
        </Link>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">🔄 Reordenar Produtos na Loja</h1>
        <p className="text-gray-600 mb-8">Arraste os produtos para mudar a ordem que aparecem na loja</p>

        {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm mb-6">{error}</div>}
        {success && <div className="p-3 bg-green-100 text-green-700 rounded-lg text-sm mb-6">{success}</div>}

        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
          <div className="p-4 bg-gradient-to-r from-[#7BC9C2] to-[#5fb3ac] text-white">
            <p className="text-sm font-semibold">📦 {products.length} produto(s)</p>
          </div>

          <div className="space-y-2 p-4">
            {products.map((product, index) => (
              <div
                key={index}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(index)}
                className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-move transition-all ${
                  draggedItem === index
                    ? "border-[#7BC9C2] bg-[#7BC9C2]/10 opacity-50"
                    : "border-gray-200 hover:border-[#7BC9C2] bg-white"
                }`}
              >
                {/* Número de Posição */}
                <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center font-bold text-gray-700">
                  {index + 1}
                </div>

                {/* Imagem */}
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="flex-shrink-0 w-16 h-16 object-cover rounded-lg border border-gray-200"
                  />
                )}

                {/* Informações */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-400 font-mono mb-1">REF {product.ref}</p>
                  <p className="font-semibold text-gray-800 truncate">{product.name}</p>
                </div>

                {/* Botões de Navegação */}
                <div className="flex-shrink-0 flex gap-2">
                  <button
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                    className="px-3 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-lg text-sm font-bold transition-colors"
                    title="Mover para cima"
                  >
                    ⬆️
                  </button>
                  <button
                    onClick={() => moveDown(index)}
                    disabled={index === products.length - 1}
                    className="px-3 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-lg text-sm font-bold transition-colors"
                    title="Mover para baixo"
                  >
                    ⬇️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-4 bg-gradient-to-r from-[#7BC9C2] to-[#5fb3ac] hover:shadow-lg disabled:opacity-50 text-white font-bold rounded-lg transition-all"
          >
            {saving ? "⏳ Salvando..." : "✅ SALVAR NOVA ORDEM"}
          </button>
          <Link
            href="/admin/palmira"
            className="px-6 py-4 border-2 border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </Link>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-xs text-blue-700">
            <strong>💡 Dica:</strong> Arraste os produtos ou use os botões ⬆️ ⬇️ para mudar a ordem. A primeira posição aparecerá primeiro na loja!
          </p>
        </div>
      </div>
    </div>
  );
}
