"use client";

import { useState } from "react";
import { products } from "@/data/products";

interface StockEntry {
  ref: string;
  color: string;
  size: string;
  quantity: number;
}

export default function AdminEstoque() {
  const [search, setSearch] = useState("");
  const [stock, setStock] = useState<StockEntry[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("belezanativa_stock");
      if (saved) return JSON.parse(saved);
    }
    return [];
  });

  const saveStock = (newStock: StockEntry[]) => {
    setStock(newStock);
    localStorage.setItem("belezanativa_stock", JSON.stringify(newStock));
  };

  const getQuantity = (ref: string, color: string, size: string) => {
    return stock.find((s) => s.ref === ref && s.color === color && s.size === size)?.quantity ?? 0;
  };

  const updateQuantity = (ref: string, color: string, size: string, qty: number) => {
    const idx = stock.findIndex((s) => s.ref === ref && s.color === color && s.size === size);
    const newStock = [...stock];
    if (idx >= 0) {
      if (qty <= 0) {
        newStock.splice(idx, 1);
      } else {
        newStock[idx] = { ...newStock[idx], quantity: qty };
      }
    } else if (qty > 0) {
      newStock.push({ ref, color, size, quantity: qty });
    }
    saveStock(newStock);
  };

  const filtered = products.filter(
    (p) =>
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.ref.toLowerCase().includes(search.toLowerCase())
  );

  const totalItems = stock.reduce((sum, s) => sum + s.quantity, 0);
  const productsWithStock = new Set(stock.filter((s) => s.quantity > 0).map((s) => s.ref)).size;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Controle de Estoque</h1>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <p className="text-xs text-gray-500">Total de Peças</p>
          <p className="text-2xl font-bold text-gray-800">{totalItems}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <p className="text-xs text-gray-500">Produtos em Estoque</p>
          <p className="text-2xl font-bold text-gray-800">{productsWithStock}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <p className="text-xs text-gray-500">Produtos Sem Estoque</p>
          <p className="text-2xl font-bold text-red-500">{products.length - productsWithStock}</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <input
          type="text"
          placeholder="Buscar produto por nome ou referência..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]"
        />
      </div>

      {/* Stock Grid */}
      <div className="space-y-4">
        {filtered.map((p) => {
          const allSizes = [...new Set(p.variants.flatMap((v) => v.sizes))];
          const productTotal = stock
            .filter((s) => s.ref === p.ref)
            .reduce((sum, s) => sum + s.quantity, 0);

          return (
            <div key={p.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-[#7BC9C2]">{p.ref}</span>
                  <span className="text-sm font-semibold text-gray-800">{p.name}</span>
                  <span className="text-xs text-gray-400">{p.category}</span>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded ${productTotal > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                  {productTotal} peças
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="px-4 py-2 text-left text-gray-500 font-medium w-28">Cor</th>
                      {allSizes.map((size) => (
                        <th key={size} className="px-2 py-2 text-center text-gray-500 font-medium min-w-[60px]">{size}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {p.variants.map((v, vi) => (
                      <tr key={vi} className="border-b border-gray-50">
                        <td className="px-4 py-2 flex items-center gap-2">
                          <span className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: v.colorHex }} />
                          <span className="text-gray-700">{v.color}</span>
                        </td>
                        {allSizes.map((size) => {
                          const available = v.sizes.includes(size);
                          const qty = available ? getQuantity(p.ref, v.color, size) : -1;
                          return (
                            <td key={size} className="px-2 py-2 text-center">
                              {available ? (
                                <input
                                  type="number"
                                  min="0"
                                  value={qty}
                                  onChange={(e) => updateQuantity(p.ref, v.color, size, parseInt(e.target.value) || 0)}
                                  className={`w-14 px-1 py-1 text-center border rounded text-xs focus:outline-none focus:border-[#7BC9C2] ${
                                    qty > 0 ? "border-green-300 bg-green-50" : "border-gray-200"
                                  }`}
                                />
                              ) : (
                                <span className="text-gray-300">—</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
