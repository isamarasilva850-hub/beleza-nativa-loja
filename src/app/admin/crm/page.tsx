"use client";

import { useState, useEffect } from "react";

interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  tipo: "varejo" | "revenda" | "atacado";
  status: "ativo" | "inativo" | "suspenso";
  dataCadastro: string;
  ultimaCompra?: string;
  totalGasto: number;
  compras: number;
  comissao?: number;
}

interface Lead {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  origem: "whatsapp" | "instagram" | "indicacao" | "site" | "outro";
  status: "novo" | "contato" | "proposta" | "negociacao" | "convertido" | "perdido";
  valor?: number;
  dataCadastro: string;
  proximoContato?: string;
  notas: string;
  vendedor: string;
}

interface Atividade {
  id: string;
  tipo: "chamada" | "email" | "mensagem" | "reuniao" | "visita";
  clienteId: string;
  clienteNome: string;
  descricao: string;
  data: string;
  usuario: string;
  resultado?: string;
}

interface Proposta {
  id: string;
  numero: string;
  clienteId: string;
  clienteNome: string;
  valor: number;
  status: "rascunho" | "enviada" | "visualizada" | "aceita" | "rejeitada";
  dataEnvio: string;
  dataVencimento: string;
  itens: number;
}

const statusClienteColors: Record<string, string> = {
  ativo: "bg-green-100 text-green-700",
  inativo: "bg-gray-100 text-gray-700",
  suspenso: "bg-red-100 text-red-700",
};

const statusLeadColors: Record<string, string> = {
  novo: "bg-blue-100 text-blue-700",
  contato: "bg-cyan-100 text-cyan-700",
  proposta: "bg-purple-100 text-purple-700",
  negociacao: "bg-orange-100 text-orange-700",
  convertido: "bg-green-100 text-green-700",
  perdido: "bg-red-100 text-red-700",
};

const statusLeadLabels: Record<string, string> = {
  novo: "Novo",
  contato: "Em Contato",
  proposta: "Proposta",
  negociacao: "Negociação",
  convertido: "Convertido",
  perdido: "Perdido",
};

