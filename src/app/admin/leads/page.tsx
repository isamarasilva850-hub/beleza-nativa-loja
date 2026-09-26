'use client';

import { useEffect, useState } from 'react';
import { useLeads } from '@/hooks/useLeads';

export default function LeadsPage() {
  const { leads, loading, error, loadLeads, getStats } = useLeads();
  const [filter, setFilter] = useState<'todos' | 'Lojista' | 'Revendedora'>('todos');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'Já revende' | 'Quer começar'>('todos');

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  const stats = getStats();

  const filtered = leads.filter(lead => {
    const typeMatch = filter === 'todos' || lead.type === filter;
    const statusMatch = statusFilter === 'todos' || lead.status === statusFilter;
    return typeMatch && statusMatch;
  });

  const openWhatsApp = (phone: string, name: string) => {
    const message = `Olá ${name}! Vimos seu interesse em revender conosco. Vamos conversar? 💰`;
    const url = `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">📱 Gerenciador de Leads</h1>
        <p className="text-gray-600">Acompanhe todas as pessoas interessadas em revender</p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-teal-500">
          <p className="text-sm text-gray-600">Total de Leads</p>
          <p className="text-2xl font-bold text-teal-600">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <p className="text-sm text-gray-600">Lojistas</p>
          <p className="text-2xl font-bold text-blue-600">{stats.lojistas}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
          <p className="text-sm text-gray-600">Revendedoras</p>
          <p className="text-2xl font-bold text-purple-600">{stats.revendedoras}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <p className="text-sm text-gray-600">Já revendem</p>
          <p className="text-2xl font-bold text-green-600">{stats.jaRevendem}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-orange-500">
          <p className="text-sm text-gray-600">Quer começar</p>
          <p className="text-2xl font-bold text-orange-600">{stats.queremComecar}</p>
        </div>
      </div>

      {/* FILTROS */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">Tipo</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:border-teal-500 focus:outline-none"
            >
              <option value="todos">Todos</option>
              <option value="Lojista">Lojistas</option>
              <option value="Revendedora">Revendedoras</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:border-teal-500 focus:outline-none"
            >
              <option value="todos">Todos</option>
              <option value="Já revende">Já revende</option>
              <option value="Quer começar">Quer começar</option>
            </select>
          </div>
        </div>
      </div>

      {/* TABELA */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-600">⏳ Carregando leads...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-600">❌ Erro ao carregar: {error}</div>
        ) : leads.length === 0 ? (
          <div className="p-8 text-center text-gray-600">
            <p className="text-lg mb-2">📭 Nenhum lead encontrado</p>
            <p className="text-sm">Quando alguém clicar no botão "Ganhe 100%", aparecerá aqui</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Nome</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Telefone</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Tipo</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Data</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-semibold text-gray-900">{lead.name}</td>
                    <td className="px-6 py-4 text-gray-600">{lead.phone}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        lead.type === 'Lojista'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {lead.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        lead.status === 'Já revende'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => openWhatsApp(lead.phone, lead.name)}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                      >
                        💬 WhatsApp
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* INFO */}
      <div className="mt-6 bg-teal-50 p-4 rounded-lg border border-teal-200">
        <p className="text-sm text-teal-900">
          💡 <strong>Dica:</strong> Clique em "WhatsApp" para entrar em contato com o lead e oferecer mais detalhes sobre como revender conosco!
        </p>
      </div>
    </div>
  );
}
