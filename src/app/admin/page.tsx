"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { products } from "@/data/products";

const vendedores = [
  { id: 0, name: "TODA A EQUIPE", clients: 54 },
  { id: 1, name: "ROSEMARI APARECIDA RIBEIRO SALOMÃO", clients: 8 },
  { id: 2, name: "ISAMARA DE CASSIA SILVA", clients: 37 },
  { id: 4, name: "JAYNIE ALMEIDA CELESTINO SALES", clients: 9 },
];

export default function AdminDashboard() {
  const [selectedVendedor, setSelectedVendedor] = useState(0);
  const [stockTotal, setStockTotal] = useState(0);
  const [partnersCount, setPartnersCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [crmClientes, setCrmClientes] = useState(0);
  const [crmLeads, setCrmLeads] = useState(0);

  useEffect(() => {
    const stock = localStorage.getItem("belezanativa_stock");
    if (stock) {
      const items = JSON.parse(stock);
      setStockTotal(items.reduce((sum: number, s: { quantity: number }) => sum + s.quantity, 0));
    }
    const partners = localStorage.getItem("belezanativa_partners");
    if (partners) setPartnersCount(JSON.parse(partners).filter((p: { status: string }) => p.status === "ativo").length);
    const orders = localStorage.getItem("belezanativa_orders");
    if (orders) setOrdersCount(JSON.parse(orders).length);

    // CRM Data
    const crmClientes = localStorage.getItem("belezanativa_crm_clientes");
    if (crmClientes) setCrmClientes(JSON.parse(crmClientes).length);
    const crmLeads = localStorage.getItem("belezanativa_crm_leads");
    if (crmLeads) setCrmLeads(JSON.parse(crmLeads).length);
  }, []);

  const today = new Date();
  const monthName = today.toLocaleDateString("pt-BR", { month: "long" }).toUpperCase();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>

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
              <p className="text-2xl font-bold">{crmClientes + crmLeads}</p>
              <p className="text-xs opacity-90">CRM (C+L)</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Funil de Vendas */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wider">Resumo do Funil de Vendas</h2>
          <select
            value={selectedVendedor}
            onChange={(e) => setSelectedVendedor(Number(e.target.value))}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2] bg-white"
          >
            {vendedores.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name} - {v.clients} clientes ativos
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Vendas do período */}
          <div className="bg-gradient-to-br from-[#7BC9C2]/10 to-[#7BC9C2]/5 rounded-xl p-4 border border-[#7BC9C2]/20">
            <p className="text-xs font-semibold text-[#7BC9C2] uppercase mb-2">Valor de Vendas</p>
            <p className="text-2xl font-bold text-gray-800">R$ 0,00</p>
            <p className="text-xs text-gray-500 mt-1">mês atual</p>
            <div className="mt-3 space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Novos</span>
                <span className="font-medium text-gray-700">R$ 0,00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Recompras</span>
                <span className="font-medium text-gray-700">R$ 0,00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Resgatados</span>
                <span className="font-medium text-gray-700">R$ 0,00</span>
              </div>
            </div>
          </div>

          {/* Metas */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-50/50 rounded-xl p-4 border border-blue-100">
            <p className="text-xs font-semibold text-blue-600 uppercase mb-2">Metas</p>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500">Meta do Mês - {monthName}</p>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-500">Vendido</span>
                  <span className="text-xs font-bold text-gray-700">R$ 0,00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-500">Alvo</span>
                  <span className="text-xs font-bold text-gray-700">R$ 0,00</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500">Meta do Dia - {today.toLocaleDateString("pt-BR")}</p>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-500">Vendido</span>
                  <span className="text-xs font-bold text-gray-700">R$ 0,00</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 pt-1 border-t border-blue-100">Ticket médio: R$ 0,00</p>
            </div>
          </div>

          {/* Atendimentos */}
          <div className="bg-gradient-to-br from-green-50 to-green-50/50 rounded-xl p-4 border border-green-100">
            <p className="text-xs font-semibold text-green-600 uppercase mb-2">Atendimentos Hoje</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Clientes Atendidos</span>
                <span className="text-xl font-bold text-gray-800">0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Clientes Agendados</span>
                <span className="text-xl font-bold text-gray-800">0</span>
              </div>
              <div className="pt-2 border-t border-green-100">
                <p className="text-xs text-gray-500">Agenda de Hoje</p>
                <p className="text-xs text-gray-400 mt-1">Nenhuma ocorrência</p>
              </div>
            </div>
          </div>

          {/* Em negociação */}
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-50/50 rounded-xl p-4 border border-yellow-100">
            <p className="text-xs font-semibold text-yellow-600 uppercase mb-2">Em Negociação</p>
            <p className="text-2xl font-bold text-gray-800">R$ 0,00</p>
            <p className="text-xs text-gray-500 mt-1">Valor potencial (não fechado)</p>
            <div className="mt-3 pt-3 border-t border-yellow-100">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Itens em negociação</span>
                <span className="text-xs font-bold text-gray-700">0 itens</span>
              </div>
            </div>
          </div>
        </div>
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
            <Link href="/admin/parceiros" className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">Gerenciar Cadastros</Link>
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
            <Link href="/admin/produtos" className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">Imprimir Tabela de Preços</Link>
            <Link href="/" className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">Ver Loja Virtual</Link>
          </div>
        </div>
      </div>

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