export default function CRM() {
  const [tab, setTab] = useState<"dashboard" | "clientes" | "leads" | "atividades" | "propostas" | "relatorios">("dashboard");
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [propostas, setPropostas] = useState<Proposta[]>([]);

  const [showNovoCliente, setShowNovoCliente] = useState(false);
  const [showNovoLead, setShowNovoLead] = useState(false);
  const [showNovaAtividade, setShowNovaAtividade] = useState(false);
  const [showNovaProposta, setShowNovaProposta] = useState(false);

  const [formCliente, setFormCliente] = useState({ nome: "", email: "", telefone: "", tipo: "varejo", comissao: 0 });
  const [formLead, setFormLead] = useState({ nome: "", email: "", telefone: "", origem: "whatsapp", valor: 0, notas: "", vendedor: "Isamara" });
  const [formAtividade, setFormAtividade] = useState({ tipo: "chamada", clienteId: "", descricao: "", usuario: "Isamara" });
  const [formProposta, setFormProposta] = useState({ numero: "", clienteId: "", valor: 0, itens: 0 });

  const [searchClientes, setSearchClientes] = useState("");
  const [searchLeads, setSearchLeads] = useState("");
  const [filterStatusLead, setFilterStatusLead] = useState("todos");
  const [filterTipoCliente, setFilterTipoCliente] = useState("todos");

  useEffect(() => {
    const stored = localStorage.getItem("belezanativa_crm_clientes");
    if (stored) setClientes(JSON.parse(stored));
    else {
      const demo: Cliente[] = [
        { id: "1", nome: "Rose Shop", email: "rose@shop.com", telefone: "(35) 99999-0001", tipo: "revenda", status: "ativo", dataCadastro: "2024-01-15", ultimaCompra: "2024-09-20", totalGasto: 15000, compras: 28, comissao: 5 },
        { id: "2", nome: "Dona Bonita", email: "donabonita@email.com", telefone: "(35) 99999-0002", tipo: "revenda", status: "ativo", dataCadastro: "2024-03-10", ultimaCompra: "2024-09-18", totalGasto: 8500, compras: 15, comissao: 5 },
      ];
      setClientes(demo);
      localStorage.setItem("belezanativa_crm_clientes", JSON.stringify(demo));
    }

    const storedLeads = localStorage.getItem("belezanativa_crm_leads");
    if (storedLeads) setLeads(JSON.parse(storedLeads));
    else {
      const demoLeads: Lead[] = [
        { id: "1", nome: "The Store", email: "thestore@shop.com", telefone: "(35) 99999-0003", origem: "whatsapp", status: "negociacao", valor: 5000, dataCadastro: "2024-09-16", proximoContato: "2024-09-25", notas: "Interesse em pacote atacado", vendedor: "Isamara" },
      ];
      setLeads(demoLeads);
      localStorage.setItem("belezanativa_crm_leads", JSON.stringify(demoLeads));
    }

    const storedAtividades = localStorage.getItem("belezanativa_crm_atividades");
    if (storedAtividades) setAtividades(JSON.parse(storedAtividades));
    else {
      const demoAtividades: Atividade[] = [
        { id: "1", tipo: "chamada", clienteId: "1", clienteNome: "Rose Shop", descricao: "Confirmação de pedido", data: "2024-09-20", usuario: "Isamara", resultado: "Pedido confirmado" },
      ];
      setAtividades(demoAtividades);
      localStorage.setItem("belezanativa_crm_atividades", JSON.stringify(demoAtividades));
    }

    const storedPropostas = localStorage.getItem("belezanativa_crm_propostas");
    if (storedPropostas) setPropostas(JSON.parse(storedPropostas));
  }, []);

  const saveClientes = (updated: Cliente[]) => {
    setClientes(updated);
    localStorage.setItem("belezanativa_crm_clientes", JSON.stringify(updated));
  };

  const saveLeads = (updated: Lead[]) => {
    setLeads(updated);
    localStorage.setItem("belezanativa_crm_leads", JSON.stringify(updated));
  };

  const addCliente = () => {
    if (!formCliente.nome) return;
    const novo: Cliente = {
      id: Date.now().toString(),
      nome: formCliente.nome,
      email: formCliente.email,
      telefone: formCliente.telefone,
      tipo: formCliente.tipo as "varejo" | "revenda" | "atacado",
      comissao: formCliente.comissao || 0,
      status: "ativo",
      dataCadastro: new Date().toISOString().split("T")[0],
      totalGasto: 0,
      compras: 0,
    };
    saveClientes([novo, ...clientes]);
    setFormCliente({ nome: "", email: "", telefone: "", tipo: "varejo", comissao: 0 });
    setShowNovoCliente(false);
  };

  const addLead = () => {
    if (!formLead.nome) return;
    const novo: Lead = {
      id: Date.now().toString(),
      nome: formLead.nome,
      email: formLead.email,
      telefone: formLead.telefone,
      origem: formLead.origem as "whatsapp" | "instagram" | "indicacao" | "site" | "outro",
      valor: formLead.valor,
      notas: formLead.notas,
      vendedor: formLead.vendedor,
      status: "novo",
      dataCadastro: new Date().toISOString().split("T")[0],
    };
    saveLeads([novo, ...leads]);
    setFormLead({ nome: "", email: "", telefone: "", origem: "whatsapp", valor: 0, notas: "", vendedor: "Isamara" });
    setShowNovoLead(false);
  };

  const addAtividade = () => {
    if (!formAtividade.descricao || !formAtividade.clienteId) return;
    const novo: Atividade = {
      id: Date.now().toString(),
      tipo: formAtividade.tipo as "chamada" | "email" | "mensagem" | "reuniao" | "visita",
      clienteId: formAtividade.clienteId,
      clienteNome: clientes.find(c => c.id === formAtividade.clienteId)?.nome || "",
      descricao: formAtividade.descricao,
      data: new Date().toISOString().split("T")[0],
      usuario: formAtividade.usuario,
    };
    setAtividades([novo, ...atividades]);
    setFormAtividade({ tipo: "chamada", clienteId: "", descricao: "", usuario: "Isamara" });
    setShowNovaAtividade(false);
  };

  const updateLeadStatus = (id: string, status: Lead["status"]) => {
    saveLeads(leads.map(l => l.id === id ? { ...l, status } : l));
  };

  const updateClienteStatus = (id: string, status: Cliente["status"]) => {
    saveClientes(clientes.map(c => c.id === id ? { ...c, status } : c));
  };

  // KPIs
  const totalClientes = clientes.length;
  const totalLeads = leads.length;
  const leadsEmNegociacao = leads.filter(l => l.status === "negociacao").length;
  const valorEmNegociacao = leads.filter(l => l.status === "negociacao").reduce((sum, l) => sum + (l.valor || 0), 0);
  const leadsConvertidos = leads.filter(l => l.status === "convertido").length;
  const taxaConversao = totalLeads > 0 ? ((leadsConvertidos / totalLeads) * 100).toFixed(1) : "0";
  const totalRecebido = clientes.reduce((sum, c) => sum + c.totalGasto, 0);

  // Dados para gráficos
  const leadsPorStatus = [
    { name: "Novo", value: leads.filter(l => l.status === "novo").length },
    { name: "Contato", value: leads.filter(l => l.status === "contato").length },
    { name: "Proposta", value: leads.filter(l => l.status === "proposta").length },
    { name: "Negociação", value: leads.filter(l => l.status === "negociacao").length },
    { name: "Convertido", value: leads.filter(l => l.status === "convertido").length },
    { name: "Perdido", value: leads.filter(l => l.status === "perdido").length },
  ];

  const clientesPorTipo = [
    { name: "Varejo", value: clientes.filter(c => c.tipo === "varejo").length },
    { name: "Revenda", value: clientes.filter(c => c.tipo === "revenda").length },
    { name: "Atacado", value: clientes.filter(c => c.tipo === "atacado").length },
  ];

  const cores = ["#7BC9C2", "#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8"];

  // Filtros
  const clientesFiltrados = clientes.filter(c =>
    (filterTipoCliente === "todos" || c.tipo === filterTipoCliente) &&
    (c.nome.toLowerCase().includes(searchClientes.toLowerCase()) ||
     c.email.toLowerCase().includes(searchClientes.toLowerCase()) ||
     c.telefone.includes(searchClientes))
  );

  const leadsFiltrados = leads.filter(l =>
    (filterStatusLead === "todos" || l.status === filterStatusLead) &&
    (l.nome.toLowerCase().includes(searchLeads.toLowerCase()) ||
     l.email.toLowerCase().includes(searchLeads.toLowerCase()) ||
     l.telefone.includes(searchLeads))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">📊 CRM Completo</h1>
        <p className="text-sm text-gray-500">Gerencie clientes, leads e relacionamentos</p>
      </div>

      {/* Abas */}
      <div className="flex gap-2 border-b border-gray-200 overflow-x-auto">
        {["dashboard", "clientes", "leads", "atividades", "propostas", "relatorios"].map(t => (
          <button
            key={t}
            onClick={() => setTab(t as any)}
            className={`px-4 py-3 font-semibold text-sm whitespace-nowrap border-b-2 transition-colors ${
              tab === t ? "border-[#7BC9C2] text-[#7BC9C2]" : "border-transparent text-gray-600 hover:text-gray-800"
            }`}
          >
            {t === "dashboard" && "📊 Dashboard"}
            {t === "clientes" && "👥 Clientes"}
            {t === "leads" && "🎯 Leads"}
            {t === "atividades" && "📋 Atividades"}
            {t === "propostas" && "📄 Propostas"}
            {t === "relatorios" && "📈 Relatórios"}
          </button>
        ))}
      </div>

      {/* DASHBOARD */}
      {tab === "dashboard" && (
        <div className="space-y-6">
          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Total de Clientes</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">{totalClientes}</p>
                </div>
                <div className="text-4xl">👥</div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Total de Leads</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">{totalLeads}</p>
                </div>
                <div className="text-4xl">🎯</div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Em Negociação</p>
                  <p className="text-3xl font-bold text-orange-600 mt-1">{leadsEmNegociacao}</p>
                  <p className="text-xs text-gray-400 mt-1">R$ {(valorEmNegociacao / 1000).toFixed(1)}k</p>
                </div>
                <div className="text-4xl">⚡</div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Taxa de Conversão</p>
                  <p className="text-3xl font-bold text-green-600 mt-1">{taxaConversao}%</p>
                  <p className="text-xs text-gray-400 mt-1">{leadsConvertidos} convertidos</p>
                </div>
                <div className="text-4xl">✅</div>
              </div>
            </div>
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Leads por Status */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-gray-800 mb-4">Leads por Status</h3>
              <div className="space-y-3">
                {leadsPorStatus.map(item => (
                  <div key={item.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">{item.name}</span>
                      <span className="font-semibold text-gray-800">{item.value}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-[#7BC9C2] h-2 rounded-full" style={{ width: `${(item.value / Math.max(...leadsPorStatus.map(l => l.value), 1)) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Clientes por Tipo */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-gray-800 mb-4">Clientes por Tipo</h3>
              <div className="space-y-2">
                {clientesPorTipo.map((item, idx) => (
                  <div key={item.name} className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: cores[idx % cores.length] }} />
                    <span className="text-sm text-gray-600 flex-1">{item.name}</span>
                    <span className="font-semibold text-gray-800">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Últimas Atividades */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-bold text-gray-800 mb-4">Últimas Atividades</h3>
            <div className="space-y-3">
              {atividades.slice(0, 5).map(a => (
                <div key={a.id} className="flex items-start gap-3 pb-3 border-b border-gray-100">
                  <div className="text-2xl">
                    {a.tipo === "chamada" && "☎️"}
                    {a.tipo === "email" && "📧"}
                    {a.tipo === "mensagem" && "💬"}
                    {a.tipo === "reuniao" && "🤝"}
                    {a.tipo === "visita" && "🏪"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800">{a.clienteNome}</p>
                    <p className="text-xs text-gray-600">{a.descricao}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                      <span>{a.data}</span>
                      <span>•</span>
                      <span>{a.usuario}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CLIENTES */}
      {tab === "clientes" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h2 className="text-xl font-bold text-gray-800">Carteira de Clientes</h2>
            <button onClick={() => setShowNovoCliente(!showNovoCliente)} className="px-4 py-2 bg-[#7BC9C2] text-white rounded-lg text-sm font-bold hover:bg-[#6ab8b1]">
              + Novo Cliente
            </button>
          </div>

          {showNovoCliente && (
            <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
              <h3 className="font-bold text-gray-700">Cadastrar Cliente</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <input placeholder="Nome *" value={formCliente.nome} onChange={(e) => setFormCliente({ ...formCliente, nome: e.target.value })} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]" />
                <input placeholder="E-mail" value={formCliente.email} onChange={(e) => setFormCliente({ ...formCliente, email: e.target.value })} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]" />
                <input placeholder="Telefone" value={formCliente.telefone} onChange={(e) => setFormCliente({ ...formCliente, telefone: e.target.value })} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]" />
                <select value={formCliente.tipo} onChange={(e) => setFormCliente({ ...formCliente, tipo: e.target.value as any })} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]">
                  <option value="varejo">Varejo</option>
                  <option value="revenda">Revenda</option>
                  <option value="atacado">Atacado</option>
                </select>
                <input type="number" placeholder="Comissão (%)" value={formCliente.comissao} onChange={(e) => setFormCliente({ ...formCliente, comissao: parseFloat(e.target.value) })} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]" />
              </div>
              <div className="flex gap-2">
                <button onClick={addCliente} className="px-4 py-2 bg-[#7BC9C2] text-white rounded-lg text-sm font-bold hover:bg-[#6ab8b1]">Salvar</button>
                <button onClick={() => setShowNovoCliente(false)} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200">Cancelar</button>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <input placeholder="Buscar por nome, email ou telefone..." value={searchClientes} onChange={(e) => setSearchClientes(e.target.value)} className="flex-1 min-w-[200px] px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]" />
            <select value={filterTipoCliente} onChange={(e) => setFilterTipoCliente(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]">
              <option value="todos">Todos os Tipos</option>
              <option value="varejo">Varejo</option>
              <option value="revenda">Revenda</option>
              <option value="atacado">Atacado</option>
            </select>
          </div>

          <div className="grid gap-3">
            {clientesFiltrados.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400">
                <p className="font-medium">Nenhum cliente encontrado</p>
              </div>
            ) : (
              clientesFiltrados.map(cliente => (
                <div key={cliente.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-gray-800">{cliente.nome}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${statusClienteColors[cliente.status]}`}>{cliente.status}</span>
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">{cliente.tipo}</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 text-xs text-gray-500">
                        {cliente.email && <span>📧 {cliente.email}</span>}
                        {cliente.telefone && <span>📱 {cliente.telefone}</span>}
                        <span>Compras: {cliente.compras}</span>
                        <span>Total: R$ {cliente.totalGasto.toLocaleString("pt-BR")}</span>
                      </div>
                    </div>
                    <select value={cliente.status} onChange={(e) => updateClienteStatus(cliente.id, e.target.value as any)} className="px-2 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-[#7BC9C2]">
                      <option value="ativo">Ativo</option>
                      <option value="inativo">Inativo</option>
                      <option value="suspenso">Suspenso</option>
                    </select>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* LEADS */}
      {tab === "leads" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h2 className="text-xl font-bold text-gray-800">Pipeline de Leads</h2>
            <button onClick={() => setShowNovoLead(!showNovoLead)} className="px-4 py-2 bg-[#7BC9C2] text-white rounded-lg text-sm font-bold hover:bg-[#6ab8b1]">
              + Novo Lead
            </button>
          </div>

          {showNovoLead && (
            <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
              <h3 className="font-bold text-gray-700">Cadastrar Lead</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <input placeholder="Nome *" value={formLead.nome} onChange={(e) => setFormLead({ ...formLead, nome: e.target.value })} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]" />
                <input placeholder="E-mail" value={formLead.email} onChange={(e) => setFormLead({ ...formLead, email: e.target.value })} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]" />
                <input placeholder="Telefone" value={formLead.telefone} onChange={(e) => setFormLead({ ...formLead, telefone: e.target.value })} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]" />
                <select value={formLead.origem} onChange={(e) => setFormLead({ ...formLead, origem: e.target.value as any })} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]">
                  <option value="whatsapp">WhatsApp</option>
                  <option value="instagram">Instagram</option>
                  <option value="indicacao">Indicação</option>
                  <option value="site">Site</option>
                  <option value="outro">Outro</option>
                </select>
                <input type="number" placeholder="Valor estimado (R$)" value={formLead.valor} onChange={(e) => setFormLead({ ...formLead, valor: parseFloat(e.target.value) })} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]" />
                <select value={formLead.vendedor} onChange={(e) => setFormLead({ ...formLead, vendedor: e.target.value })} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]">
                  <option value="Isamara">Isamara</option>
                  <option value="Rosemari">Rosemari</option>
                  <option value="Jaynie">Jaynie</option>
                </select>
                <textarea placeholder="Notas..." value={formLead.notas} onChange={(e) => setFormLead({ ...formLead, notas: e.target.value })} className="col-span-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]" rows={2} />
              </div>
              <div className="flex gap-2">
                <button onClick={addLead} className="px-4 py-2 bg-[#7BC9C2] text-white rounded-lg text-sm font-bold hover:bg-[#6ab8b1]">Salvar</button>
                <button onClick={() => setShowNovoLead(false)} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200">Cancelar</button>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <input placeholder="Buscar por nome, email ou telefone..." value={searchLeads} onChange={(e) => setSearchLeads(e.target.value)} className="flex-1 min-w-[200px] px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]" />
            <div className="flex gap-1.5 overflow-x-auto">
              {["todos", "novo", "contato", "proposta", "negociacao", "convertido", "perdido"].map(s => (
                <button key={s} onClick={() => setFilterStatusLead(s)} className={`px-3 py-1.5 text-xs rounded-lg font-medium whitespace-nowrap transition-colors ${filterStatusLead === s ? "bg-[#7BC9C2] text-white" : "bg-white text-gray-600 border border-gray-200"}`}>
                  {s === "todos" ? "Todos" : statusLeadLabels[s] || s}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-3">
            {leadsFiltrados.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400">
                <p className="font-medium">Nenhum lead encontrado</p>
              </div>
            ) : (
              leadsFiltrados.map(lead => (
                <div key={lead.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-gray-800">{lead.nome}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${statusLeadColors[lead.status]}`}>{statusLeadLabels[lead.status]}</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-2 text-xs text-gray-500">
                        {lead.email && <span>📧 {lead.email}</span>}
                        {lead.telefone && <span>📱 {lead.telefone}</span>}
                        <span>📍 {lead.origem}</span>
                        {lead.valor && <span>💰 R$ {lead.valor.toLocaleString("pt-BR")}</span>}
                        <span>👤 {lead.vendedor}</span>
                      </div>
                      {lead.notas && <p className="text-xs text-gray-400 mt-2">📝 {lead.notas}</p>}
                    </div>
                    <select value={lead.status} onChange={(e) => updateLeadStatus(lead.id, e.target.value as any)} className="px-2 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-[#7BC9C2]">
                      <option value="novo">Novo</option>
                      <option value="contato">Contato</option>
                      <option value="proposta">Proposta</option>
                      <option value="negociacao">Negociação</option>
                      <option value="convertido">Convertido</option>
                      <option value="perdido">Perdido</option>
                    </select>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ATIVIDADES */}
      {tab === "atividades" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h2 className="text-xl font-bold text-gray-800">Histórico de Atividades</h2>
            <button onClick={() => setShowNovaAtividade(!showNovaAtividade)} className="px-4 py-2 bg-[#7BC9C2] text-white rounded-lg text-sm font-bold hover:bg-[#6ab8b1]">
              + Registrar Atividade
            </button>
          </div>

          {showNovaAtividade && (
            <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
              <h3 className="font-bold text-gray-700">Registrar Atividade</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <select value={formAtividade.tipo} onChange={(e) => setFormAtividade({ ...formAtividade, tipo: e.target.value as any })} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]">
                  <option value="chamada">Chamada</option>
                  <option value="email">E-mail</option>
                  <option value="mensagem">Mensagem</option>
                  <option value="reuniao">Reunião</option>
                  <option value="visita">Visita</option>
                </select>
                <select value={formAtividade.clienteId} onChange={(e) => setFormAtividade({ ...formAtividade, clienteId: e.target.value })} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]">
                  <option value="">Selecione o cliente</option>
                  {clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                </select>
                <textarea placeholder="Descrição da atividade..." value={formAtividade.descricao} onChange={(e) => setFormAtividade({ ...formAtividade, descricao: e.target.value })} className="col-span-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]" rows={2} />
              </div>
              <div className="flex gap-2">
                <button onClick={addAtividade} className="px-4 py-2 bg-[#7BC9C2] text-white rounded-lg text-sm font-bold hover:bg-[#6ab8b1]">Salvar</button>
                <button onClick={() => setShowNovaAtividade(false)} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200">Cancelar</button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {atividades.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400">
                <p className="font-medium">Nenhuma atividade registrada</p>
              </div>
            ) : (
              atividades.map(a => (
                <div key={a.id} className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">
                      {a.tipo === "chamada" && "☎️"}
                      {a.tipo === "email" && "📧"}
                      {a.tipo === "mensagem" && "💬"}
                      {a.tipo === "reuniao" && "🤝"}
                      {a.tipo === "visita" && "🏪"}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-800">{a.clienteNome}</p>
                      <p className="text-sm text-gray-600 mt-1">{a.descricao}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                        <span>📅 {a.data}</span>
                        <span>👤 {a.usuario}</span>
                        {a.resultado && <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded">✓ {a.resultado}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* PROPOSTAS */}
      {tab === "propostas" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">Propostas e Orçamentos</h2>
            <button onClick={() => setShowNovaProposta(!showNovaProposta)} className="px-4 py-2 bg-[#7BC9C2] text-white rounded-lg text-sm font-bold hover:bg-[#6ab8b1]">
              + Nova Proposta
            </button>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400">
            <p className="font-medium">Módulo de propostas em desenvolvimento</p>
            <p className="text-xs mt-2">Você será capaz de criar, enviar e rastrear propostas de clientes</p>
          </div>
        </div>
      )}

      {/* RELATÓRIOS */}
      {tab === "relatorios" && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800">Relatórios e Análises</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-gray-800 mb-4">Receita por Mês</h3>
              <div className="space-y-3">
                {[
                  { month: "Jan", valor: 5000 },
                  { month: "Fev", valor: 7000 },
                  { month: "Mar", valor: 6500 },
                  { month: "Abr", valor: 8500 },
                  { month: "Mai", valor: 9200 },
                  { month: "Jun", valor: 10000 },
                ].map(item => (
                  <div key={item.month}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">{item.month}</span>
                      <span className="font-semibold text-gray-800">R$ {(item.valor / 1000).toFixed(1)}k</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-[#7BC9C2] h-2 rounded-full" style={{ width: `${(item.valor / 10000) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-gray-800 mb-4">Performance Vendedores</h3>
              <div className="space-y-2">
                {[
                  { name: "Isamara", vendas: 28, valor: 12500 },
                  { name: "Rosemari", vendas: 15, valor: 8000 },
                  { name: "Jaynie", vendas: 10, valor: 5500 },
                ].map(v => (
                  <div key={v.name} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-800">{v.name}</span>
                      <span className="text-xs text-gray-500">{v.vendas} vendas</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div className="bg-[#7BC9C2] h-2 rounded-full" style={{ width: `${(v.vendas / 28) * 100}%` }} />
                    </div>
                    <p className="text-xs text-gray-600 mt-1">R$ {v.valor.toLocaleString("pt-BR")}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
