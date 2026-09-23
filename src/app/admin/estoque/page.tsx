"use client";

import { useState, useEffect, useCallback } from "react";
import { products, categories } from "@/data/products";
import { hunterStockData } from "@/data/hunter-stock";

interface StockEntry {
  ref: string;
  color: string;
  size: string;
  quantity: number;
}

export default function AdminEstoque() {
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("todos");
  const [filterStock, setFilterStock] = useState<"todos" | "com" | "sem" | "baixo">("todos");
  const [expandedProducts, setExpandedProducts] = useState<Set<number>>(new Set());
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [stock, setStock] = useState<StockEntry[]>([]);
  const [quickFillValue, setQuickFillValue] = useState<Record<string, string>>({});
  const [showImportModal, setShowImportModal] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("belezanativa_stock");
    if (saved) setStock(JSON.parse(saved));
    const ts = localStorage.getItem("belezanativa_stock_updated");
    if (ts) setLastUpdated(ts);
  }, []);

  const saveStock = useCallback((newStock: StockEntry[]) => {
    setStock(newStock);
    localStorage.setItem("belezanativa_stock", JSON.stringify(newStock));
    const now = new Date().toLocaleString("pt-BR");
    setLastUpdated(now);
    localStorage.setItem("belezanativa_stock_updated", now);
  }, []);

  const getQuantity = (ref: string, color: string, size: string) => {
    return stock.find((s) => s.ref === ref && s.color === color && s.size === size)?.quantity ?? 0;
  };

  const getProductTotal = (ref: string) => {
    return stock.filter((s) => s.ref === ref).reduce((sum, s) => sum + s.quantity, 0);
  };

  const updateQuantity = (ref: string, color: string, size: string, qty: number) => {
    const newStock = [...stock];
    const idx = newStock.findIndex((s) => s.ref === ref && s.color === color && s.size === size);
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

  const fillAllSizes = (ref: string, color: string, sizes: string[], qty: number) => {
    const newStock = [...stock];
    sizes.forEach((size) => {
      const idx = newStock.findIndex((s) => s.ref === ref && s.color === color && s.size === size);
      if (idx >= 0) {
        if (qty <= 0) {
          newStock.splice(idx, 1);
        } else {
          newStock[idx] = { ...newStock[idx], quantity: qty };
        }
      } else if (qty > 0) {
        newStock.push({ ref, color, size, quantity: qty });
      }
    });
    saveStock(newStock);
  };

  const fillAllProduct = (product: typeof products[0], qty: number) => {
    const newStock = [...stock];
    product.variants.forEach((v) => {
      v.sizes.forEach((size) => {
        const idx = newStock.findIndex((s) => s.ref === product.ref && s.color === v.color && s.size === size);
        if (idx >= 0) {
          if (qty <= 0) {
            newStock.splice(idx, 1);
          } else {
            newStock[idx] = { ...newStock[idx], quantity: qty };
          }
        } else if (qty > 0) {
          newStock.push({ ref: product.ref, color: v.color, size, quantity: qty });
        }
      });
    });
    saveStock(newStock);
  };

  const importHunterStock = () => {
    const newStock = [...stock];
    for (const entry of hunterStockData) {
      const idx = newStock.findIndex(
        (s) => s.ref === entry.ref && s.color === entry.color && s.size === entry.size
      );
      if (idx >= 0) {
        newStock[idx] = { ...newStock[idx], quantity: entry.quantity };
      } else {
        newStock.push({ ...entry });
      }
    }
    saveStock(newStock);
    setShowImportModal(false);
  };

  const toggleExpand = (id: number) => {
    setExpandedProducts((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandAll = () => {
    if (expandedProducts.size === filtered.length) {
      setExpandedProducts(new Set());
    } else {
      setExpandedProducts(new Set(filtered.map((p) => p.id)));
    }
  };

  const filtered = products.filter((p) => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.ref.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterCategory !== "todos" && p.category !== filterCategory) return false;
    const total = getProductTotal(p.ref);
    if (filterStock === "com" && total <= 0) return false;
    if (filterStock === "sem" && total > 0) return false;
    if (filterStock === "baixo" && total > 5) return false;
    return true;
  });

  const totalItems = stock.reduce((sum, s) => sum + s.quantity, 0);
  const productsWithStock = new Set(stock.filter((s) => s.quantity > 0).map((s) => s.ref)).size;
  const lowStockProducts = products.filter((p) => {
    const total = getProductTotal(p.ref);
    return total > 0 && total <= 5;
  }).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Controle de Estoque</h1>
          {lastUpdated && (
            <p className="text-xs text-gray-400 mt-1">Última atualização: {lastUpdated}</p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowImportModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Importar do Hunter
          </button>
          <button
            onClick={expandAll}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50"
          >
            {expandedProducts.size === filtered.length ? "Recolher Todos" : "Expandir Todos"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Total de Peças</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{totalItems}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Com Estoque</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{productsWithStock}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Sem Estoque</p>
          <p className="text-2xl font-bold text-red-500 mt-1">{products.length - productsWithStock}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Estoque Baixo</p>
          <p className="text-2xl font-bold text-amber-500 mt-1">{lowStockProducts}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Buscar por nome ou ref..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]"
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]"
        >
          <option value="todos">Todas Categorias</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <div className="flex gap-1 bg-white border border-gray-200 rounded-lg p-1">
          {([
            { key: "todos" as const, label: "Todos" },
            { key: "com" as const, label: "Com Estoque" },
            { key: "sem" as const, label: "Sem Estoque" },
            { key: "baixo" as const, label: "Baixo" },
          ]).map((f) => (
            <button
              key={f.key}
              onClick={() => setFilterStock(f.key)}
              className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${
                filterStock === f.key ? "bg-[#7BC9C2] text-white" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-400">{filtered.length} produto(s) encontrado(s)</p>

      <div className="space-y-3">
        {filtered.map((p) => {
          const allSizes = [...new Set(p.variants.flatMap((v) => v.sizes))];
          const productTotal = getProductTotal(p.ref);
          const isExpanded = expandedProducts.has(p.id);
          const qfKey = `${p.ref}`;

          return (
            <div key={p.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <button
                onClick={() => toggleExpand(p.id)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <svg
                    className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span className="font-mono text-xs font-bold text-[#7BC9C2]">{p.ref}</span>
                  <span className="text-sm font-semibold text-gray-800">{p.name}</span>
                  <span className="text-xs text-gray-400 hidden sm:inline">{p.category}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">{p.variants.length} cores</span>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      productTotal === 0
                        ? "bg-red-100 text-red-600"
                        : productTotal <= 5
                        ? "bg-amber-100 text-amber-600"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {productTotal} pç
                  </span>
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-gray-100">
                  <div className="px-4 py-2 bg-gray-50 flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-gray-500">Preencher tudo com:</span>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={quickFillValue[qfKey] ?? ""}
                      onChange={(e) => setQuickFillValue((prev) => ({ ...prev, [qfKey]: e.target.value }))}
                      className="w-16 px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:border-[#7BC9C2] text-center"
                    />
                    <button
                      onClick={() => {
                        const qty = parseInt(quickFillValue[qfKey] || "0") || 0;
                        fillAllProduct(p, qty);
                        setQuickFillValue((prev) => ({ ...prev, [qfKey]: "" }));
                      }}
                      className="px-3 py-1 bg-[#7BC9C2] text-white text-xs rounded font-bold hover:bg-[#6ab8b1]"
                    >
                      Aplicar
                    </button>
                    <button
                      onClick={() => fillAllProduct(p, 0)}
                      className="px-3 py-1 bg-white border border-red-200 text-red-500 text-xs rounded font-medium hover:bg-red-50"
                    >
                      Zerar
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="px-4 py-2 text-left text-gray-500 font-medium w-36">Cor</th>
                          {allSizes.map((size) => (
                            <th key={size} className="px-2 py-2 text-center text-gray-500 font-medium min-w-[56px]">{size}</th>
                          ))}
                          <th className="px-2 py-2 text-center text-gray-500 font-medium min-w-[50px]">Total</th>
                          <th className="px-2 py-2 text-center text-gray-500 font-medium min-w-[80px]">Rápido</th>
                        </tr>
                      </thead>
                      <tbody>
                        {p.variants.map((v, vi) => {
                          const variantTotal = v.sizes.reduce((sum, size) => sum + getQuantity(p.ref, v.color, size), 0);
                          const vfKey = `${p.ref}-${v.color}`;
                          return (
                            <tr key={vi} className="border-b border-gray-50 hover:bg-gray-50/50">
                              <td className="px-4 py-2">
                                <div className="flex items-center gap-2">
                                  <span
                                    className="w-4 h-4 rounded-full border border-gray-200 flex-shrink-0"
                                    style={{ backgroundColor: v.colorHex }}
                                  />
                                  <span className="text-gray-700">{v.color}</span>
                                </div>
                              </td>
                              {allSizes.map((size) => {
                                const available = v.sizes.includes(size);
                                const qty = available ? getQuantity(p.ref, v.color, size) : -1;
                                return (
                                  <td key={size} className="px-2 py-1.5 text-center">
                                    {available ? (
                                      <input
                                        type="number"
                                        min="0"
                                        value={qty}
                                        onChange={(e) =>
                                          updateQuantity(p.ref, v.color, size, parseInt(e.target.value) || 0)
                                        }
                                        className={`w-14 px-1 py-1 text-center border rounded text-xs focus:outline-none focus:border-[#7BC9C2] ${
                                          qty > 0
                                            ? "border-green-300 bg-green-50 font-bold"
                                            : "border-gray-200"
                                        }`}
                                      />
                                    ) : (
                                      <span className="text-gray-300">—</span>
                                    )}
                                  </td>
                                );
                              })}
                              <td className="px-2 py-1.5 text-center">
                                <span className={`text-xs font-bold ${variantTotal > 0 ? "text-green-600" : "text-gray-300"}`}>
                                  {variantTotal}
                                </span>
                              </td>
                              <td className="px-2 py-1.5 text-center">
                                <div className="flex items-center gap-1 justify-center">
                                  <input
                                    type="number"
                                    min="0"
                                    placeholder="qtd"
                                    value={quickFillValue[vfKey] ?? ""}
                                    onChange={(e) => setQuickFillValue((prev) => ({ ...prev, [vfKey]: e.target.value }))}
                                    className="w-10 px-1 py-0.5 text-[10px] border border-gray-200 rounded focus:outline-none focus:border-[#7BC9C2] text-center"
                                  />
                                  <button
                                    onClick={() => {
                                      const qty = parseInt(quickFillValue[vfKey] || "0") || 0;
                                      fillAllSizes(p.ref, v.color, v.sizes, qty);
                                      setQuickFillValue((prev) => ({ ...prev, [vfKey]: "" }));
                                    }}
                                    className="px-1.5 py-0.5 bg-[#7BC9C2] text-white text-[10px] rounded font-bold hover:bg-[#6ab8b1]"
                                    title="Preencher todos os tamanhos desta cor"
                                  >
                                    OK
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showImportModal && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowImportModal(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl z-50 w-[90%] max-w-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Importar Estoque do Hunter</h3>
            <p className="text-sm text-gray-600 mb-1">
              Dados extraídos do relatório 346 do Hunter ERP.
            </p>
            <div className="bg-blue-50 rounded-lg p-3 mb-4 text-xs text-blue-800 space-y-1">
              <p><strong>{hunterStockData.length}</strong> entradas de estoque</p>
              <p><strong>{hunterStockData.reduce((s, e) => s + e.quantity, 0)}</strong> peças no total</p>
              <p><strong>{new Set(hunterStockData.map((e) => e.ref)).size}</strong> produtos diferentes</p>
              <p className="text-blue-600 mt-2">
                O Hunter não separa por cor. O estoque foi dividido igualmente entre as cores de cada produto.
              </p>
            </div>
            <p className="text-xs text-amber-600 font-medium mb-4">
              Os valores importados vão substituir o estoque atual dos produtos que constam no relatório.
              Produtos que não estão no relatório não serão alterados.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowImportModal(false)}
                className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={importHunterStock}
                className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700"
              >
                Importar Agora
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
