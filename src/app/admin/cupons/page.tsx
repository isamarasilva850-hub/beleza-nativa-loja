"use client";

import { useState, useEffect } from "react";

interface Coupon {
  id: string;
  code: string;
  type: "percentual" | "fixo" | "frete";
  value: number;
  minOrder: number;
  maxUses: number;
  usedCount: number;
  validFrom: string;
  validUntil: string;
  active: boolean;
}

export default function Cupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ code: "", type: "percentual" as Coupon["type"], value: 10, minOrder: 0, maxUses: 100, validFrom: new Date().toISOString().split("T")[0], validUntil: "" });

  useEffect(() => {
    const stored = localStorage.getItem("belezanativa_coupons");
    if (stored) setCoupons(JSON.parse(stored));
  }, []);

  const save = (updated: Coupon[]) => {
    setCoupons(updated);
    localStorage.setItem("belezanativa_coupons", JSON.stringify(updated));
  };

  const addCoupon = () => {
    if (!form.code) return;
    const newCoupon: Coupon = {
      id: Date.now().toString(),
      ...form,
      code: form.code.toUpperCase(),
      usedCount: 0,
      active: true,
    };
    save([newCoupon, ...coupons]);
    setForm({ code: "", type: "percentual", value: 10, minOrder: 0, maxUses: 100, validFrom: new Date().toISOString().split("T")[0], validUntil: "" });
    setShowForm(false);
  };

  const toggleActive = (id: string) => save(coupons.map((c) => (c.id === id ? { ...c, active: !c.active } : c)));
  const removeCoupon = (id: string) => { if (confirm("Remover cupom?")) save(coupons.filter((c) => c.id !== id)); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-gray-800">Cupons de Desconto</h1>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-[#7BC9C2] text-white rounded-lg text-sm font-bold hover:bg-[#6ab8b1]">
          + Novo Cupom
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <h2 className="font-bold text-gray-700">Criar Cupom</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Código *</label>
              <input placeholder="Ex: BELEZA10" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm uppercase focus:outline-none focus:border-[#7BC9C2]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Tipo</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as Coupon["type"] })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]">
                <option value="percentual">Percentual (%)</option>
                <option value="fixo">Valor Fixo (R$)</option>
                <option value="frete">Frete Grátis</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">{form.type === "percentual" ? "Desconto (%)" : form.type === "fixo" ? "Valor (R$)" : "—"}</label>
              <input type="number" disabled={form.type === "frete"} value={form.value} onChange={(e) => setForm({ ...form, value: Number(e.target.value) })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2] disabled:bg-gray-50" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Pedido Mínimo (R$)</label>
              <input type="number" value={form.minOrder} onChange={(e) => setForm({ ...form, minOrder: Number(e.target.value) })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Máx. de Usos</label>
              <input type="number" value={form.maxUses} onChange={(e) => setForm({ ...form, maxUses: Number(e.target.value) })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Válido até</label>
              <input type="date" value={form.validUntil} onChange={(e) => setForm({ ...form, validUntil: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]" />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={addCoupon} className="px-4 py-2 bg-[#7BC9C2] text-white rounded-lg text-sm font-bold">Criar Cupom</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium">Cancelar</button>
          </div>
        </div>
      )}

      <div className="grid gap-3">
        {coupons.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400">
            <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
            <p className="font-medium">Nenhum cupom criado</p>
            <p className="text-sm mt-1">Crie cupons para oferecer descontos às suas clientes</p>
          </div>
        ) : (
          coupons.map((c) => (
            <div key={c.id} className={`bg-white rounded-xl border p-4 flex flex-col sm:flex-row sm:items-center gap-3 ${c.active ? "border-gray-200" : "border-gray-100 opacity-60"}`}>
              <div className="flex items-center gap-3 flex-1">
                <div className="w-14 h-14 bg-[#7BC9C2]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-lg font-bold text-[#7BC9C2]">
                    {c.type === "percentual" ? `${c.value}%` : c.type === "fixo" ? `R$${c.value}` : "FRETE"}
                  </span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-gray-800 bg-gray-100 px-2 py-0.5 rounded text-sm">{c.code}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${c.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {c.active ? "ATIVO" : "INATIVO"}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {c.usedCount}/{c.maxUses} usos
                    {c.minOrder > 0 && ` · Min: R$ ${c.minOrder.toFixed(2).replace(".", ",")}`}
                    {c.validUntil && ` · Até: ${new Date(c.validUntil + "T00:00:00").toLocaleDateString("pt-BR")}`}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => toggleActive(c.id)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${c.active ? "bg-gray-100 text-gray-600 hover:bg-gray-200" : "bg-green-50 text-green-600 hover:bg-green-100"}`}>
                  {c.active ? "Desativar" : "Ativar"}
                </button>
                <button onClick={() => removeCoupon(c.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
