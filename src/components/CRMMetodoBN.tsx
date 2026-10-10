"use client";

import { useState, useEffect, useRef } from "react";

interface Message {
  id: string;
  timestamp: string;
  tipo: "enviada" | "recebida";
  texto: string;
}

interface Lead {
  id: string;
  nome: string;
  telefone: string;
  etapa: "abrir" | "conectar" | "diagnosticar" | "divulgacao" | "personalizar" | "apresentar" | "negociar" | "convertido";
  proximaAcao: string;
  proximaData: string;
  notas: string;
  mensagens: Message[];
  ultimaRespostaDato: string | null;
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
const TEMPLATES_KEY = "belezanativa_crm_templates";

export default function CRMMetodoBN() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selecionado, setSelecionado] = useState<Lead | null>(null);
  const [mostrarNovo, setMostrarNovo] = useState(false);
  const [formNovo, setFormNovo] = useState({ nome: "", telefone: "" });
  const [templates, setTemplates] = useState<Record<string, string>>({});
  const [mostrarTemplates, setMostrarTemplates] = useState(false);
  const [templateEdicao, setTemplateEdicao] = useState<Record<string, string>>({});
  const [leadsHoje, setLeadsHoje] = useState<Lead[]>([]);
  const [notificacaoEnviada, setNotificacaoEnviada] = useState(false);

  // Carregar leads e templates do localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LEADS_KEY);
      if (saved) setLeads(JSON.parse(saved));

      const savedTemplates = localStorage.getItem(TEMPLATES_KEY);
      if (savedTemplates) {
        const parsed = JSON.parse(savedTemplates);
        setTemplates(parsed);
        setTemplateEdicao(parsed);
      } else {
        setTemplateEdicao({...PERGUNTAS_POR_ETAPA});
      }
    } catch (e) {
      console.error("Erro ao carregar dados:", e);
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

  // Leads e anotações no banco, para aparecerem em qualquer computador ou navegador
  const crmPronto = useRef(false);

  useEffect(() => {
    let cancelado = false;
    fetch("/api/crm-dados?chave=leads")
      .then((r) => r.json())
      .then((dados) => {
        if (cancelado) return;
        const doServidor = Array.isArray(dados.valor) ? dados.valor : [];
        if (doServidor.length > 0) {
          setLeads(doServidor);
        } else {
          const doNavegador = JSON.parse(localStorage.getItem(LEADS_KEY) || "[]");
          if (doNavegador.length > 0) {
            fetch("/api/crm-dados", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ chave: "leads", valor: doNavegador }),
            });
          }
        }
        crmPronto.current = true;
      })
      .catch((err) => console.error("Erro ao carregar leads do banco", err));
    return () => {
      cancelado = true;
    };
  }, []);

  useEffect(() => {
    if (!crmPronto.current) return;
    const timer = setTimeout(() => {
      fetch("/api/crm-dados", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chave: "leads", valor: leads }),
      }).catch((err) => console.error("Erro ao salvar leads no banco", err));
    }, 800);
    return () => clearTimeout(timer);
  }, [leads]);

  // Salvar templates no localStorage
  useEffect(() => {
    try {
      if (Object.keys(templates).length > 0) {
        localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
      }
    } catch (e) {
      console.error("Erro ao salvar templates:", e);
    }
  }, [templates]);

  // Sincronizar em tempo real com outras abas (Feature #5)
  useEffect(() => {
    console.log("✅ Feature #5: Listener de storage configurado");

    const handleStorageChange = (event: StorageEvent) => {
      console.log("📡 Storage event recebido:", event.key);

      if (event.key === LEADS_KEY && event.newValue) {
        try {
          const novosDados = JSON.parse(event.newValue);
          setLeads(novosDados);
          console.log("✅ Leads sincronizados de outra aba", novosDados.length);
        } catch (e) {
          console.error("Erro ao sincronizar leads:", e);
        }
      }
      if (event.key === TEMPLATES_KEY && event.newValue) {
        try {
          const novosTemplates = JSON.parse(event.newValue);
          setTemplates(novosTemplates);
          setTemplateEdicao(novosTemplates);
          console.log("✅ Templates sincronizados de outra aba");
        } catch (e) {
          console.error("Erro ao sincronizar templates:", e);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Monitorar leads com ação hoje
  useEffect(() => {
    const hoje = new Date().toISOString().split("T")[0];
    const comAcaoHoje = leads.filter((l) => l.proximaData === hoje && l.etapa !== "convertido");
    setLeadsHoje(comAcaoHoje);

    // Enviar notificação do browser uma vez por dia
    if (comAcaoHoje.length > 0 && !notificacaoEnviada && typeof Notification !== "undefined" && Notification.permission === "granted") {
      new Notification("🔔 Beleza Nativa - Ação de Hoje!", {
        body: `Você tem ${comAcaoHoje.length} lead(s) para contatar hoje!`,
        icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='45' fill='%237BC9C2'/><text x='50' y='60' font-size='50' fill='white' text-anchor='middle'>📞</text></svg>",
      });
      setNotificacaoEnviada(true);
    }
  }, [leads, notificacaoEnviada]);

  const registrarMensagem = (leadId: string, tipo: "enviada" | "recebida", texto: string) => {
    setLeads(
      leads.map((lead) =>
        lead.id === leadId
          ? {
              ...lead,
              mensagens: [
                ...lead.mensagens,
                {
                  id: Date.now().toString(),
                  timestamp: new Date().toISOString(),
                  tipo,
                  texto,
                },
              ],
            }
          : lead
      )
    );
  };

  const salvarTemplates = () => {
    setTemplates({...templateEdicao});
    setMostrarTemplates(false);
    alert("Templates salvos com sucesso!");
  };

  const obterTemplate = (etapa: string) => {
    return templates[etapa] || PERGUNTAS_POR_ETAPA[etapa as keyof typeof PERGUNTAS_POR_ETAPA] || "";
  };

  const habilitarNotificacoes = () => {
    if (typeof Notification !== "undefined" && Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          alert("✅ Notificações habilitadas! Você receberá alertas de leads para contatar.");
          setNotificacaoEnviada(false);
        }
      });
    }
  };

  const marcarRespostaRecebida = (leadId: string, textoResposta: string = "") => {
    const dataAgora = new Date().toLocaleString("pt-BR");
    registrarMensagem(leadId, "recebida", textoResposta || `Resposta recebida em ${dataAgora}`);

    setLeads(
      leads.map((lead) =>
        lead.id === leadId
          ? { ...lead, ultimaRespostaDato: dataAgora }
          : lead
      )
    );
  };

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
      mensagens: [],
      ultimaRespostaDato: null,
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
        mensagens: [],
        ultimaRespostaDato: null,
      }));

      // Evitar duplicatas
      const leadsExistentes = new Set(leads.map((l: any) => l.telefone));
      const novoLeads = leadsImportados.filter((l: any) => !leadsExistentes.has(l.telefone));

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

  // Calcular estatísticas
  const stats = {
    total: leads.length,
    convertidos: leads.filter((l) => l.etapa === "convertido").length,
    taxaConversao: leads.length > 0 ? ((leads.filter((l) => l.etapa === "convertido").length / leads.length) * 100).toFixed(1) : "0",
    porEtapa: ETAPAS.map((e) => ({
      etapa: e.id,
      nome: e.nome,
      count: leads.filter((l) => l.etapa === e.id).length,
    })),
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-rose-50 to-orange-50 p-4 gap-4">
      {/* MODAL DE TEMPLATES */}
      {mostrarTemplates && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-pink-400 to-orange-400 text-white p-4 flex items-center justify-between">
              <h2 className="font-bold text-lg">✏️ Editar Templates de Mensagens</h2>
              <button onClick={() => setMostrarTemplates(false)} className="text-2xl hover:scale-110">✕</button>
            </div>

            <div className="p-4 space-y-4">
              {ETAPAS.map((etapa) => (
                <div key={etapa.id} className="border-2 border-gray-200 rounded-xl p-4">
                  <label className="block font-bold text-gray-800 mb-2">{etapa.nome}</label>
                  <textarea
                    value={templateEdicao[etapa.id] || ""}
                    onChange={(e) => setTemplateEdicao({...templateEdicao, [etapa.id]: e.target.value})}
                    className="w-full p-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-pink-400 text-sm h-20 resize-none"
                    placeholder={PERGUNTAS_POR_ETAPA[etapa.id as keyof typeof PERGUNTAS_POR_ETAPA]}
                  />
                  <p className="text-xs text-gray-500 mt-1">Deixe em branco para usar o padrão</p>
                </div>
              ))}
            </div>

            <div className="sticky bottom-0 bg-gray-50 p-4 border-t-2 border-gray-200 flex gap-2">
              <button
                onClick={() => setMostrarTemplates(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 rounded-lg"
              >
                ❌ Cancelar
              </button>
              <button
                onClick={salvarTemplates}
                className="flex-1 bg-gradient-to-r from-green-400 to-emerald-400 text-white font-bold py-2 rounded-lg hover:shadow-lg"
              >
                ✅ Salvar Templates
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BANNER DE AÇÃO HOJE */}
      {leadsHoje.length > 0 && (
        <div className="bg-gradient-to-r from-red-400 to-orange-400 text-white rounded-2xl shadow-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold">🔔 {leadsHoje.length} Lead{leadsHoje.length !== 1 ? "s" : ""} para Ação Hoje!</p>
              <p className="text-sm opacity-90 mt-1">
                {leadsHoje.map((l) => l.nome).join(", ")}
              </p>
            </div>
            <button
              onClick={habilitarNotificacoes}
              className="bg-white text-orange-500 font-bold px-4 py-2 rounded-lg hover:shadow-lg transition-all text-sm whitespace-nowrap"
            >
              🔔 Ativar Lembretes
            </button>
          </div>
        </div>
      )}

      {/* HEADER COM ESTATÍSTICAS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl shadow p-3 border-l-4 border-pink-500">
          <p className="text-xs text-gray-600 font-semibold">Total de Leads</p>
          <p className="text-2xl font-bold text-pink-600">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-3 border-l-4 border-green-500">
          <p className="text-xs text-gray-600 font-semibold">Convertidos</p>
          <p className="text-2xl font-bold text-green-600">{stats.convertidos}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-3 border-l-4 border-blue-500">
          <p className="text-xs text-gray-600 font-semibold">Taxa de Conversão</p>
          <p className="text-2xl font-bold text-blue-600">{stats.taxaConversao}%</p>
        </div>
        <div className="bg-white rounded-xl shadow p-3 overflow-x-auto">
          <p className="text-xs text-gray-600 font-semibold mb-2">Por Etapa</p>
          <div className="flex gap-1 text-[10px] font-semibold">
            {stats.porEtapa.slice(0, 4).map((s) => (
              <div key={s.etapa} className="bg-purple-100 text-purple-700 px-2 py-1 rounded">
                {s.count}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <div className="grid grid-cols-3 gap-4 flex-1 min-h-0">
      {/* COLUNA 1: LISTA DE LEADS */}
      <div className="col-span-1 bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-pink-400 to-orange-400 text-white p-4">
          <h2 className="font-bold text-lg">📞 Leads Ativos</h2>
          <p className="text-sm opacity-90">{leads.length} prospecções</p>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {leads.map((lead) => {
            const etapa = ETAPAS.find((e) => e.id === lead.etapa);
            const éHoje = lead.proximaData === new Date().toISOString().split("T")[0];
            return (
              <button
                key={lead.id}
                onClick={() => setSelecionado(lead)}
                className={`w-full text-left p-3 rounded-xl border-2 transition-all ${
                  selecionado?.id === lead.id
                    ? "border-pink-400 bg-pink-50 shadow-md"
                    : éHoje
                    ? "border-red-400 bg-red-50 hover:border-red-300 shadow-md"
                    : "border-gray-200 hover:border-pink-200 hover:bg-pink-50"
                }`}
              >
                <div className="font-bold text-gray-800 flex items-center gap-2">
                  {lead.nome}
                  {éHoje && <span className="text-xs bg-red-400 text-white px-2 py-0.5 rounded-full">HOJE</span>}
                </div>
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
          <button
            onClick={() => setMostrarTemplates(true)}
            className="w-full bg-gradient-to-r from-purple-400 to-violet-400 text-white font-bold py-2 rounded-xl hover:shadow-lg transition-all text-sm"
          >
            ✏️ Editar Templates
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

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {/* PERGUNTA SUGERIDA */}
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-2">
                <div className="text-xs font-bold text-yellow-900 mb-1">💡 PERGUNTA PARA FAZER:</div>
                <div className="text-xs font-semibold text-yellow-900 leading-relaxed">
                  "{selecionado.proximaAcao}"
                </div>
              </div>

              {/* HISTÓRICO DE MENSAGENS */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-2">
                <div className="text-xs font-bold text-blue-900 mb-2">💬 Histórico ({selecionado.mensagens.length})</div>
                <div className="space-y-1 max-h-24 overflow-y-auto">
                  {selecionado.mensagens.length === 0 ? (
                    <p className="text-xs text-blue-700 italic">Nenhuma mensagem enviada ainda</p>
                  ) : (
                    selecionado.mensagens.map((msg) => (
                      <div key={msg.id} className={`text-xs p-1.5 rounded ${msg.tipo === "enviada" ? "bg-green-100 text-green-900" : "bg-blue-100 text-blue-900"}`}>
                        <div className="font-semibold text-[10px]">{msg.tipo === "enviada" ? "📤 Enviada" : "📥 Recebida"}</div>
                        <div className="line-clamp-2">{msg.texto}</div>
                        <div className="text-[9px] opacity-70">{new Date(msg.timestamp).toLocaleString("pt-BR")}</div>
                      </div>
                    ))
                  )}
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
                  className="w-full p-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-pink-400 text-sm h-16 resize-none"
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
            <div className="p-4 border-t-2 border-gray-200 space-y-2">
              <div className="grid grid-cols-2 gap-2">
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
              <button
                onClick={() => {
                  const templateMsg = obterTemplate(selecionado.etapa);
                  const msg = `Oi ${selecionado.nome}! 👋\n\n${templateMsg}\n\nAgradeço qualquer resposta! 😊`;
                  const url = `https://wa.me/${selecionado.telefone.replace(/\D/g, "")}?text=${encodeURIComponent(msg)}`;
                  registrarMensagem(selecionado.id, "enviada", msg);
                  window.open(url, "_blank");
                }}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                </svg>
                💬 Enviar via WhatsApp
              </button>

              {selecionado.ultimaRespostaDato ? (
                <div className="w-full bg-blue-100 text-blue-900 font-bold py-2 rounded-lg text-center text-sm">
                  ✅ Resposta Recebida em {selecionado.ultimaRespostaDato}
                </div>
              ) : (
                <button
                  onClick={() => marcarRespostaRecebida(selecionado.id)}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-lg transition-all"
                >
                  📥 Marcar Resposta Recebida
                </button>
              )}
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
    </div>
  );
}
