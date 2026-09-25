"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { notifyStorageChange } from "@/lib/storageEvents";

interface UploadedProduct {
  ref: string;
  name: string;
  price: number;
  color: string;
  colorHex: string;
  images: string[];
  sizes: string[];
  quantity: number;
  timestamp: string;
}

export default function AdicionarCorPage() {
  const [products, setProducts] = useState<UploadedProduct[]>([]);
  const [selectedRef, setSelectedRef] = useState("");
  const [newColor, setNewColor] = useState("");
  const [newColorHex, setNewColorHex] = useState("#000000");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const uploads = JSON.parse(localStorage.getItem("belezanativa_product_uploads") || "[]");
    setProducts(uploads);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedRef || !newColor) {
      setError("❌ Selecione um produto e uma cor!");
      return;
    }

    try {
      const uploads = JSON.parse(localStorage.getItem("belezanativa_product_uploads") || "[]");

      // Encontrar o produto e adicionar a cor
      const updated = uploads.map((p: UploadedProduct) => {
        if (p.ref === selectedRef) {
          // Verificar se cor já existe
          if (p.color === newColor) {
            setError("⚠️ Este produto já tem essa cor!");
            return p;
          }

          // Criar um novo produto com a mesma referência mas cor diferente
          return {
            ...p,
            color: newColor,
            colorHex: newColorHex,
            timestamp: new Date().toISOString(),
          };
        }
        return p;
      });

      // Se não encontrou, significa que é uma cor nova do mesmo produto
      const productExists = uploads.some((p: UploadedProduct) => p.ref === selectedRef);

      if (productExists) {
        // Verifica se essa combinação já existe
        const colorExists = uploads.some((p: UploadedProduct) => p.ref === selectedRef && p.color === newColor);

        if (colorExists) {
          setError("⚠️ Este produto já tem essa cor!");
          return;
        }

        // Pega o primeiro produto com essa referência como base
        const baseProduct = uploads.find((p: UploadedProduct) => p.ref === selectedRef);

        // Adiciona um novo com a mesma ref mas cor diferente
        const newProduct = {
          ...baseProduct,
          color: newColor,
          colorHex: newColorHex,
          timestamp: new Date().toISOString(),
        };

        updated.push(newProduct);
      }

      localStorage.setItem("belezanativa_product_uploads", JSON.stringify(updated));
      notifyStorageChange("belezanativa_product_uploads", updated);

      setSuccess(`✅ Cor "${newColor}" adicionada ao REF ${selectedRef}!`);
      setNewColor("");
      setNewColorHex("#000000");
      setSelectedRef("");

      // Recarregar produtos
      setProducts(updated);
    } catch (err: any) {
      setError(`❌ ${err.message}`);
    }
  };

  // Agrupar produtos por referência
  const uniqueRefs = [...new Set(products.map((p) => p.ref))];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href="/admin/palmira" className="text-sm text-gray-500 hover:text-gray-700 mb-4 block">
            ← Voltar
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">🎨 Adicionar Cor</h1>
          <p className="text-gray-600 mt-1">Adicione uma cor nova a um produto existente</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-6">
          {/* Seleção de Produto */}
          <div className="space-y-4">
            <h3 className="font-bold text-gray-800">📦 Selecione o Produto</h3>
            <select
              value={selectedRef}
              onChange={(e) => setSelectedRef(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#7BC9C2]"
              required
            >
              <option value="">Escolha uma referência...</option>
              {uniqueRefs.map((ref) => {
                const product = products.find((p) => p.ref === ref);
                const colorsCount = products.filter((p) => p.ref === ref).length;
                return (
                  <option key={ref} value={ref}>
                    REF {ref} - {product?.name} ({colorsCount} cor{colorsCount !== 1 ? "es" : ""})
                  </option>
                );
              })}
            </select>
          </div>

          {/* Cores Existentes */}
          {selectedRef && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-xs font-semibold text-blue-900 mb-2">Cores existentes deste REF:</p>
              <div className="flex flex-wrap gap-2">
                {products
                  .filter((p) => p.ref === selectedRef)
                  .map((p, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-blue-200">
                      <div
                        className="w-4 h-4 rounded-full border border-gray-300"
                        style={{ backgroundColor: p.colorHex }}
                      />
                      <span className="text-xs text-gray-700">{p.color}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Nova Cor */}
          <div className="space-y-4">
            <h3 className="font-bold text-gray-800">🎨 Nova Cor</h3>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Nome da cor"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#7BC9C2]"
                required
              />
              <input
                type="color"
                value={newColorHex}
                onChange={(e) => setNewColorHex(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Mensagens */}
          {success && <div className="p-3 bg-green-100 text-green-700 rounded-lg text-sm">{success}</div>}
          {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-[#7BC9C2] hover:bg-[#5fb3ac] text-white font-bold py-3 rounded-lg transition-colors"
          >
            ✅ ADICIONAR COR
          </button>
        </form>

        {/* Info */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-900">
            <strong>ℹ️ Como funciona:</strong> Ao adicionar uma cor, o produto fica com as mesmas fotos e tamanhos,
            mas com uma cor nova. Aparecerá como um produto separado no catálogo com a mesma REF.
          </p>
        </div>
      </div>
    </div>
  );
}
