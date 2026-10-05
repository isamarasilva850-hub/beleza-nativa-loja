"use client";

import { useState, useEffect } from "react";

interface OrderItem {
  ref: string;
  name: string;
  color: string;
  size: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Order {
  number: number;
  date: string;
  revendedora: string;
  items: OrderItem[];
  total: number;
  totalItems: number;
  status: "pendente" | "confirmado" | "enviado" | "entregue" | "cancelado";
}

const statusColors: Record<string, string> = {
  pendente: "bg-yellow-100 text-yellow-700",
  confirmado: "bg-blue-100 text-blue-700",
  enviado: "bg-purple-100 text-purple-700",
  entregue: "bg-green-100 text-green-700",
  cancelado: "bg-red-100 text-red-600",
};

const ORDERS_KEY = "belezanativa_orders";

export default function AdminPedidos() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(ORDERS_KEY);
    if (saved) setOrders(JSON.parse(saved));
  }, []);

  const saveOrders = (updated: Order[]) => {
    setOrders(updated);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
  };

  const updateStatus = (orderNumber: number, newStatus: Order["status"]) => {
    saveOrders(
      orders.map((o) =>
        o.number === orderNumber ? { ...o, status: newStatus } : o
      )
    );
  };

  const sendToWhatsApp = (order: Order) => {
    // Buscar cliente no CRM para pegar o telefone
    const crmClientes = localStorage.getItem("belezanativa_crm_clientes");
    let clientPhone = "";

    if (crmClientes) {
      try {
        const clientes = JSON.parse(crmClientes);
        const cliente = clientes.find((c: any) =>
          (c.nome || c.name || "").toLowerCase() === order.revendedora.toLowerCase()
        );
        if (cliente) {
          clientPhone = (cliente.telefone || cliente.phone || "").replace(/\D/g, "");
        }
      } catch (e) {
        console.error("Erro ao buscar cliente", e);
      }
    }

    if (!clientPhone) {
      const phone = prompt(`Digite o WhatsApp de ${order.revendedora}:`, "55");
      if (!phone) return;
      clientPhone = phone.replace(/\D/g, "");
    }

    const resumoTexto = `📦 *PEDIDO #${order.number}*\n*PARA ${order.revendedora.toUpperCase()}*\n\n${order.items
      .map((item) => `*REF ${item.ref}*\n${item.name}\n${item.color} - ${item.size}\nQtd: ${item.quantity} x R$ ${item.unitPrice.toFixed(2).replace(".", ",")} = R$ ${item.total.toFixed(2).replace(".", ",")}`)
      .join("\n\n")}\n\n${"─".repeat(25)}\n*TOTAL: R$ ${order.total.toFixed(2).replace(".", ",")}*\n\n✅ Status: ${order.status.toUpperCase()}`;

    const url = `https://wa.me/${clientPhone}?text=${encodeURIComponent(resumoTexto)}`;
    window.open(url, "_blank");
  };

  const filtered = orders.filter((o) => !statusFilter || o.status === statusFilter);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Pedidos</h1>
        <span className="text-sm text-gray-500">{orders.length} pedidos</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        {(["pendente", "confirmado", "enviado", "entregue", "cancelado"] as const).map((status) => {
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

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {filtered.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {filtered.map((order) => (
              <div key={order.number}>
                <div
                  className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 cursor-pointer"
                  onClick={() => setExpandedOrder(expandedOrder === order.number ? null : order.number)}
                >
                  <span className="font-mono text-xs font-semibold text-[#7BC9C2] w-16">#{order.number}</span>
                  <span className="text-xs text-gray-500 w-32">
                    {new Date(order.date).toLocaleDateString("pt-BR")}
                  </span>
                  <span className="text-xs font-medium text-gray-800 flex-1">{order.revendedora}</span>
                  <span className="text-xs text-gray-500 w-16">{order.totalItems} itens</span>
                  <span className="text-xs font-semibold text-gray-700 w-24 text-right">
                    R$ {order.total.toFixed(2).replace(".", ",")}
                  </span>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium capitalize ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                  <svg
                    className={`w-4 h-4 text-gray-400 transition-transform ${expandedOrder === order.number ? "rotate-180" : ""}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {expandedOrder === order.number && (
                  <div className="px-4 pb-4 bg-gray-50/50">
                    <div className="flex items-center gap-2 mb-3 pt-2 flex-wrap">
                      <span className="text-xs font-medium text-gray-500">Alterar status:</span>
                      {(["pendente", "confirmado", "enviado", "entregue", "cancelado"] as const).map((s) => (
                        <button
                          key={s}
                          onClick={() => updateStatus(order.number, s)}
                          className={`px-2 py-1 rounded text-[10px] font-medium capitalize transition-colors ${
                            order.status === s
                              ? statusColors[s]
                              : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                      <button
                        onClick={() => sendToWhatsApp(order)}
                        className="ml-auto px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-xs font-medium transition-colors"
                      >
                        📱 WhatsApp
                      </button>
                    </div>
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="text-gray-500 border-b border-gray-200">
                          <th className="text-left py-1.5 font-medium">Ref</th>
                          <th className="text-left py-1.5 font-medium">Produto</th>
                          <th className="text-left py-1.5 font-medium">Cor</th>
                          <th className="text-left py-1.5 font-medium">Tam</th>
                          <th className="text-right py-1.5 font-medium">Qtd</th>
                          <th className="text-right py-1.5 font-medium">Unit.</th>
                          <th className="text-right py-1.5 font-medium">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items.map((item, i) => (
                          <tr key={i} className="border-b border-gray-100">
                            <td className="py-1.5 font-mono text-gray-500">{item.ref}</td>
                            <td className="py-1.5 text-gray-700">{item.name}</td>
                            <td className="py-1.5 text-gray-500">{item.color}</td>
                            <td className="py-1.5 text-gray-500">{item.size}</td>
                            <td className="py-1.5 text-right text-gray-700">{item.quantity}</td>
                            <td className="py-1.5 text-right text-gray-500">R$ {item.unitPrice.toFixed(2).replace(".", ",")}</td>
                            <td className="py-1.5 text-right font-semibold text-gray-700">R$ {item.total.toFixed(2).replace(".", ",")}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
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
