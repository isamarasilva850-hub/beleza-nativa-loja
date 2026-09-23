"use client";

import { useState, useEffect } from "react";
import { products } from "@/data/products";

export default function Relatorios() {
  const [orders, setOrders] = useState<any[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [period, setPeriod] = useState("mes");

  useEffect(() => {
    const o = localStorage.getItem("belezanativa_orders");
    const p = localStorage.getItem("belezanativa_partners");
    const l = localStorage.getItem("belezanativa_leads");
    if (o) setOrders(JSON.parse(o));
    if (p) setPartners(JSON.parse(p));
    if (l) setLeads(JSON.parse(l));
  }, []);

  const totalRevenue = orders.reduce((s: number, o: any) => s + (o.total || 0), 0);
  const totalOrders = orders.length;
  const ticketMedio = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const activePartners = partners.filter((p: any) => p.status === "ativo").length;
  const convertedLeads = leads.filter((l: any) => l.status === "convertido").length;
  const conversionRate = leads.length > 0 ? ((convertedLeads / leads.length) * 100).toFixed(1) : "0";

  const categorySales: Record<string, number> = {};
  products.forEach((p) => {
    if (!categorySales[p.category]) categorySales[p.category] = 0;
  });

  const kpis = [
    { label: "Receita Total", value: `R$ ${totalRevenue.toFixed(2).replace(".", ",")}`, color: "text-green-600", bg: "bg-green-50" },
    { label: "Total de Pedidos", value: totalOrders.toString(), color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Ticket Médio", value: `R$ ${ticketMedio.toFixed(2).replace(".", ",")}`, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Clientes Ativos", value: activePartners.toString(), color: "text-[#7BC9C2]", bg: "bg-[#7BC9C2]/10" },
    { label: "Leads Gerados", value: leads.length.toString(), color: "text-orange-600", bg: "bg-orange-50" },
    { label: "Taxa Conversão", value: `${conversionRate}%`, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Produtos Ativos", value: products.length.toString(), color: "text-pink-600", bg: "bg-pink-50" },
    { label: "Leads Convertidos", value: convertedLeads.toString(), color: "text-emerald-600", bg: "bg-emerald-50" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-gray-800">KPIs de Vendas 360°</h1>
        <div className="flex gap-2">
          {[
            { key: "semana", label: "7 dias" },
            { key: "mes", label: "30 dias" },
            { key: "trimestre", label: "90 dias" },
            { key: "todos", label: "Todos" },
          ].map((p) => (
            <button key={p.key} onClick={() => setPeriod(p.key)} className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${period === p.key ? "bg-[#7BC9C2] text-white" : "bg-white text-gray-600 border border-gray-200"}`}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className={`${kpi.bg} rounded-xl p-4`}>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{kpi.label}</p>
            <p className={`text-xl font-bold mt-1 ${kpi.color}`}>{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-bold text-gray-700 mb-4">Funil de Vendas</h2>
          <div className="space-y-3">
            {[
              { label: "Leads Gerados", value: leads.length, color: "bg-blue-500", width: "100%" },
              { label: "Em Contato", value: leads.filter((l: any) => l.status === "contato").length, color: "bg-yellow-500", width: leads.length > 0 ? `${(leads.filter((l: any) => l.status === "contato").length / leads.length) * 100}%` : "0%" },
              { label: "Em Negociação", value: leads.filter((l: any) => l.status === "negociacao").length, color: "bg-orange-500", width: leads.length > 0 ? `${(leads.filter((l: any) => l.status === "negociacao").length / leads.length) * 100}%` : "0%" },
              { label: "Convertidos", value: convertedLeads, color: "bg-green-500", width: leads.length > 0 ? `${(convertedLeads / leads.length) * 100}%` : "0%" },
            ].map((stage) => (
              <div key={stage.label}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600">{stage.label}</span>
                  <span className="font-bold text-gray-800">{stage.value}</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full ${stage.color} rounded-full transition-all`} style={{ width: stage.width || "0%" }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-bold text-gray-700 mb-4">Produtos por Categoria</h2>
          <div className="space-y-2">
            {Object.entries(
              products.reduce<Record<string, number>>((acc, p) => {
                acc[p.category] = (acc[p.category] || 0) + 1;
                return acc;
              }, {})
            )
              .sort((a, b) => b[1] - a[1])
              .map(([cat, count]) => (
                <div key={cat} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-gray-600">{cat}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#7BC9C2] rounded-full" style={{ width: `${(count / products.length) * 100}%` }} />
                    </div>
                    <span className="text-sm font-bold text-gray-700 w-8 text-right">{count}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="font-bold text-gray-700 mb-4">Resumo de Performance</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg text-center">
            <p className="text-3xl font-bold text-[#7BC9C2]">{products.length}</p>
            <p className="text-xs text-gray-500 mt-1">Produtos no Catálogo</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg text-center">
            <p className="text-3xl font-bold text-[#7BC9C2]">{products.reduce((s, p) => s + p.variants.length, 0)}</p>
            <p className="text-xs text-gray-500 mt-1">Variações de Cor</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg text-center">
            <p className="text-3xl font-bold text-[#7BC9C2]">
              {products.reduce((s, p) => s + p.variants.reduce((vs, v) => vs + v.sizes.length, 0), 0)}
            </p>
            <p className="text-xs text-gray-500 mt-1">SKUs Totais</p>
          </div>
        </div>
      </div>
    </div>
  );
}
