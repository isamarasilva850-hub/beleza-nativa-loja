"use client";

import { useState, useEffect } from "react";
import { gerarMensagem } from "@/lib/messageGenerator";

interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  tipo: string;
  totalGasto?: number;
  compras?: number;
  dataCadastro?: string;
}

interface Action {
  id: string;
  cliente_id: string;
  tipo: string;
  descricao: string;
  data_agendada: string;
  status: string;
  mensagem_sugerida: string;
}

export default function CRMActions({ clientes }: { clientes: Cliente[] }) {
  const [actions, setActions] = useState<Action[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState<"hoje" | "proximos" | "atraso">("hoje");
  const [formData, setFormData] = useState({
    clienteId: "",
    tipo: "whatsapp",
    descricao: "",
    dataAgendada: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    loadActions();
  }, []);

  const loadActions = async () => {
    try {
      setLoading(true);
      const today = new Date().toISOString().split("T")[0];
      const response = await fetch(`/api/crm/actions?status=pendente&dataAte=${today}`);
      if (response.ok) {
        const data = await response.json();
        setActions(data);
      }
    } catch (err) {
      console.error("Erro ao carregar ações:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clienteId) {
      alert("Selecione um cliente");
      return;
    }

    try {
      const cliente = clientes.find((c) => c.id === formData.clienteId);
      if (!cliente) return;

      const mensagem = gerarMensagem(cliente, formData.tipo);

      const response = await fetch("/api/crm/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clienteId: formData.clienteId,
          tipo: formData.tipo,
          descricao: formData.descricao,
          dataAgendada: formData.dataAgendada,
          mensagemSugerida: mensagem,
        }),
      });

      if (response.ok) {
        alert("✅ Ação criada!");
        setFormData({
          clienteId: "",
          tipo: "whatsapp",
          descricao: "",
          dataAgendada: new Date().toISOString().split("T")[0],
        });
        setShowForm(false);
        loadActions();
      }
    } catch (err) {
      console.error("Erro ao criar ação:", err);
      alert("❌ Erro ao criar ação");
    }
  };

  const markAsComplete = async (actionId: string) => {
    try {
      await fetch("/api/crm/actions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: actionId, status: "concluido" }),
      });
      loadActions();
    } catch (err) {
      console.error("Erro:", err);
    }
  };

  const getStatusColor = (date: string) => {
    const today = new Date().toISOString().split("T")[0];
    if (date < today) return "bg-red-100 border-red-300"; // Atraso
    if (date === today) return "bg-orange-100 border-orange-300"; // Hoje
    return "bg-blue-100 border-blue-300"; // Futuro
  };

  const getStatusLabel = (date: string) => {
    const today = new Date().toISOString().split("T")[0];
    if (date < today) return "🚨 ATRASO";
    if (date === today) return "🔴 HOJE";
    return "📅 PRÓXIMOS";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">📋 Ações e Lembretes</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-bold transition-colors"
        >
          + Adicionar Ação
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-300 rounded-lg p-6 space-y-4">
          <h3 className="font-bold text-gray-800">Criar Nova Ação</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                value={formData.clienteId}
                onChange={(e) => setFormData({ ...formData, clienteId: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="">Selecione cliente</option>
                {clientes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome} ({c.email})
                  </option>
                ))}
              </select>

              <select
                value={formData.tipo}
                onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="whatsapp">💬 WhatsApp</option>
                <option value="email">📧 Email</option>
                <option value="ligar">📞 Ligar</option>
                <option value="follow-up">🔄 Follow-up</option>
                <option value="proposta">📄 Proposta</option>
              </select>

              <input
                type="date"
                value={formData.dataAgendada}
                onChange={(e) => setFormData({ ...formData, dataAgendada: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />

              <textarea
                placeholder="Descrição (opcional)"
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                rows={2}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg transition-colors"
            >
              ✅ Criar Ação
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <p className="text-gray-500">Carregando...</p>
      ) : actions.length === 0 ? (
        <div className="bg-green-100 border border-green-300 rounded-lg p-6 text-center">
          <p className="text-green-800 font-bold">✅ Tudo em dia! Nenhuma ação pendente.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {actions.map((action) => {
            const cliente = clientes.find((c) => c.id === action.cliente_id);
            return (
              <div key={action.id} className={`border-l-4 rounded-lg p-4 ${getStatusColor(action.data_agendada)}`}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-bold text-gray-800">{cliente?.nome}</p>
                    <p className="text-sm text-gray-600">{getStatusLabel(action.data_agendada)} - {action.data_agendada}</p>
                    <p className="text-sm font-semibold text-gray-700 mt-1">
                      {action.tipo === "whatsapp" && "💬"}
                      {action.tipo === "email" && "📧"}
                      {action.tipo === "ligar" && "📞"}
                      {action.tipo === "follow-up" && "🔄"}
                      {action.tipo === "proposta" && "📄"} {action.tipo.toUpperCase()}
                    </p>
                  </div>
                  <button
                    onClick={() => markAsComplete(action.id)}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm font-bold transition-colors"
                  >
                    ✓ Feito
                  </button>
                </div>

                {action.mensagem_sugerida && (
                  <div className="bg-white bg-opacity-70 rounded p-3 mt-3 border border-gray-300">
                    <p className="text-xs font-bold text-gray-700 mb-2">💡 Mensagem sugerida:</p>
                    <p className="text-sm text-gray-700 mb-2">{action.mensagem_sugerida}</p>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(action.mensagem_sugerida);
                        alert("✅ Mensagem copiada!");
                      }}
                      className="text-blue-600 hover:text-blue-800 text-xs font-bold"
                    >
                      📋 Copiar mensagem
                    </button>
                  </div>
                )}

                {action.descricao && <p className="text-sm text-gray-600 mt-2">📝 {action.descricao}</p>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
