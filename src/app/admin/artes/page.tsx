'use client';

import { useEffect } from 'react';
import { useOrders } from '@/hooks/useOrders';
import { artesLegendasMap } from '@/data/artes-legendas';

export default function ArtesPage() {
  const { orders, loadOrders } = useOrders();

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // Pedidos que foram pagos e artes não foram enviadas
  const pendingArtes = orders.filter(order => order.status === 'pago');

  const sendArtes = async (order: any) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const artesLink = `${origin}/artes-pedido/${order.id}`;
    const catalogLink = `${origin}/catalogo-revendedora/${order.partnerId}`;

    const fullMsg = `🎨 SUAS ARTES ESTÃO PRONTAS!\n\n📸 Clique aqui para ver todas as fotos com as legendas:\n${artesLink}\n\n---\n\n💡 COMO USAR:\n1️⃣ Baixe as imagens\n2️⃣ Poste no Instagram, Facebook, WhatsApp e Stories\n3️⃣ Venda com as fotos prontas!\n\n---\n\n📱 Seu Catálogo Completo:\n${catalogLink}\n\nAqui tem TODAS as cores, tamanhos e você pode simular novos pedidos quando quiser!\n\nTodas as peças estão prontas para você usar e ganhar! 💰✨`;

    window.open(
      `https://wa.me/${order.partnerPhone}?text=${encodeURIComponent(fullMsg)}`,
      '_blank'
    );
  };

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">🎨 Envio de Artes</h1>
        <p className="text-gray-600">Pedidos pagos aguardando envio de artes via WhatsApp</p>
      </div>

      {/* STATS */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200 mb-8">
        <p className="text-sm text-purple-600 font-semibold">PEDIDOS AGUARDANDO ARTES</p>
        <p className="text-4xl font-bold text-purple-900">{pendingArtes.length}</p>
      </div>

      {/* LISTA */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {pendingArtes.length === 0 ? (
          <div className="p-8 text-center text-gray-600">
            <p className="text-lg mb-2">✨ Sem artes para enviar!</p>
            <p className="text-sm">Todos os pedidos já tiveram suas artes enviadas.</p>
          </div>
        ) : (
          <div className="divide-y">
            {pendingArtes.map((order) => (
              <div key={order.id} className="p-6 hover:bg-gray-50 transition">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{order.partnerName}</h3>
                    <p className="text-sm text-gray-500 mt-1">{order.partnerPhone}</p>
                    <p className="text-xs text-gray-400 mt-2">Pedido: {order.date}</p>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                    ✅ Pago
                  </span>
                </div>

                {/* PRODUTOS */}
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="text-xs font-bold text-gray-600 mb-3">PRODUTOS DO PEDIDO:</p>
                  <div className="space-y-2 text-sm">
                    {order.items.map((item: any, idx: number) => (
                      <div key={idx} className="text-gray-700">
                        <span className="font-semibold">REF {item.ref}</span> - {item.name}
                        <span className="text-gray-500 ml-2">({item.color}/{item.size})</span>
                        <span className="text-gray-600 ml-2">{item.quantity}x</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between font-bold">
                    <span>Total:</span>
                    <span className="text-teal-600">R$ {order.total.toFixed(2).replace('.', ',')}</span>
                  </div>
                </div>

                {/* BOTÃO */}
                <button
                  onClick={() => sendArtes(order)}
                  className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg text-sm font-semibold transition flex items-center justify-center gap-2"
                >
                  🎨 Enviar Artes via WhatsApp
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* INFO */}
      <div className="mt-6 bg-green-50 p-4 rounded-lg border border-green-200">
        <p className="text-sm text-green-900">
          <strong>💡 Como funciona:</strong>
          <br />
          1. Quando um pedido é marcado como "Pago" em Pedidos das Revendedoras
          <br />
          2. Ele aparece aqui
          <br />
          3. Clique em "Enviar Artes" → Abre WhatsApp com mensagem pronta
          <br />
          4. Você confirma e envia
          <br />
          5. A revendedora recebe as artes com link do seu catálogo! 🚀
        </p>
      </div>
    </div>
  );
}
