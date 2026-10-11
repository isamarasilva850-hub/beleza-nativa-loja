"use client";

import { useState, useEffect } from "react";
import { carregarPedidos } from "@/lib/pedidos";

type Vendedora = { id: number; name: string; role: string; avatar: string };

// Lista inicial, usada só se ainda não houver lista salva no banco
const VENDEDORAS_PADRAO: Vendedora[] = [
  { id: 1, name: "Rosemari", role: "Vendedora", avatar: "RM" },
  { id: 2, name: "Isamara", role: "Gerente / Vendedora", avatar: "IS" },
  { id: 4, name: "Jaynie", role: "Vendedora", avatar: "JY" },
];

const iniciais = (nome: string) => nome.trim().split(/\s+/).map((p) => p[0] || "").join("").slice(0, 2).toUpperCase() || "?";

export default function Vendedores() {
  const [orders, setOrders] = useState<any[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [agenda, setAgenda] = useState<any[]>([]);
  const [vendedores, setVendedores] = useState<Vendedora[]>(VENDEDORAS_PADRAO);
  const [novoNome, setNovoNome] = useState("");

  // Salva a lista de vendedoras no banco (crm_dados, chave "vendedoras")
  const salvarVendedoras = (lista: Vendedora[]) => {
    setVendedores(lista);
    fetch("/api/crm-dados", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chave: "vendedoras", valor: lista }),
    }).catch((err) => console.error("Erro ao salvar vendedoras", err));
  };

  const mudarNome = (id: number, name: string) => {
    setVendedores((atuais) => atuais.map((v) => (v.id === id ? { ...v, name, avatar: iniciais(name) } : v)));
  };

  const adicionarVendedora = () => {
    const nome = novoNome.trim();
    if (!nome) return;
    const proximoId = Math.max(0, ...vendedores.map((v) => v.id)) + 1;
    salvarVendedoras([...vendedores, { id: proximoId, name: nome, role: "Vendedora", avatar: iniciais(nome) }]);
    setNovoNome("");
  };

  const removerVendedora = (id: number) => {
    if (!confirm("Remover esta vendedora da lista? Os pedidos e leads dela continuam salvos.")) return;
    salvarVendedoras(vendedores.filter((v) => v.id !== id));
  };

  useEffect(() => {
    fetch("/api/crm-dados?chave=vendedoras")
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d.valor) && d.valor.length > 0) setVendedores(d.valor);
      })
      .catch((err) => console.error("Erro ao carregar vendedoras", err));

    // Tudo vem do servidor, para aparecer em qualquer computador
    carregarPedidos().then(setOrders).catch((err) => console.error("Erro ao carregar pedidos", err));
    fetch("/api/partners").then((r) => r.json()).then((d) => setPartners(Array.isArray(d) ? d : [])).catch(() => {});
    fetch("/api/crm/leads").then((r) => r.json()).then((d) => setLeads(Array.isArray(d) ? d : [])).catch(() => {});
    fetch("/api/crm-dados?chave=agenda").then((r) => r.json()).then((d) => setAgenda(Array.isArray(d.valor) ? d.valor : [])).catch(() => {});
  }, []);

  const getStats = (name: string) => {
    const myOrders = orders.filter((o: any) => (o.vendedor || o.revendedora || "").toLowerCase().includes(name.toLowerCase()));
    const myPartners = partners.filter((p: any) => (p.vendedor || "").toLowerCase().includes(name.toLowerCase()));
    const myLeads = leads.filter((l: any) => (l.vendedor || "").toLowerCase().includes(name.toLowerCase()));
    const myAgenda = agenda.filter((a: any) => (a.vendedor || "").toLowerCase().includes(name.toLowerCase()));
    const revenue = myOrders.reduce((s: number, o: any) => s + (o.total || 0), 0);
    const converted = myLeads.filter((l: any) => l.status === "convertido").length;

    return {
      orders: myOrders.length,
      revenue,
      partners: myPartners.length,
      leads: myLeads.length,
      converted,
      conversionRate: myLeads.length > 0 ? ((converted / myLeads.length) * 100).toFixed(0) : "0",
      pendingAgenda: myAgenda.filter((a: any) => !a.done).length,
      completedAgenda: myAgenda.filter((a: any) => a.done).length,
    };
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Desempenho dos Vendedores</h1>

      <div className="bg-white rounded-2xl shadow-sm p-5 space-y-3">
        <p className="text-sm font-bold text-gray-700">Vendedoras</p>
        {vendedores.map((v) => (
          <div key={v.id} className="flex gap-2 items-center">
            <input
              type="text"
              value={v.name}
              onChange={(e) => mudarNome(v.id, e.target.value)}
              onBlur={() => salvarVendedoras(vendedores)}
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]"
            />
            <button onClick={() => removerVendedora(v.id)} className="px-3 py-2 text-xs text-red-500 hover:bg-red-50 rounded-lg">
              Remover
            </button>
          </div>
        ))}
        <div className="flex gap-2 pt-2">
          <input
            type="text"
            placeholder="Nome da nova vendedora"
            value={novoNome}
            onChange={(e) => setNovoNome(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]"
          />
          <button onClick={adicionarVendedora} className="px-4 py-2 bg-[#7BC9C2] text-white rounded-lg text-sm font-bold">
            Adicionar
          </button>
        </div>
      </div>

      <div className="grid gap-6">
        {vendedores.map((v) => {
          const stats = getStats(v.name);
          return (
            <div key={v.id} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 bg-[#7BC9C2] rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {v.avatar}
                </div>
                <div>
                  <h2 className="font-bold text-gray-800 text-lg">{v.name}</h2>
                  <p className="text-xs text-gray-500">{v.role}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-[10px] font-bold text-gray-500 uppercase">Vendido</p>
                  <p className="text-lg font-bold text-green-600">R$ {stats.revenue.toFixed(2).replace(".", ",")}</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-[10px] font-bold text-gray-500 uppercase">Pedidos</p>
                  <p className="text-lg font-bold text-blue-600">{stats.orders}</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-3">
                  <p className="text-[10px] font-bold text-gray-500 uppercase">Leads convertidos</p>
                  <p className="text-lg font-bold text-orange-600">{stats.converted} de {stats.leads}</p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-3">
                  <p className="text-[10px] font-bold text-gray-500 uppercase">Agenda pendente</p>
                  <p className="text-lg font-bold text-yellow-600">{stats.pendingAgenda}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
