"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { products } from "@/data/products";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const vendedores = [
  { id: 0, name: "TODA A EQUIPE", clients: 54 },
  { id: 1, name: "ROSEMARI APARECIDA RIBEIRO SALOMÃO", clients: 8 },
  { id: 2, name: "ISAMARA DE CASSIA SILVA", clients: 37 },
  { id: 4, name: "JAYNIE ALMEIDA CELESTINO SALES", clients: 9 },
];

interface Order {
  number: number;
  date: string;
  revendedora: string;
  items: any[];
  total: number;
  totalItems: number;
  status: string;
}

interface CRMLead {
  id: string;
  nome: string;
  telefone: string;
  etapa: string;
  proximaAcao: string;
  proximaData: string;
  notas: string;
}

export default function AdminDashboard() {
  const [stockTotal, setStockTotal] = useState(0);
  const [partnersCount, setPartnersCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [crmClientes, setCrmClientes] = useState(0);
  const [salesData, setSalesData] = useState({ today: 0, week: 0, month: 0, total: 0 });
  const [pendingOrders, setPendingOrders] = useState(0);
  const [activeResellers, setActiveResellers] = useState(0);
  const [lastOrders, setLastOrders] = useState<Order[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [crmLeads, setCrmLeads] = useState<CRMLead[]>([]);
  const [crmStats, setCrmStats] = useState({ total: 0, convertidos: 0, taxaConversao: "0" });

  useEffect(() => {
    const stock = localStorage.getItem("belezanativa_stock");
    if (stock) {
      const items = JSON.parse(stock);
      setStockTotal(items.reduce((sum: number, s: { quantity: number }) => sum + s.quantity, 0));
    }
    const partners = localStorage.getItem("belezanativa_partners");
    if (partners) setPartnersCount(JSON.parse(partners).filter((p: { status: string }) => p.status === "ativo").length);

    // Orders & Sales Data
    const orders = localStorage.getItem("belezanativa_orders");
    if (orders) {
      const orderList: Order[] = JSON.parse(orders);
      setOrdersCount(orderList.length);
      setPendingOrders(orderList.filter((o) => o.status === "pendente").length);

      // Calculate sales by period
      const now = new Date();
      const today = now.toDateString();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      let totalToday = 0, totalWeek = 0, totalMonth = 0, totalAll = 0;
      const resellers = new Set<string>();

      orderList.forEach((o) => {
        const orderDate = new Date(o.date);
        totalAll += o.total;

        if (orderDate.toDateString() === today) totalToday += o.total;
        if (orderDate >= weekAgo) totalWeek += o.total;
        if (orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear()) {
          totalMonth += o.total;
        }

        resellers.add(o.revendedora);
      });

      setActiveResellers(resellers.size);
      setSalesData({ today: totalToday, week: totalWeek, month: totalMonth, total: totalAll });
      setLastOrders(orderList.slice(-5).reverse());

      // Prepare chart data (sales by day)
      const salesByDay: { [key: string]: number } = {};
      orderList.forEach((o) => {
        const dia = new Date(o.date).toLocaleDateString("pt-BR");
        salesByDay[dia] = (salesByDay[dia] || 0) + o.total;
      });
      setChartData(Object.entries(salesByDay).map(([dia, valor]) => ({ dia, valor: parseFloat(valor.toFixed(2)) })));
    }

    // CRM Data
    const crmClientesData = localStorage.getItem("belezanativa_crm_clientes");
    if (crmClientesData) setCrmClientes(JSON.parse(crmClientesData).length);
    const crmLeadsRaw = localStorage.getItem("belezanativa_crm_leads");
    if (crmLeadsRaw) {
      const leads: CRMLead[] = JSON.parse(crmLeadsRaw);
      setCrmLeads(leads);
      const convertidos = leads.filter((l) => l.etapa === "convertido").length;
      setCrmStats({
        total: leads.length,
        convertidos,
        taxaConversao: leads.length > 0 ? ((convertidos / leads.length) * 100).toFixed(1) : "0",
      });
    }
  }, []);


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard de Vendas</h1>
        <p className="text-sm text-gray-500">{new Date().toLocaleDateString("pt-BR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
      </div>

      {/* Sales KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 p-5">
          <p className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-1">Hoje</p>
          <p className="text-3xl font-bold text-green-700">R$ {salesData.today.toFixed(2).replace(".", ",")}</p>
          <p className="text-xs text-green-600 mt-2">💰 Vendas do dia</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 p-5">
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">Esta Semana</p>
          <p className="text-3xl font-bold text-blue-700">R$ {salesData.week.toFixed(2).replace(".", ",")}</p>
          <p className="text-xs text-blue-600 mt-2">📊 7 últimos dias</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 p-5">
          <p className="text-xs font-semibold text-purple-600 uppercase tracking-wider mb-1">Este Mês</p>
          <p className="text-3xl font-bold text-purple-700">R$ {salesData.month.toFixed(2).replace(".", ",")}</p>
          <p className="text-xs text-purple-600 mt-2">📈 Período atual</p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl border-2 border-orange-200 p-5">
          <p className="text-xs font-semibold text-orange-600 uppercase tracking-wider mb-1">Total Geral</p>
          <p className="text-3xl font-bold text-orange-700">R$ {salesData.total.toFixed(2).replace(".", ",")}</p>
          <p className="text-xs text-orange-600 mt-2">🎯 Todas as vendas</p>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
          <p className="text-xs font-semibold text-red-600 uppercase">Pedidos Pendentes</p>
          <p className="text-2xl font-bold text-red-700 mt-1">{pendingOrders}</p>
          <p className="text-xs text-red-600 mt-2">⏳ Aguardando confirmação</p>
        </div>
        <div className="bg-[#7BC9C2]/10 border-l-4 border-[#7BC9C2] rounded-lg p-4">
          <p className="text-xs font-semibold text-[#7BC9C2] uppercase">Revendedoras Ativas</p>
          <p className="text-2xl font-bold text-[#7BC9C2] mt-1">{activeResellers}</p>
          <p className="text-xs text-[#7BC9C2] mt-2">👥 Fizeram compras</p>
        </div>
        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
          <p className="text-xs font-semibold text-blue-600 uppercase">Total de Pedidos</p>
          <p className="text-2xl font-bold text-blue-700 mt-1">{ordersCount}</p>
          <p className="text-xs text-blue-600 mt-2">📦 Histórico completo</p>
        </div>
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">📈 Evolução de Vendas</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="dia" stroke="#999" style={{ fontSize: "12px" }} />
              <YAxis stroke="#999" style={{ fontSize: "12px" }} />
              <Tooltip formatter={(value) => `R$ ${value.toFixed(2).replace(".", ",")}`} />
              <Line type="monotone" dataKey="valor" stroke="#7BC9C2" strokeWidth={2} dot={{ fill: "#7BC9C2", r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500 w-10 h-10 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{products.length}</p>
              <p className="text-xs text-gray-500">Produtos</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-500 w-10 h-10 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{ordersCount}</p>
              <p className="text-xs text-gray-500">Pedidos</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="bg-[#7BC9C2] w-10 h-10 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{partnersCount}</p>
              <p className="text-xs text-gray-500">Parceiros</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="bg-purple-500 w-10 h-10 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stockTotal}</p>
              <p className="text-xs text-gray-500">Peças</p>
            </div>
          </div>
        </div>
        <Link href="/admin/crm" className="bg-gradient-to-br from-[#7BC9C2] to-[#5fb3ac] rounded-xl shadow-sm border border-[#7BC9C2]/30 p-4 text-white hover:shadow-md transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl">📊</div>
            <div>
              <p className="text-2xl font-bold">{crmClientes + crmLeads.length}</p>
              <p className="text-xs opacity-90">CRM (C+L)</p>
            </div>
          </div>
        </Link>
      </div>


      {/* Menu de Gestão - replica Via Shop sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* CRM Completo - DESTAQUE */}
        <Link href="/admin/crm" className="bg-gradient-to-br from-[#7BC9C2] to-[#5fb3ac] rounded-xl shadow-lg border border-[#7BC9C2]/30 p-6 text-white hover:shadow-xl transition-all hover:scale-105">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold mb-1">CRM Completo</h3>
              <p className="text-xs opacity-90">Gerencie clientes e leads</p>
            </div>
            <div className="text-4xl">📊</div>
          </div>
          <div className="space-y-2 text-xs opacity-90">
            <div className="flex items-center gap-2">
              <span>✓</span>
              <span>Dashboard de KPIs</span>
            </div>
            <div className="flex items-center gap-2">
              <span>✓</span>
              <span>Pipeline de Leads</span>
            </div>
            <div className="flex items-center gap-2">
              <span>✓</span>
              <span>Carteira de Clientes</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/20 text-xs font-semibold">
            Clique para acessar →
          </div>
        </Link>

        {/* Gestão de Produtos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#7BC9C2]" />
            Gestão de Produtos
          </h3>
          <div className="space-y-1">
            <Link href="/admin/produtos" className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">Gerenciar Produtos</Link>
            <Link href="/admin/estoque" className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">Controle de Estoque</Link>
          </div>
        </div>

        {/* Comercial */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            Comercial
          </h3>
          <div className="space-y-1">
            <Link href="/admin/pedidos" className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">Painel de Pedidos</Link>
            <Link href="/admin/parceiros" className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">Carteira de Clientes</Link>
            <Link href="/admin/leads" className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">Gerenciar Leads</Link>
          </div>
        </div>

        {/* Ferramentas */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
            Ferramentas
          </h3>
          <div className="space-y-1">
            <a href="https://wa.me/5535992100072" target="_blank" rel="noopener noreferrer" className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">WhatsApp Comercial</a>
            <Link href="/admin/tabela-precos" className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">Imprimir Tabela de Preços</Link>
            <Link href="/" className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">Ver Loja Virtual</Link>
          </div>
        </div>
      </div>

      {/* CRM Funnel Stats */}
      {crmStats.total > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl border-2 border-pink-200 p-4">
            <p className="text-xs font-semibold text-pink-600 uppercase">Leads no Funil</p>
            <p className="text-3xl font-bold text-pink-700 mt-1">{crmStats.total}</p>
            <p className="text-xs text-pink-600 mt-2">📞 Total de prospecções</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 p-4">
            <p className="text-xs font-semibold text-green-600 uppercase">Convertidos</p>
            <p className="text-3xl font-bold text-green-700 mt-1">{crmStats.convertidos}</p>
            <p className="text-xs text-green-600 mt-2">🎉 Fechados como clientes</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 p-4">
            <p className="text-xs font-semibold text-blue-600 uppercase">Taxa de Conversão</p>
            <p className="text-3xl font-bold text-blue-700 mt-1">{crmStats.taxaConversao}%</p>
            <p className="text-xs text-blue-600 mt-2">📈 Efetividade do funil</p>
          </div>
        </div>
      )}

      {/* Latest Orders */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">⚡ Últimas Vendas em Tempo Real</h2>
          <Link href="/admin/vendas" className="text-xs text-[#7BC9C2] hover:underline font-semibold">Ver todas →</Link>
        </div>
        {lastOrders.length === 0 ? (
          <p className="text-center py-8 text-gray-400">Nenhuma venda registrada ainda</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">Pedido</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">Revendedora</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">Itens</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-600">Total</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {lastOrders.map((order) => (
                  <tr key={order.number} className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-mono font-bold text-[#7BC9C2]">#{order.number}</td>
                    <td className="py-3 px-4 text-gray-800 font-medium">{order.revendedora}</td>
                    <td className="py-3 px-4 text-gray-600">{order.totalItems} peça{order.totalItems !== 1 ? "s" : ""}</td>
                    <td className="py-3 px-4 text-right font-bold text-gray-800">R$ {order.total.toFixed(2).replace(".", ",")}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        order.status === "pendente" ? "bg-yellow-100 text-yellow-700" :
                        order.status === "confirmado" ? "bg-blue-100 text-blue-700" :
                        order.status === "enviado" ? "bg-purple-100 text-purple-700" :
                        order.status === "entregue" ? "bg-green-100 text-green-700" :
                        "bg-red-100 text-red-700"
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CRM Leads for Today */}
      {crmLeads.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">📅 Leads para Ação Hoje</h2>
            <Link href="/admin/crm" className="text-xs text-[#7BC9C2] hover:underline font-semibold">Ver CRM →</Link>
          </div>
          {crmLeads.filter((l) => l.proximaData === new Date().toISOString().split("T")[0]).length === 0 ? (
            <p className="text-center py-6 text-gray-400">Nenhum lead para contatar hoje</p>
          ) : (
            <div className="space-y-3">
              {crmLeads
                .filter((l) => l.proximaData === new Date().toISOString().split("T")[0])
                .slice(0, 5)
                .map((lead) => (
                  <div key={lead.id} className="flex items-center justify-between p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg">
                    <div>
                      <p className="font-semibold text-gray-800">{lead.nome}</p>
                      <p className="text-xs text-gray-600 mt-1">{lead.etapa.toUpperCase()}</p>
                    </div>
                    <a
                      href={`https://wa.me/${lead.telefone.replace(/\D/g, "")}?text=${encodeURIComponent(lead.proximaAcao)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded transition-colors"
                    >
                      💬 WhatsApp
                    </a>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* Resumo + Produtos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Resumo */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4">Resumo</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="pb-2 text-left text-xs font-medium text-gray-500">Descrição</th>
                <th className="pb-2 text-right text-xs font-medium text-gray-500">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <tr><td className="py-2 text-gray-600">Pedidos em andamento</td><td className="py-2 text-right font-medium text-gray-800">0</td></tr>
              <tr><td className="py-2 text-gray-600">Pedidos entregues</td><td className="py-2 text-right font-medium text-gray-800">0</td></tr>
              <tr><td className="py-2 text-gray-600">Pedidos cancelados</td><td className="py-2 text-right font-medium text-gray-800">0</td></tr>
              <tr><td className="py-2 text-gray-600">Cadastros ativos</td><td className="py-2 text-right font-medium text-gray-800">{partnersCount}</td></tr>
              <tr><td className="py-2 text-gray-600">Produtos cadastrados</td><td className="py-2 text-right font-medium text-gray-800">{products.length}</td></tr>
            </tbody>
          </table>
        </div>

        {/* Produtos Recentes */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Produtos Recentes</h3>
            <Link href="/admin/produtos" className="text-xs text-[#7BC9C2] hover:underline">Ver todos</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100">
                  <th className="pb-2 font-medium text-xs">Ref</th>
                  <th className="pb-2 font-medium text-xs">Produto</th>
                  <th className="pb-2 font-medium text-xs">Categoria</th>
                  <th className="pb-2 font-medium text-xs">Atacado</th>
                  <th className="pb-2 font-medium text-xs">Varejo</th>
                  <th className="pb-2 font-medium text-xs">Cores</th>
                </tr>
              </thead>
              <tbody>
                {products.slice(0, 8).map((p) => (
                  <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-2 font-mono text-xs text-[#7BC9C2] font-semibold">{p.ref}</td>
                    <td className="py-2 text-xs font-medium text-gray-800">{p.name}</td>
                    <td className="py-2 text-xs text-gray-500">{p.category}</td>
                    <td className="py-2 text-xs text-gray-700">R$ {p.price.toFixed(2).replace(".", ",")}</td>
                    <td className="py-2 text-xs text-gray-700">R$ {(p.price * 2).toFixed(2).replace(".", ",")}</td>
                    <td className="py-2">
                      <div className="flex gap-0.5">
                        {p.variants.map((v, i) => (
                          <span key={i} className="w-3.5 h-3.5 rounded-full border border-gray-200" style={{ backgroundColor: v.colorHex }} title={v.color} />
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
