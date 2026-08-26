"use client";

import { useState } from "react";
import { products } from "@/data/products";

export default function AdminProdutos() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const allCategories = [...new Set(products.map((p) => p.category))].sort();

  const filtered = products.filter((p) => {
    const matchesSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.ref.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !categoryFilter || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Produtos</h1>
        <span className="text-sm text-gray-500">{products.length} produtos cadastrados</span>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Buscar por nome ou referência..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2] bg-white"
          >
            <option value="">Todas as categorias</option>
            {allCategories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-left text-gray-600">
                <th className="px-4 py-3 font-semibold">Ref</th>
                <th className="px-4 py-3 font-semibold">Produto</th>
                <th className="px-4 py-3 font-semibold">Gênero</th>
                <th className="px-4 py-3 font-semibold">Categoria</th>
                <th className="px-4 py-3 font-semibold">Atacado</th>
                <th className="px-4 py-3 font-semibold">Varejo</th>
                <th className="px-4 py-3 font-semibold">Cores</th>
                <th className="px-4 py-3 font-semibold">Tamanhos</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const allSizes = [...new Set(p.variants.flatMap((v) => v.sizes))];
                return (
                  <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs font-semibold text-[#7BC9C2]">{p.ref}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-800 text-xs">{p.name}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">{p.gender}</td>
                    <td className="px-4 py-3">
                      <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">{p.category}</span>
                    </td>
                    <td className="px-4 py-3 text-xs font-medium text-gray-700">R$ {p.price.toFixed(2).replace(".", ",")}</td>
                    <td className="px-4 py-3 text-xs font-medium text-gray-700">R$ {(p.price * 2).toFixed(2).replace(".", ",")}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {p.variants.map((v, i) => (
                          <span key={i} className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: v.colorHex }} title={v.color} />
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">{allSizes.join(", ")}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p>Nenhum produto encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
}
