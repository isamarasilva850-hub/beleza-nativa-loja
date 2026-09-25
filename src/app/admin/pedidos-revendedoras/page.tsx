"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { artesLegendasMap } from "@/data/artes-legendas";

interface Partner {
  id: string;
  name: string;
  company: string;
  phone: string;
  city: string;
  state: string;
}

interface PurchasedProduct {
  productId: number;
  ref: string;
  quantity: number;
  color: string;
  size: string;
  purchaseDate: string;
  price: number;
  name: string;
}

interface OrderRecord {
  id: string;
  partnerId: string;
  partnerName: string;
  partnerPhone: string;
  items: Array<{
    productId: number;
    ref: string;
    name: string;
    price: number;
    color: string;
    size: string;
    quantity: number;
  }>;
  total: number;
  date: string;
  status: "pendente" | "pago" | "artes_enviadas";
}

const ARTE_REFS: Record<string, string> = {
  "031": "Biquíni 031",
  "055": "Shortinho 055",
  "062": "Conjunto 062",
  "067": "Biquíni 067",
  "073": "Biquíni 073",
  "079": "Biquíni 079",
  "091": "Shortinho 091",
  "096": "Shortinho 096",
  "443": "Lingerie 443",
  "445": "Lingerie 445",
  "466": "Lingerie 466",
  "510": "Biquíni 510",
  "515": "Biquíni 515",
  "537": "Conjunto 537",
  "554": "Biquíni 554",
};

