"use client";

import { useState, useEffect } from "react";

interface Order {
  id: string;
  date: string;
  customer: string;
  items: { name: string; qty: number; price: number }[];
  total: number;
  status: string;
  vendedor: string;
}

export default function VendasTempoReal() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [period, setPeriod] = useState("hoje");

  useEffect(() => {
    const stored = localStorage.getItem("belezanativa_orders");
    if (stored) setOrders(JSON.parse(stored));
  }, []);

  const filteredOrders = orders.filter((o) => {
    const d = new Date(o.date);
    const now = new Date();
    if (period === "hoje") return d.toDateString() === now.toDateString();
    if (period === "semana") {
      const week = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return d >= week;
    }
    if (period === "mes") return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    return true;
  });

  const totalVendas = filteredOrders.reduce((s, o) => s + o.total, 0);
  const totalPedidos = filteredOrders.length;
  const ticketMedio = totalPedidos > 0 ? totalVendas / totalPedidos : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Vendas em Tempo Real</h1>
        <div className="flex gap-2">
          {[
            { key: "hoje", label: "Hoje" },
            { key: "semana", label: "7 dias" },
            { key: "mes", label: "Este mês" },
            { key: "todos", label: "Todos" },
          ].map((p) => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${
                period === p.key ? "bg-[#7BC9C2] text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Total em Vendas</p>
          <p className="text-2xl font-bold text-green-600 mt-1">R$ {totalVendas.toFixed(2).replace(".", ",")}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Pedidos</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{totalPedidos}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Ticket Médio</p>
          <p className="text-2xl font-bold text-[#7BC9C2] mt-1">R$ {ticketMedio.toFixed(2).replace(".", ",")}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-700">Últimos Pedidos</h2>
        </div>
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="font-medium">Nenhuma venda no período</p>
            <p className="text-sm mt-1">As vendas aparecerão aqui em tempo real</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Pedido</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Cliente</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Vendedor</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Data</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500">Total</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-700">#{o.id}</td>
                    <td className="px-4 py-3 text-gray-600">{o.customer}</td>
                    <td className="px-4 py-3 text-gray-600">{o.vendedor || "—"}</td>
                    <td className="px-4 py-3 text-gray-500">{new Date(o.date).toLocaleString("pt-BR")}</td>
                    <td className="px-4 py-3 text-right font-bold text-gray-700">R$ {o.total.toFixed(2).replace(".", ",")}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                        o.status === "confirmado" ? "bg-green-100 text-green-700" :
                        o.status === "enviado" ? "bg-blue-100 text-blue-700" :
                        o.status === "entregue" ? "bg-purple-100 text-purple-700" :
                        o.status === "cancelado" ? "bg-red-100 text-red-700" :
                        "bg-yellow-100 text-yellow-700"
                      }`}>
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
