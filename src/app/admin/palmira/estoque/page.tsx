"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { notifyStorageChange } from "@/lib/storageEvents";

interface UploadedProduct {
  ref: string;
  name: string;
  quantity: number;
  color: string;
  sizes: string[];
  price: number;
  timestamp: string;
}

export default function PalmitraEstoquePage() {
  const [products, setProducts] = useState<UploadedProduct[]>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"name" | "quantity" | "ref">("name");

  useEffect(() => {
    const uploads = JSON.parse(localStorage.getItem("belezanativa_product_uploads") || "[]");
    setProducts(uploads);
  }, []);

  const filteredProducts = products.filter(
    (p) =>
      p.ref.toLowerCase().includes(search.toLowerCase()) ||
      p.name.toLowerCase().includes(search.toLowerCase())
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sort === "name") return a.name.localeCompare(b.name);
    if (sort === "quantity") return b.quantity - a.quantity;
    if (sort === "ref") return a.ref.localeCompare(b.ref);
    return 0;
  });

  const totalItems = products.reduce((sum, p) => sum + p.quantity, 0);
  const lowStock = products.filter((p) => p.quantity < 10).length;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href="/admin/palmira" className="text-sm text-gray-500 hover:text-gray-700 mb-4 block">
            ← Voltar
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">📊 Controle de Estoque</h1>
          <p className="text-gray-600 mt-1">Acompanhe a quantidade de peças</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <p className="text-gray-600 text-sm mb-1">Total em Estoque</p>
            <p className="text-3xl font-bold text-[#7BC9C2]">{totalItems.toLocaleString()}</p>
            <p className="text-xs text-gray-400 mt-2">peças</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <p className="text-gray-600 text-sm mb-1">Produtos Cadastrados</p>
            <p className="text-3xl font-bold text-purple-600">{products.length}</p>
            <p className="text-xs text-gray-400 mt-2">referências</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <p className="text-gray-600 text-sm mb-1">Estoque Baixo</p>
            <p className="text-3xl font-bold text-orange-600">{lowStock}</p>
            <p className="text-xs text-gray-400 mt-2">produtos com &lt; 10</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 mb-6 space-y-4 shadow-sm">
          <input
            type="text"
            placeholder="🔍 Buscar por referência ou nome..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#7BC9C2]"
          />
          <div>
            <label className="text-sm text-gray-700 font-semibold mb-2 block">Ordenar por:</label>
            <div className="flex gap-2">
              {[
                { value: "name" as const, label: "Nome" },
                { value: "quantity" as const, label: "Quantidade" },
                { value: "ref" as const, label: "Referência" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSort(option.value)}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    sort === option.value
                      ? "bg-[#7BC9C2] text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        {sortedProducts.length > 0 ? (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700">REF</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700">Produto</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700">Tamanhos</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700">Quantidade</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {sortedProducts.map((product) => (
                  <tr key={product.ref} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm font-bold text-gray-800">{product.ref}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{product.name}</p>
                        {product.color && (
                          <p className="text-xs text-gray-500 mt-1">Cor: {product.color}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">{product.sizes.join(", ")}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-lg font-bold text-[#7BC9C2]">
                        {product.quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                          product.quantity < 5
                            ? "bg-red-100 text-red-700"
                            : product.quantity < 10
                            ? "bg-orange-100 text-orange-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {product.quantity < 5
                          ? "⚠️ Crítico"
                          : product.quantity < 10
                          ? "⚠️ Baixo"
                          : "✅ OK"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl">
            <p className="text-gray-500">Nenhum produto encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
}