export default function PedidosRevendedoras() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [filter, setFilter] = useState<"todos" | "pendente" | "pago" | "artes_enviadas">("todos");

  useEffect(() => {
    // Carregar parceiros
    const saved = localStorage.getItem("belezanativa_partners");
    if (saved) {
      setPartners(JSON.parse(saved));
    }

    // Carregar pedidos salvos
    const savedOrders = localStorage.getItem("belezanativa_orders");
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  const saveOrders = (newOrders: OrderRecord[]) => {
    setOrders(newOrders);
    localStorage.setItem("belezanativa_orders", JSON.stringify(newOrders));
  };

  const createOrderFromSimulation = (partnerId: string, items: any[], total: number) => {
    const partner = partners.find((p) => p.id === partnerId);
    if (!partner) return;

    const newOrder: OrderRecord = {
      id: Date.now().toString(36),
      partnerId,
      partnerName: partner.company || partner.name,
      partnerPhone: partner.phone,
      items,
      total,
      date: new Date().toLocaleDateString("pt-BR"),
      status: "pendente",
    };

    saveOrders([newOrder, ...orders]);
  };

  const updateStatus = (orderId: string, status: OrderRecord["status"]) => {
    const updated = orders.map((o) => (o.id === orderId ? { ...o, status } : o));
    saveOrders(updated);
  };

  const sendArtes = (order: OrderRecord) => {
    // Buscar REFs do pedido
    const refs = [...new Set(order.items.map((item) => item.ref))];

    // Gerar link do catálogo
    const catalogLink = `${typeof window !== "undefined" ? window.location.origin : ""}/catalogo-revendedora/${order.partnerId}`;

    // Criar mensagem com artes E legendas
    const artesMsg = refs
      .map((ref) => {
        const arteLegenda = artesLegendasMap[ref];
        const arteName = ARTE_REFS[ref] || `REF ${ref}`;
        const legenda = arteLegenda?.legendaCurta || arteLegenda?.legendaCompleta || "";

        return `📸 ${arteName}\n${legenda}`;
      })
      .join("\n\n");

    const fullMsg = `🎨 ARTES DO SEU PEDIDO\n\n${artesMsg}\n\n---\n\n📱 Seu Catálogo Exclusivo:\n${catalogLink}\n\n🔗 Acesse agora para gerenciar seus produtos e simular novos pedidos!\n\nTodas as artes estão prontas para você usar nas suas redes sociais e WhatsApp! ✨`;

    // Abrir WhatsApp
    window.open(
      `https://wa.me/${order.partnerPhone}?text=${encodeURIComponent(fullMsg)}`,
      "_blank"
    );

    // Marcar como enviado
    updateStatus(order.id, "artes_enviadas");
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === "todos") return true;
    return order.status === filter;
  });

  const statusColor: Record<OrderRecord["status"], string> = {
    pendente: "bg-yellow-100 text-yellow-700",
    pago: "bg-blue-100 text-blue-700",
    artes_enviadas: "bg-green-100 text-green-700",
  };

  const statusLabel: Record<OrderRecord["status"], string> = {
    pendente: "⏳ Pendente",
    pago: "✅ Pago",
    artes_enviadas: "🎨 Artes Enviadas",
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-700 mb-4 block">
            ← Voltar
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">📦 Pedidos das Revendedoras</h1>
          <p className="text-gray-600 mt-1">Gerenciar pedidos e enviar artes</p>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex gap-2 flex-wrap">
          {(["todos", "pendente", "pago", "artes_enviadas"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                filter === status
                  ? "bg-[#7BC9C2] text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {status === "todos"
                ? "Todos"
                : status === "pendente"
                ? "⏳ Pendente"
                : status === "pago"
                ? "✅ Pago"
                : "🎨 Artes Enviadas"}
            </button>
          ))}
        </div>

        {/* Pedidos */}
        {filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[#7BC9C2]">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-bold text-gray-800">{order.partnerName}</h2>
                    <p className="text-sm text-gray-500">{order.partnerPhone}</p>
                    <p className="text-xs text-gray-400 mt-1">Data: {order.date}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColor[order.status]}`}>
                    {statusLabel[order.status]}
                  </span>
                </div>

                {/* Itens */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-xs font-bold text-gray-600 mb-3">PRODUTOS:</p>
                  <div className="space-y-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="text-sm text-gray-700">
                        <span className="font-semibold">REF {item.ref}</span> - {item.name} ({item.color}/{item.size})
                        <span className="ml-2 text-[#7BC9C2] font-bold">{item.quantity}x R$ {item.price.toFixed(2).replace(".", ",")}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between font-bold">
                    <span>Total:</span>
                    <span className="text-[#7BC9C2] text-lg">R$ {order.total.toFixed(2).replace(".", ",")}</span>
                  </div>
                </div>

                {/* Ações */}
                <div className="flex gap-2 flex-wrap">
                  {order.status === "pendente" && (
                    <button
                      onClick={() => updateStatus(order.id, "pago")}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-bold hover:bg-blue-600"
                    >
                      ✅ Marcar como Pago
                    </button>
                  )}

                  {order.status === "pago" && (
                    <button
                      onClick={() => sendArtes(order)}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-bold hover:bg-green-600 flex items-center gap-2"
                    >
                      🎨 Enviar Artes WhatsApp
                    </button>
                  )}

                  {order.status === "artes_enviadas" && (
                    <button
                      onClick={() => sendArtes(order)}
                      className="px-4 py-2 bg-gray-400 text-white rounded-lg text-sm font-bold hover:bg-gray-500"
                    >
                      🔄 Reenviar Artes
                    </button>
                  )}

                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(`📦 PEDIDO DE ${order.partnerName}\n\n${order.items.map((i) => `REF ${i.ref} - ${i.name}\nQtd: ${i.quantity}`).join("\n\n")}\n\nTOTAL: R$ ${order.total.toFixed(2).replace(".", ",")}`)
                    }
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-300"
                  >
                    📋 Copiar Pedido
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl">
            <p className="text-gray-500 text-lg">Nenhum pedido encontrado</p>
            <p className="text-gray-400 text-sm mt-1">
              Pedidos aparecerão aqui quando você simular no painel de simulador
            </p>
          </div>
        )}

        {/* Info */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-900">
            <strong>ℹ️ Como funciona:</strong>
            <br />
            1. Você simula um pedido no <strong>/admin/simular-pedido-revendedora</strong>
            <br />
            2. O pedido aparece aqui
            <br />
            3. Marque como "Pago"
            <br />
            4. Clique em "Enviar Artes" - automático envia pro WhatsApp dela! 🎨
          </p>
        </div>
      </div>
    </div>
  );
}
