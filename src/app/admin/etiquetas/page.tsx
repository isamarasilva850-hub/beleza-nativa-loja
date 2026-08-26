"use client";

import { useState } from "react";
import { products } from "@/data/products";

export default function Etiquetas() {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [etiquetaType, setEtiquetaType] = useState<"preco" | "codigo" | "completa">("preco");

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.ref.toLowerCase().includes(search.toLowerCase())
  );

  const toggleProduct = (id: string) => {
    setSelectedProducts((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const selectAll = () => {
    if (selectedProducts.length === filtered.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filtered.map((p) => p.id));
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const selected = products.filter((p) => selectedProducts.includes(p.id));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3 print:hidden">
        <h1 className="text-2xl font-bold text-gray-800">Etiquetas</h1>
        <div className="flex gap-2">
          <select value={etiquetaType} onChange={(e) => setEtiquetaType(e.target.value as any)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]">
            <option value="preco">Etiqueta de Preço</option>
            <option value="codigo">Código + Ref</option>
            <option value="completa">Completa</option>
          </select>
          <button onClick={handlePrint} disabled={selected.length === 0} className="px-4 py-2 bg-[#7BC9C2] text-white rounded-lg text-sm font-bold hover:bg-[#6ab8b1] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Imprimir ({selected.length})
          </button>
        </div>
      </div>

      <div className="flex gap-3 print:hidden">
        <input placeholder="Buscar produto..." value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]" />
        <button onClick={selectAll} className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">
          {selectedProducts.length === filtered.length ? "Desmarcar Todos" : "Selecionar Todos"}
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 print:hidden">
        {filtered.map((p) => (
          <button
            key={p.id}
            onClick={() => toggleProduct(p.id)}
            className={`p-3 rounded-lg border text-left transition-colors ${
              selectedProducts.includes(p.id) ? "border-[#7BC9C2] bg-[#7BC9C2]/5" : "border-gray-200 bg-white hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center gap-2">
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                selectedProducts.includes(p.id) ? "bg-[#7BC9C2] border-[#7BC9C2] text-white" : "border-gray-300"
              }`}>
                {selectedProducts.includes(p.id) && (
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-gray-800 truncate">{p.name}</p>
                <p className="text-[10px] text-gray-500">{p.ref} · R$ {(p.price * 2).toFixed(2).replace(".", ",")}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {selected.length > 0 && (
        <div className="print:block">
          <h2 className="font-bold text-gray-700 mb-3 print:hidden">Pré-visualização</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 print:grid-cols-3 print:gap-1">
            {selected.map((p) => (
              <div key={p.id} className="border border-gray-300 rounded-lg p-3 text-center print:border-black print:rounded-none print:p-2">
                <p className="font-bold text-xs text-gray-800">BELEZA NATIVA</p>
                {etiquetaType !== "codigo" && (
                  <p className="text-[10px] text-gray-600 mt-0.5 truncate">{p.name}</p>
                )}
                <p className="text-[10px] text-gray-500 mt-0.5">{p.ref}</p>
                {etiquetaType !== "codigo" && (
                  <p className="text-lg font-bold text-gray-800 mt-1">
                    R$ {(p.price * 2).toFixed(2).replace(".", ",")}
                  </p>
                )}
                {etiquetaType === "completa" && (
                  <p className="text-[9px] text-gray-400 mt-0.5">
                    {[...new Set(p.variants.flatMap((v) => v.sizes))].join(" / ")}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
