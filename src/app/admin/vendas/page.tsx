"use client";

import { useState, useEffect } from "react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface Order {
  number: number;
  date: string;
  revendedora: string;
  items: { ref: string; name: string; color: string; size: string; quantity: number; unitPrice: number; total: number }[];
  total: number;
  totalItems: number;
  status: string;
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

  // Calcular gráfico de vendas por dia
  const vendasPorDia: { [key: string]: number } = {};
  filteredOrders.forEach((o) => {
    const dia = new Date(o.date).toLocaleDateString("pt-BR");
    vendasPorDia[dia] = (vendasPorDia[dia] || 0) + o.total;
  });
  const chartData = Object.entries(vendasPorDia).map(([dia, valor]) => ({ dia, valor: parseFloat(valor.toFixed(2)) }));

  // Top 5 produtos
  const produtosMap: { [key: string]: { name: string; quantidade: number; total: number } } = {};
  filteredOrders.forEach((o) => {
    o.items.forEach((item) => {
      if (!produtosMap[item.ref]) {
        produtosMap[item.ref] = { name: item.name, quantidade: 0, total: 0 };
      }
      produtosMap[item.ref].quantidade += item.quantity;
      produtosMap[item.ref].total += item.total;
    });
  });
  const topProdutos = Object.entries(produtosMap)
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, 5)
    .map(([ref, data]) => ({ ref, ...data }));

  // Top 5 revendedoras
  const revendedorasMap: { [key: string]: { pedidos: number; total: number } } = {};
  filteredOrders.forEach((o) => {
    if (!revendedorasMap[o.revendedora]) {
      revendedorasMap[o.revendedora] = { pedidos: 0, total: 0 };
    }
    revendedorasMap[o.revendedora].pedidos += 1;
    revendedorasMap[o.revendedora].total += o.total;
  });
  const topRevendedoras = Object.entries(revendedorasMap)
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, 5)
    .map(([nome, data]) => ({ nome, ...data }));

  // Taxa de cancelamento
  const pedidosCancelados = filteredOrders.filter((o) => o.status === "cancelado").length;
  const taxaCancelamento = totalPedidos > 0 ? (pedidosCancelados / totalPedidos) * 100 : 0;

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
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Revendedora</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Data</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500">Itens</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500">Total</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map((o) => (
                  <tr key={o.number} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono font-medium text-[#7BC9C2]">#{o.number}</td>
                    <td className="px-4 py-3 text-gray-700">{o.revendedora}</td>
                    <td className="px-4 py-3 text-gray-500">{new Date(o.date).toLocaleString("pt-BR")}</td>
                    <td className="px-4 py-3 text-right text-gray-500">{o.totalItems}</td>
                    <td className="px-4 py-3 text-right font-bold text-gray-700">R$ {o.total.toFixed(2).replace(".", ",")}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                        o.status === "confirmado" ? "bg-blue-100 text-blue-700" :
                        o.status === "enviado" ? "bg-purple-100 text-purple-700" :
                        o.status === "entregue" ? "bg-green-100 text-green-700" :
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

      {/* Gráfico de Vendas */}
      {chartData.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-bold text-gray-700 mb-4">📈 Vendas por Dia</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="dia" stroke="#999" style={{ fontSize: "12px" }} />
              <YAxis stroke="#999" style={{ fontSize: "12px" }} />
              <Tooltip formatter={(value: any) => `R$ ${(typeof value === "number" ? value : parseFloat(value || "0")).toFixed(2).replace(".", ",")}`} />
              <Legend />
              <Line type="monotone" dataKey="valor" stroke="#7BC9C2" dot={{ fill: "#7BC9C2", r: 5 }} name="Vendas (R$)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Produtos */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-700">🏆 Top 5 Produtos</h2>
          </div>
          {topProdutos.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">Nenhum produto vendido no período</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {topProdutos.map((p, i) => (
                <div key={p.ref} className="p-4 flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-[#7BC9C2] text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">{i + 1}</span>
                      <span className="font-semibold text-gray-800">{p.name}</span>
                    </div>
                    <p className="text-xs text-gray-500">REF: {p.ref} • Qtd: {p.quantidade}</p>
                  </div>
                  <p className="text-right font-bold text-gray-800">R$ {p.total.toFixed(2).replace(".", ",")}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Revendedoras */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-700">👑 Top 5 Revendedoras</h2>
          </div>
          {topRevendedoras.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">Nenhuma revendedora no período</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {topRevendedoras.map((r, i) => (
                <div key={r.nome} className="p-4 flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-yellow-400 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">{i + 1}</span>
                      <span className="font-semibold text-gray-800">{r.nome}</span>
                    </div>
                    <p className="text-xs text-gray-500">{r.pedidos} pedido{r.pedidos !== 1 ? "s" : ""}</p>
                  </div>
                  <p className="text-right font-bold text-gray-800">R$ {r.total.toFixed(2).replace(".", ",")}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Taxa de Cancelamento */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider">Taxa de Cancelamento</p>
            <p className="text-3xl font-bold mt-2">{taxaCancelamento.toFixed(1)}%</p>
            <p className="text-sm text-gray-600 mt-2">{pedidosCancelados} de {totalPedidos} pedidos cancelados</p>
          </div>
          <div className="text-6xl opacity-20">{taxaCancelamento > 5 ? "⚠️" : "✅"}</div>
        </div>
      </div>
    </div>
  );
}
