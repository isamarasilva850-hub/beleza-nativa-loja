'use client';

import { useEffect } from 'react';
import { useReports } from '@/hooks/useReports';

export default function RelatoriosPage() {
  const { data, loading, error, loadReports } = useReports();

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  if (loading) {
    return <div className="p-6 text-center text-gray-600">⏳ Carregando relatórios...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">❌ Erro: {error}</div>;
  }

  if (!data) {
    return <div className="p-6 text-center text-gray-600">Sem dados disponíveis</div>;
  }

  return (
    <div className="p-6 space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">📊 Relatórios & Análise</h1>
        <p className="text-gray-600">Acompanhe as vendas, revendedoras top e produtos mais vendidos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-600 font-semibold mb-2">TOTAL DE VENDAS</p>
          <p className="text-3xl font-bold text-blue-900">
            R$ {data.totalSales.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
          <p className="text-sm text-green-600 font-semibold mb-2">TOTAL DE PEDIDOS</p>
          <p className="text-3xl font-bold text-green-900">{data.totalOrders}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
          <p className="text-sm text-purple-600 font-semibold mb-2">TICKET MÉDIO</p>
          <p className="text-3xl font-bold text-purple-900">
            R$ {data.averageTicket.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-lg border border-orange-200">
          <p className="text-sm text-orange-600 font-semibold mb-2">REVENDEDORAS</p>
          <p className="text-3xl font-bold text-orange-900">{data.topPartners.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">📦 Status dos Pedidos</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <p className="text-sm text-yellow-600 font-semibold">Pendente</p>
            <p className="text-2xl font-bold text-yellow-900">{data.orderStatus.pendente}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-600 font-semibold">Pago</p>
            <p className="text-2xl font-bold text-blue-900">{data.orderStatus.pago}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <p className="text-sm text-green-600 font-semibold">Entregue</p>
            <p className="text-2xl font-bold text-green-900">{data.orderStatus.entregue}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">👑 Top 5 Revendedoras por Faturamento</h2>
        {data.topPartners.length > 0 ? (
          <div className="space-y-3">
            {data.topPartners.map((partner, idx) => (
              <div key={partner.id} className="flex items-center gap-4 pb-3 border-b last:border-b-0">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900">{partner.name}</p>
                  <p className="text-xs text-gray-500">{partner.orderCount} pedidos</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-teal-600">R$ {partner.totalSales.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  <p className="text-xs text-gray-500">{((partner.totalSales / data.totalSales) * 100).toFixed(1)}% do total</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">Nenhum pedido registrado</p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">🏆 Top 10 Produtos Mais Vendidos</h2>
          {data.topProducts.length > 0 ? (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {data.topProducts.map((product, idx) => (
                <div key={idx} className="flex items-center justify-between pb-2 border-b last:border-b-0">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.quantity} unidades</p>
                  </div>
                  <p className="text-sm font-semibold text-teal-600">
                    R$ {product.sales.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Nenhum produto vendido</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">🎨 Cores Mais Vendidas</h2>
          {data.topColors.length > 0 ? (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {data.topColors.map((color, idx) => {
                const percentage = (color.quantity / (data.topColors.reduce((sum, c) => sum + c.quantity, 0))) * 100;
                return (
                  <div key={idx} className="pb-3">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-900">{color.color}</p>
                      <p className="text-xs font-semibold text-gray-600">{color.quantity}</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-teal-400 to-teal-600 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Nenhuma cor vendida</p>
          )}
        </div>
      </div>

      {data.monthlySales.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📈 Vendas por Mês</h2>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {data.monthlySales.map((item, idx) => {
              const percentage = (item.total / Math.max(...data.monthlySales.map(m => m.total))) * 100;
              return (
                <div key={idx} className="pb-2">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-700">{item.month}</p>
                    <p className="text-sm font-bold text-teal-600">
                      R$ {item.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-teal-400 to-teal-600 h-3 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
