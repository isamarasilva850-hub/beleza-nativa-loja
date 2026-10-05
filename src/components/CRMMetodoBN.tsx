"use client";

import { useState, useEffect } from "react";

interface Lead {
  id: string;
  nome: string;
  telefone: string;
  etapa: "abrir" | "conectar" | "diagnosticar" | "divulgacao" | "personalizar" | "apresentar" | "negociar" | "convertido";
  proximaAcao: string;
  proximaData: string;
  notas: string;
}

const ETAPAS = [
  { id: "abrir", nome: "🔍 ABRIR", descricao: "Conseguir atenção", cor: "bg-blue-50 border-blue-200" },
  { id: "conectar", nome: "🤝 CONECTAR", descricao: "Conhecer negócio", cor: "bg-cyan-50 border-cyan-200" },
  { id: "diagnosticar", nome: "📊 DIAGNOSTICAR", descricao: "Entender necessidade", cor: "bg-purple-50 border-purple-200" },
  { id: "divulgacao", nome: "📱 DIVULGAÇÃO", descricao: "Como posta?", cor: "bg-pink-50 border-pink-200" },
  { id: "personalizar", nome: "✨ PERSONALIZAR", descricao: "Conectar à solução", cor: "bg-orange-50 border-orange-200" },
  { id: "apresentar", nome: "🎁 APRESENTAR", descricao: "Mostrar produtos", cor: "bg-green-50 border-green-200" },
  { id: "negociar", nome: "💰 NEGOCIAR", descricao: "Fechar venda", cor: "bg-red-50 border-red-200" },
  { id: "convertido", nome: "🎉 CONVERTIDO", descricao: "Venda realizada!", cor: "bg-emerald-50 border-emerald-200" },
];

const PERGUNTAS_POR_ETAPA = {
  abrir: "Oi, [NOME]! 😊 Aqui é a Isa, consultora da Beleza Nativa. Vi que você trabalha com lingerie. Posso te fazer uma perguntinha?",
  conectar: "Hoje você vende lingerie mais pelo Instagram/WhatsApp ou também tem loja física?",
  diagnosticar: "E o que suas clientes costumam procurar mais: peças básicas, conjuntos ou modelos diferenciados?",
  divulgacao: "Na hora de divulgar as peças, como você faz suas postagens? Você mesma cria ou tem dificuldade?",
  personalizar: "Então deixa eu te contar: na Beleza Nativa você recebe arte e legenda PRONTA com cada peça. Isso faria diferença pra você?",
  apresentar: "Separei alguns modelos pensando no que você me contou. 😊 Quais desses você consegue imaginar vendendo melhor?",
  negociar: "Qual desses modelos você acha que teria mais saída aí? Quer começar com um pedido enxuto ou montar um mix?",
  convertido: "Seu pedido chegou! Quero muito saber o que você achou das peças. 🥰",
};

const LEADS_KEY = "belezanativa_crm_leads";

