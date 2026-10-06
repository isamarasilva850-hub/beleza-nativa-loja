'use client';

import { useEffect, useState } from 'react';

interface Lead {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  origem: string;
  status: string;
  notas: string;
  created_at: string;
}

export default function LeadsGerenciadorPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [converting, setConverting] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'todos' | 'novo' | 'convertido' | 'descartado'>('novo');

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    try {
      const res = await fetch('/api/crm/leads');
      const data = await res.json();
      setLeads(data || []);
    } catch (error) {
      console.error('Erro ao carregar leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const convertLead = async (lead: Lead) => {
    if (!window.confirm(`Converter "${lead.nome}" para parceira?`)) return;

    setConverting(lead.id);
    try {
      const res = await fetch('/api/crm/leads/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: lead.id,
          nome: lead.nome,
          telefone: lead.telefone,
          email: lead.email || null
        })
      });

      if (!res.ok) throw new Error('Erro ao converter');

      // Recarregar lista
      loadLeads();
      alert('✅ Lead convertido para parceira!');
    } catch (error) {
      alert('❌ Erro ao converter lead');
      console.error(error);
    } finally {
      setConverting(null);
    }
  };

  const openWhatsApp = (phone: string, name: string) => {
    const message = `Olá ${name}! Vimos seu interesse em revender conosco. Vamos conversar? 💰`;
    window.open(`https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const filtered = leads.filter(lead =>
    statusFilter === 'todos' || lead.status === statusFilter
  );

  const stats = {
    novo: leads.filter(l => l.status === 'novo').length,
    convertido: leads.filter(l => l.status === 'convertido').length,
    descartado: leads.filter(l => l.status === 'descartado').length,
  };

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">📊 Gerenciador de Leads CRM</h1>
        <p className="text-gray-600">Gerencie leads do formulário "Quero Começar" e converta em parceiras</p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg shadow border-l-4 border-blue-500">
          <p className="text-sm text-gray-600">Leads Novos</p>
          <p className="text-2xl font-bold text-blue-600">{stats.novo}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg shadow border-l-4 border-green-500">
          <p className="text-sm text-gray-600">Convertidas</p>
          <p className="text-2xl font-bold text-green-600">{stats.convertido}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg shadow border-l-4 border-red-500">
          <p className="text-sm text-gray-600">Descartadas</p>
          <p className="text-2xl font-bold text-red-600">{stats.descartado}</p>
        </div>
      </div>

      {/* FILTRO */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <label className="text-sm font-semibold text-gray-700 block mb-2">Filtrar por Status</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:border-teal-500 focus:outline-none"
        >
          <option value="todos">Todos</option>
          <option value="novo">Novos (não convertidos)</option>
          <option value="convertido">Convertidas para Parceira</option>
          <option value="descartado">Descartadas</option>
        </select>
      </div>

      {/* TABELA */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-600">⏳ Carregando leads...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-gray-600">
            <p className="text-lg mb-2">📭 Nenhum lead neste filtro</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Nome</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Telefone</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Origem</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Data</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-semibold text-gray-900">{lead.nome}</td>
                    <td className="px-6 py-4 text-gray-600">{lead.telefone}</td>
                    <td className="px-6 py-4 text-gray-600 text-sm">{lead.email || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{lead.origem}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        lead.status === 'novo'
                          ? 'bg-blue-100 text-blue-800'
                          : lead.status === 'convertido'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {lead.status === 'novo' ? '🔵 Novo' : lead.status === 'convertido' ? '✅ Convertida' : '❌ Descartada'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 space-y-2">
                      <button
                        onClick={() => openWhatsApp(lead.telefone, lead.nome)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm font-semibold transition block w-full"
                      >
                        💬 WhatsApp
                      </button>
                      {lead.status === 'novo' && (
                        <button
                          onClick={() => convertLead(lead)}
                          disabled={converting === lead.id}
                          className="bg-teal-500 hover:bg-teal-600 disabled:bg-gray-400 text-white px-3 py-1 rounded text-sm font-semibold transition block w-full"
                        >
                          {converting === lead.id ? '⏳ Convertendo...' : '➡️ Converter'}
                        </button>
                      )}
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
          💡 <strong>Como funciona:</strong> Leads do "Quero Começar" chegam aqui com status "Novo". Após confirmar o interesse via WhatsApp, clique "Converter" para movê-la para Parceiras!
        </p>
      </div>
    </div>
  );
}
