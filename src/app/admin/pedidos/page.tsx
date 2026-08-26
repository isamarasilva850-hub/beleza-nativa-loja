"use client";

import { useState } from "react";

interface OrderItem {
  ref: string;
  name: string;
  color: string;
  size: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  date: string;
  client: string;
  phone: string;
  items: OrderItem[];
  total: number;
  status: "pendente" | "confirmado" | "enviado" | "entregue" | "cancelado";
}

const statusColors: Record<string, string> = {
  pendente: "bg-yellow-100 text-yellow-700",
  confirmado: "bg-blue-100 text-blue-700",
  enviado: "bg-purple-100 text-purple-700",
  entregue: "bg-green-100 text-green-700",
  cancelado: "bg-red-100 text-red-600",
};

export default function AdminPedidos() {
  const [orders] = useState<Order[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("belezanativa_orders");
      if (saved) return JSON.parse(saved);
    }
    return [];
  });
  const [statusFilter, setStatusFilter] = useState("");

  const filtered = orders.filter((o) => !statusFilter || o.status === statusFilter);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Pedidos</h1>
        <span className="text-sm text-gray-500">{orders.length} pedidos</span>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        {["pendente", "confirmado", "enviado", "entregue", "cancelado"].map((status) => {
          const count = orders.filter((o) => o.status === status).length;
          return (
            <button
              key={status}
              onClick={() => setStatusFilter(statusFilter === status ? "" : status)}
              className={`rounded-xl border p-3 text-center transition-colors ${
                statusFilter === status ? "border-[#7BC9C2] bg-[#7BC9C2]/5" : "border-gray-100 bg-white"
              }`}
            >
              <p className="text-xl font-bold text-gray-800">{count}</p>
              <p className="text-xs text-gray-500 capitalize">{status}</p>
            </button>
          );
        })}
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr className="text-left text-gray-600">
                  <th className="px-4 py-3 font-semibold">Pedido</th>
                  <th className="px-4 py-3 font-semibold">Data</th>
                  <th className="px-4 py-3 font-semibold">Cliente</th>
                  <th className="px-4 py-3 font-semibold">Itens</th>
                  <th className="px-4 py-3 font-semibold">Total</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => (
                  <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs font-semibold text-[#7BC9C2]">#{order.id}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{order.date}</td>
                    <td className="px-4 py-3">
                      <p className="text-xs font-medium text-gray-800">{order.client}</p>
                      <p className="text-xs text-gray-400">{order.phone}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">{order.items.length} itens</td>
                    <td className="px-4 py-3 text-xs font-semibold text-gray-700">R$ {order.total.toFixed(2).replace(".", ",")}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium capitalize ${statusColors[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 text-gray-400">
            <svg className="w-16 h-16 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-lg font-medium">Nenhum pedido ainda</p>
            <p className="text-sm mt-1">Os pedidos aparecerão aqui quando forem realizados</p>
          </div>
        )}
      </div>
    </div>
  );
}
