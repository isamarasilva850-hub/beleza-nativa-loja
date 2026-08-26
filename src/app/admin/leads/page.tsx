"use client";

import { useState, useEffect } from "react";

interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  source: string;
  status: "novo" | "contato" | "negociacao" | "convertido" | "perdido";
  notes: string;
  createdAt: string;
  vendedor: string;
}

const statusColors: Record<string, string> = {
  novo: "bg-blue-100 text-blue-700",
  contato: "bg-yellow-100 text-yellow-700",
  negociacao: "bg-orange-100 text-orange-700",
  convertido: "bg-green-100 text-green-700",
  perdido: "bg-red-100 text-red-700",
};

const statusLabels: Record<string, string> = {
  novo: "Novo",
  contato: "Em Contato",
  negociacao: "Negociação",
  convertido: "Convertido",
  perdido: "Perdido",
};

export default function Leads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [form, setForm] = useState({ name: "", phone: "", email: "", source: "whatsapp", notes: "", vendedor: "Isamara" });

  useEffect(() => {
    const stored = localStorage.getItem("belezanativa_leads");
    if (stored) setLeads(JSON.parse(stored));
  }, []);

  const save = (updated: Lead[]) => {
    setLeads(updated);
    localStorage.setItem("belezanativa_leads", JSON.stringify(updated));
  };

  const addLead = () => {
    if (!form.name) return;
    const newLead: Lead = {
      id: Date.now().toString(),
      ...form,
      status: "novo",
      createdAt: new Date().toISOString(),
    };
    save([newLead, ...leads]);
    setForm({ name: "", phone: "", email: "", source: "whatsapp", notes: "", vendedor: "Isamara" });
    setShowForm(false);
  };

  const updateStatus = (id: string, status: Lead["status"]) => {
    save(leads.map((l) => (l.id === id ? { ...l, status } : l)));
  };

  const removeLead = (id: string) => {
    if (confirm("Remover este lead?")) save(leads.filter((l) => l.id !== id));
  };

  const filtered = leads.filter((l) => {
    const matchSearch = l.name.toLowerCase().includes(search.toLowerCase()) || l.phone.includes(search) || l.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "todos" || l.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-gray-800">Gerenciar Leads</h1>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-[#7BC9C2] text-white rounded-lg text-sm font-bold hover:bg-[#6ab8b1]">
          + Novo Lead
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <h2 className="font-bold text-gray-700">Cadastrar Lead</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <input placeholder="Nome *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]" />
            <input placeholder="Telefone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]" />
            <input placeholder="E-mail" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]" />
            <select value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]">
              <option value="whatsapp">WhatsApp</option>
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
              <option value="indicacao">Indicação</option>
              <option value="site">Site</option>
              <option value="outro">Outro</option>
            </select>
            <select value={form.vendedor} onChange={(e) => setForm({ ...form, vendedor: e.target.value })} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]">
              <option value="Rosemari">Rosemari</option>
              <option value="Isamara">Isamara</option>
              <option value="Jaynie">Jaynie</option>
            </select>
            <input placeholder="Observações" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]" />
          </div>
          <div className="flex gap-2">
            <button onClick={addLead} className="px-4 py-2 bg-[#7BC9C2] text-white rounded-lg text-sm font-bold hover:bg-[#6ab8b1]">Salvar</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200">Cancelar</button>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <input placeholder="Buscar por nome, telefone ou email..." value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 min-w-[200px] px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]" />
        <div className="flex gap-1.5">
          {["todos", "novo", "contato", "negociacao", "convertido", "perdido"].map((s) => (
            <button key={s} onClick={() => setFilterStatus(s)} className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${filterStatus === s ? "bg-[#7BC9C2] text-white" : "bg-white text-gray-600 border border-gray-200"}`}>
              {s === "todos" ? "Todos" : statusLabels[s]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400">
            <p className="font-medium">Nenhum lead encontrado</p>
          </div>
        ) : (
          filtered.map((lead) => (
            <div key={lead.id} className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-gray-800 text-sm">{lead.name}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${statusColors[lead.status]}`}>{statusLabels[lead.status]}</span>
                </div>
                <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                  {lead.phone && <span>{lead.phone}</span>}
                  {lead.email && <span>{lead.email}</span>}
                  <span>Origem: {lead.source}</span>
                  <span>Vendedor: {lead.vendedor}</span>
                </div>
                {lead.notes && <p className="text-xs text-gray-400 mt-1">{lead.notes}</p>}
              </div>
              <div className="flex items-center gap-2">
                <select value={lead.status} onChange={(e) => updateStatus(lead.id, e.target.value as Lead["status"])} className="px-2 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-[#7BC9C2]">
                  {Object.entries(statusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
                {lead.phone && (
                  <a href={`https://wa.me/55${lead.phone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
                  </a>
                )}
                <button onClick={() => removeLead(lead.id)} className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
