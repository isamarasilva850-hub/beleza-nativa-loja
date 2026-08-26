"use client";

import { useState, useRef } from "react";
import { products, categories, genders } from "@/data/products";

export default function TabelaPrecos() {
  const [filterGender, setFilterGender] = useState("todos");
  const [filterCategory, setFilterCategory] = useState("todos");
  const [showWholesale, setShowWholesale] = useState(true);
  const printRef = useRef<HTMLDivElement>(null);

  const filtered = products.filter((p) => {
    if (filterGender !== "todos" && p.gender !== filterGender) return false;
    if (filterCategory !== "todos" && p.category !== filterCategory) return false;
    return true;
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3 print:hidden">
        <h1 className="text-2xl font-bold text-gray-800">Tabela de Preços</h1>
        <button onClick={handlePrint} className="px-4 py-2 bg-[#7BC9C2] text-white rounded-lg text-sm font-bold hover:bg-[#6ab8b1] flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Imprimir
        </button>
      </div>

      <div className="flex flex-wrap gap-3 print:hidden">
        <select value={filterGender} onChange={(e) => setFilterGender(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]">
          <option value="todos">Todos os Gêneros</option>
          {genders.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]">
          <option value="todos">Todas as Categorias</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <label className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm cursor-pointer">
          <input type="checkbox" checked={showWholesale} onChange={(e) => setShowWholesale(e.target.checked)} className="rounded" />
          Mostrar Atacado
        </label>
      </div>

      <div ref={printRef} className="bg-white rounded-xl border border-gray-200 print:border-0 print:shadow-none">
        <div className="p-4 border-b border-gray-100 print:text-center">
          <h2 className="font-bold text-gray-800 text-lg">Beleza Nativa - Lingerie e Moda Praia</h2>
          <p className="text-xs text-gray-500">Tabela de Preços · {filtered.length} produtos · Atualizado em {new Date().toLocaleDateString("pt-BR")}</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500">REF</th>
                <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500">PRODUTO</th>
                <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500">GÊNERO</th>
                <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500">CATEGORIA</th>
                {showWholesale && <th className="text-right px-3 py-2 text-xs font-semibold text-gray-500">ATACADO</th>}
                <th className="text-right px-3 py-2 text-xs font-semibold text-gray-500">VAREJO</th>
                <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500">CORES</th>
                <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500">TAMANHOS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 print:hover:bg-white">
                  <td className="px-3 py-2 font-mono text-xs text-gray-500">{p.ref}</td>
                  <td className="px-3 py-2 font-medium text-gray-700 text-xs">{p.name}</td>
                  <td className="px-3 py-2 text-xs text-gray-500">{p.gender}</td>
                  <td className="px-3 py-2 text-xs text-gray-500">{p.category}</td>
                  {showWholesale && <td className="px-3 py-2 text-right font-bold text-xs text-gray-700">R$ {p.price.toFixed(2).replace(".", ",")}</td>}
                  <td className="px-3 py-2 text-right font-bold text-xs text-[#7BC9C2]">R$ {(p.price * 2).toFixed(2).replace(".", ",")}</td>
                  <td className="px-3 py-2 text-xs text-gray-500">{p.variants.map((v) => v.color).join(", ")}</td>
                  <td className="px-3 py-2 text-xs text-gray-500">{[...new Set(p.variants.flatMap((v) => v.sizes))].join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
