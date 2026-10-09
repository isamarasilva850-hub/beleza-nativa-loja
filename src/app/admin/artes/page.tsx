'use client';

import { useState, useEffect } from 'react';
import { useOrders } from '@/hooks/useOrders';
import { artesLegendasMap } from '@/data/artes-legendas';
import { telefoneWhatsApp } from '@/lib/vitrine';

export default function ArtesPage() {
  const { orders, loadOrders } = useOrders();
  const [showTestForm, setShowTestForm] = useState(false);
  const [testForm, setTestForm] = useState({ name: 'Revendedora Teste', phone: '11999999999', ref: '001' });

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
      `https://wa.me/${telefoneWhatsApp(order.partnerPhone)}?text=${encodeURIComponent(fullMsg)}`,
      '_blank'
    );
  };

  const sendTestArtes = () => {
    if (!testForm.phone.replace(/\D/g, '')) {
      alert('Digite um número de telefone válido!');
      return;
    }

    const testOrderId = `TEST-${Date.now()}`;
    const testPartnerId = `test-${Date.now()}`;
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const artesLink = `${origin}/artes-pedido/${testOrderId}`;
    const catalogLink = `${origin}/catalogo-revendedora/${testPartnerId}`;

    const fullMsg = `🎨 SUAS ARTES ESTÃO PRONTAS! (TESTE)\n\n📸 Clique aqui para ver todas as fotos com as legendas:\n${artesLink}\n\n---\n\n💡 COMO USAR:\n1️⃣ Baixe as imagens\n2️⃣ Poste no Instagram, Facebook, WhatsApp e Stories\n3️⃣ Venda com as fotos prontas!\n\n---\n\n📱 Seu Catálogo Completo:\n${catalogLink}\n\nAqui tem TODAS as cores, tamanhos e você pode simular novos pedidos quando quiser!\n\nTodas as peças estão prontas para você usar e ganhar! 💰✨`;

    window.open(
      `https://wa.me/${testForm.phone.replace(/\D/g, '')}?text=${encodeURIComponent(fullMsg)}`,
      '_blank'
    );

    setShowTestForm(false);
  };

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🎨 Envio de Artes</h1>
          <p className="text-gray-600">Pedidos pagos aguardando envio de artes via WhatsApp</p>
        </div>
        <button
          onClick={() => setShowTestForm(!showTestForm)}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-semibold transition"
        >
          🧪 Teste Rápido
        </button>
      </div>

      {/* FORMULÁRIO DE TESTE */}
      {showTestForm && (
        <div className="mb-8 bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
          <h2 className="text-lg font-bold text-blue-900 mb-4">🧪 Testar Fluxo de Artes</h2>
          <p className="text-sm text-blue-700 mb-4">Envie um link de teste via WhatsApp para testar se tudo funciona (sem precisar de um pedido pago)</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nome da Revendedora</label>
              <input
                type="text"
                value={testForm.name}
                onChange={(e) => setTestForm({ ...testForm, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                placeholder="Ex: Maria Silva"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp (com DDD)</label>
              <input
                type="text"
                value={testForm.phone}
                onChange={(e) => setTestForm({ ...testForm, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                placeholder="Ex: 11999999999"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">REF do Produto (opcional)</label>
              <input
                type="text"
                value={testForm.ref}
                onChange={(e) => setTestForm({ ...testForm, ref: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                placeholder="Ex: 001"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={sendTestArtes}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-semibold transition"
            >
              ✅ Enviar Link de Teste
            </button>
            <button
              onClick={() => setShowTestForm(false)}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-semibold transition"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

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
