'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useOrders } from '@/hooks/useOrders';
import { artesLegendasMap } from '@/data/artes-legendas';
import { telefoneWhatsApp } from '@/lib/vitrine';

export default function PedidosRevendedoras() {
  const { orders, loading, error, loadOrders, updateOrderStatus } = useOrders();
  const [filter, setFilter] = useState<'todos' | 'pendente' | 'pago' | 'artes_enviadas'>('todos');

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const sendArtes = async (order: any) => {
    // Buscar REFs do pedido
    const refs = [...new Set((order.items || []).map((item: any): string => item.ref))] as string[];

    // Gerar link do catálogo
    const catalogLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/vitrine/${order.id}/editar`;

    // Criar mensagem com legendas de cada peça
    const artesMsg = refs
      .map((ref: string) => {
        const arteLegenda = artesLegendasMap[ref as keyof typeof artesLegendasMap];
        const legenda = arteLegenda?.legendaCurta || arteLegenda?.legendaCompleta || `REF ${ref}`;

        return `📸 REF ${ref}\n${legenda}`;
      })
      .join('\n\n');

    const linkLoja = `${typeof window !== 'undefined' ? window.location.origin : ''}/vitrine/${order.id}`;

    const fullMsg = `Oi! Sua vitrine já está pronta 💛\n\n1️⃣ Primeiro, abra este link para colocar a sua logo e o seu preço de revenda em cada peça:\n${catalogLink}\n\n2️⃣ Depois, mande este link para a sua cliente. Ela vai ver as peças como em uma loja, com foto, cor, tamanho e o seu preço:\n${linkLoja}\n\n📸 Só se quiser postar nas suas redes sociais, baixe as fotos:\n1. Abra o primeiro link acima.\n2. Em cada peça, toque em "Baixar foto". A foto é salva no seu celular.\n3. Se o celular pedir permissão, toque em "Permitir".\n\n📝 Legendas prontas para copiar (use junto com as fotos):\n\n${artesMsg}`;

    // Abrir WhatsApp
    window.open(
      `https://wa.me/${telefoneWhatsApp(order.partnerPhone)}?text=${encodeURIComponent(fullMsg)}`,
      '_blank'
    );

    // Marcar como enviado no Supabase
    try {
      await updateOrderStatus(order.id, 'artes_enviadas');
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === 'todos') return true;
    return order.status === filter;
  });

  const statusColor: Record<string, string> = {
    pendente: 'bg-yellow-100 text-yellow-700',
    pago: 'bg-blue-100 text-blue-700',
    artes_enviadas: 'bg-green-100 text-green-700',
  };

  const statusLabel: Record<string, string> = {
    pendente: '⏳ Pendente',
    pago: '✅ Pago',
    artes_enviadas: '🎨 Artes Enviadas',
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

        {loading && <div className="p-8 text-center text-gray-600">⏳ Carregando pedidos...</div>}
        {error && <div className="p-8 text-center text-red-600">❌ Erro: {error}</div>}

        {!loading && !error && (
          <>
            {/* Filtros */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex gap-2 flex-wrap">
              {(['todos', 'pendente', 'pago', 'artes_enviadas'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    filter === status
                      ? 'bg-[#7BC9C2] text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {status === 'todos'
                    ? 'Todos'
                    : status === 'pendente'
                    ? '⏳ Pendente'
                    : status === 'pago'
                    ? '✅ Pago'
                    : '🎨 Artes Enviadas'}
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
                  {order.status === 'pendente' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'pago')}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-bold hover:bg-blue-600"
                    >
                      ✅ Marcar como Pago
                    </button>
                  )}

                  {order.status === 'pago' && (
                    <button
                      onClick={() => sendArtes(order)}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-bold hover:bg-green-600 flex items-center gap-2"
                    >
                      🎨 Enviar Artes WhatsApp
                    </button>
                  )}

                  {order.status === 'artes_enviadas' && (
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
          </>
        )}
      </div>
    </div>
  );
}