export default function CRMMetodoBN() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selecionado, setSelecionado] = useState<Lead | null>(null);
  const [mostrarNovo, setMostrarNovo] = useState(false);
  const [formNovo, setFormNovo] = useState({ nome: "", telefone: "" });

  // Carregar leads do localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LEADS_KEY);
      if (saved) setLeads(JSON.parse(saved));
    } catch (e) {
      console.error("Erro ao carregar leads:", e);
    }
  }, []);

  // Salvar leads no localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
    } catch (e) {
      console.error("Erro ao salvar leads:", e);
    }
  }, [leads]);

  const adicionarLead = () => {
    if (!formNovo.nome || !formNovo.telefone) return;

    const novoLead: Lead = {
      id: Date.now().toString(),
      nome: formNovo.nome,
      telefone: formNovo.telefone,
      etapa: "abrir",
      proximaAcao: PERGUNTAS_POR_ETAPA.abrir,
      proximaData: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      notas: "",
    };

    setLeads([novoLead, ...leads]);
    setFormNovo({ nome: "", telefone: "" });
    setMostrarNovo(false);
    setSelecionado(novoLead);
  };

  // Importar leads do site
  const importarLeadsDoSite = () => {
    try {
      const capturedLeads = localStorage.getItem("belezanativa_leads");
      if (!capturedLeads) {
        alert("Nenhum lead capturado do site ainda!");
        return;
      }

      const leadsSite = JSON.parse(capturedLeads);
      const leadsImportados = leadsSite.map((l: any) => ({
        id: l.id,
        nome: l.name,
        telefone: l.phone,
        etapa: "abrir" as const,
        proximaAcao: PERGUNTAS_POR_ETAPA.abrir,
        proximaData: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        notas: "Importado do site",
      }));

      // Evitar duplicatas
      const leadsExistentes = new Set(leads.map((l) => l.telefone));
      const novoLeads = leadsImportados.filter((l) => !leadsExistentes.has(l.telefone));

      if (novoLeads.length === 0) {
        alert("Todos os leads do site já estão no CRM!");
        return;
      }

      setLeads([...novoLeads, ...leads]);
      alert(`${novoLeads.length} lead(s) importado(s) com sucesso!`);
    } catch (e) {
      alert("Erro ao importar leads: " + e);
    }
  };

  const avancarEtapa = (lead: Lead, novaEtapa: Lead["etapa"]) => {
    const leadAtualizado = {
      ...lead,
      etapa: novaEtapa,
      proximaAcao: PERGUNTAS_POR_ETAPA[novaEtapa],
      notas: "",
    };

    setLeads(leads.map((l) => (l.id === lead.id ? leadAtualizado : l)));
    setSelecionado(leadAtualizado);
  };

  const voltarEtapa = (lead: Lead) => {
    const indexAtual = ETAPAS.findIndex((e) => e.id === lead.etapa);
    if (indexAtual > 0) {
      avancarEtapa(lead, ETAPAS[indexAtual - 1].id as any);
    }
  };

  const etapaAtual = ETAPAS.find((e) => e.id === selecionado?.etapa);

  return (
    <div className="grid grid-cols-3 gap-4 h-screen bg-gradient-to-br from-rose-50 to-orange-50 p-4">
      {/* COLUNA 1: LISTA DE LEADS */}
      <div className="col-span-1 bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-pink-400 to-orange-400 text-white p-4">
          <h2 className="font-bold text-lg">📞 Leads Ativos</h2>
          <p className="text-sm opacity-90">{leads.length} prospecções</p>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {leads.map((lead) => {
            const etapa = ETAPAS.find((e) => e.id === lead.etapa);
            return (
              <button
                key={lead.id}
                onClick={() => setSelecionado(lead)}
                className={`w-full text-left p-3 rounded-xl border-2 transition-all ${
                  selecionado?.id === lead.id
                    ? "border-pink-400 bg-pink-50 shadow-md"
                    : "border-gray-200 hover:border-pink-200 hover:bg-pink-50"
                }`}
              >
                <div className="font-bold text-gray-800">{lead.nome}</div>
                <div className="text-xs text-gray-600 mt-1">{etapa?.nome}</div>
                <div className="text-xs text-gray-500 mt-1">📅 {lead.proximaData}</div>
              </button>
            );
          })}
        </div>

        <div className="m-3 space-y-2">
          <button
            onClick={() => setMostrarNovo(!mostrarNovo)}
            className="w-full bg-gradient-to-r from-pink-400 to-orange-400 text-white font-bold py-3 rounded-xl hover:shadow-lg transition-all"
          >
            ➕ Novo Lead
          </button>
          <button
            onClick={importarLeadsDoSite}
            className="w-full bg-gradient-to-r from-blue-400 to-cyan-400 text-white font-bold py-2 rounded-xl hover:shadow-lg transition-all text-sm"
          >
            📥 Importar do Site
          </button>
        </div>

        {mostrarNovo && (
          <div className="p-3 border-t-2 border-pink-200 bg-pink-50">
            <input
              type="text"
              placeholder="Nome"
              value={formNovo.nome}
              onChange={(e) => setFormNovo({ ...formNovo, nome: e.target.value })}
              className="w-full p-2 mb-2 border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-400"
            />
            <input
              type="text"
              placeholder="WhatsApp"
              value={formNovo.telefone}
              onChange={(e) => setFormNovo({ ...formNovo, telefone: e.target.value })}
              className="w-full p-2 mb-2 border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-400"
            />
            <button
              onClick={adicionarLead}
              className="w-full bg-green-400 text-white font-bold py-2 rounded-lg hover:bg-green-500"
            >
              ✅ Adicionar
            </button>
          </div>
        )}
      </div>

      {/* COLUNA 2: VISUAL DO FUNIL DE VENDAS */}
      <div className="col-span-1 bg-white rounded-2xl shadow-lg p-4 overflow-y-auto">
        <h3 className="font-bold text-lg mb-3">🌸 Método Beleza Nativa</h3>

        <div className="space-y-2">
          {ETAPAS.map((etapa, idx) => {
            const isAtual = selecionado?.etapa === etapa.id;
            const isConcluido = selecionado && ETAPAS.findIndex((e) => e.id === selecionado.etapa) > idx;

            return (
              <div
                key={etapa.id}
                className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                  isAtual ? "border-pink-400 bg-pink-100 shadow-md scale-105" : isConcluido ? "border-green-300 bg-green-50" : "border-gray-200 bg-gray-50 opacity-50"
                } ${selecionado ? "hover:shadow-md" : ""}`}
                onClick={() => selecionado && avancarEtapa(selecionado, etapa.id as any)}
              >
                <div className="font-bold text-sm">{etapa.nome}</div>
                <div className="text-xs text-gray-600">{etapa.descricao}</div>
                {isAtual && (
                  <div className="text-xs mt-2 p-2 bg-pink-200 text-pink-900 rounded font-semibold">
                    👉 Etapa atual
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* COLUNA 3: DETALHES E AÇÕES */}
      <div className="col-span-1 bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col">
        {selecionado ? (
          <>
            <div className={`${etapaAtual?.cor} border-b-2 p-4`}>
              <h2 className="font-bold text-xl text-gray-800">{selecionado.nome}</h2>
              <p className="text-sm text-gray-600 mt-1">📱 {selecionado.telefone}</p>
              <p className="text-sm text-gray-600 mt-2">Etapa: {etapaAtual?.nome}</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* PERGUNTA SUGERIDA */}
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-3">
                <div className="text-xs font-bold text-yellow-900 mb-1">💡 PERGUNTA PARA FAZER:</div>
                <div className="text-sm font-semibold text-yellow-900 leading-relaxed">
                  "{selecionado.proximaAcao}"
                </div>
              </div>

              {/* NOTAS */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">📝 Anotações:</label>
                <textarea
                  value={selecionado.notas}
                  onChange={(e) => {
                    const updated = { ...selecionado, notas: e.target.value };
                    setSelecionado(updated);
                    setLeads(leads.map((l) => (l.id === selecionado.id ? updated : l)));
                  }}
                  className="w-full p-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-pink-400 text-sm h-20 resize-none"
                  placeholder="Anotar o que ela respondeu..."
                />
              </div>

              {/* PRÓXIMA AÇÃO */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">📅 Próximo contato:</label>
                <input
                  type="date"
                  value={selecionado.proximaData}
                  onChange={(e) => {
                    const updated = { ...selecionado, proximaData: e.target.value };
                    setSelecionado(updated);
                    setLeads(leads.map((l) => (l.id === selecionado.id ? updated : l)));
                  }}
                  className="w-full p-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-pink-400 text-sm"
                />
              </div>
            </div>

            {/* BOTÕES */}
            <div className="p-4 border-t-2 border-gray-200 grid grid-cols-2 gap-2">
              <button
                onClick={() => voltarEtapa(selecionado)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 rounded-lg transition-all"
              >
                ⬅️ Voltar
              </button>
              <button
                onClick={() => {
                  const proximaIdx = Math.min(
                    ETAPAS.findIndex((e) => e.id === selecionado.etapa) + 1,
                    ETAPAS.length - 1
                  );
                  avancarEtapa(selecionado, ETAPAS[proximaIdx].id as any);
                }}
                className="bg-gradient-to-r from-green-400 to-emerald-400 text-white font-bold py-2 rounded-lg hover:shadow-lg transition-all"
              >
                ✅ Avançar
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-center p-4">
            <div>
              <p className="text-2xl mb-2">👋</p>
              <p className="text-gray-600 font-semibold">Selecione um lead ou crie um novo</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
