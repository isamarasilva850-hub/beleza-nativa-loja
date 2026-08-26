"use client";

import { useState, useEffect } from "react";

const vendedores = [
  { id: 1, name: "Rosemari", role: "Vendedora", avatar: "RM" },
  { id: 2, name: "Isamara", role: "Gerente / Vendedora", avatar: "IS" },
  { id: 4, name: "Jaynie", role: "Vendedora", avatar: "JY" },
];

export default function Vendedores() {
  const [orders, setOrders] = useState<any[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [agenda, setAgenda] = useState<any[]>([]);

  useEffect(() => {
    const o = localStorage.getItem("belezanativa_orders");
    const p = localStorage.getItem("belezanativa_partners");
    const l = localStorage.getItem("belezanativa_leads");
    const a = localStorage.getItem("belezanativa_agenda");
    if (o) setOrders(JSON.parse(o));
    if (p) setPartners(JSON.parse(p));
    if (l) setLeads(JSON.parse(l));
    if (a) setAgenda(JSON.parse(a));
  }, []);

  const getStats = (name: string) => {
    const myOrders = orders.filter((o: any) => o.vendedor === name);
    const myPartners = partners.filter((p: any) => p.vendedor === name);
    const myLeads = leads.filter((l: any) => l.vendedor === name);
    const myAgenda = agenda.filter((a: any) => a.vendedor === name);
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
                  <p className="text-[10px] font-bold text-gray-500 uppercase">Receita</p>
                  <p className="text-lg font-bold text-green-600">R$ {stats.revenue.toFixed(2).replace(".", ",")}</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-[10px] font-bold text-gray-500 uppercase">Pedidos</p>
                  <p className="text-lg font-bold text-blue-600">{stats.orders}</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3">
                  <p className="text-[10px] font-bold text-gray-500 uppercase">Clientes</p>
                  <p className="text-lg font-bold text-purple-600">{stats.partners}</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-3">
                  <p className="text-[10px] font-bold text-gray-500 uppercase">Leads</p>
                  <p className="text-lg font-bold text-orange-600">{stats.leads}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-xl font-bold text-[#7BC9C2]">{stats.conversionRate}%</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">Tx. Conversão</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-xl font-bold text-yellow-600">{stats.pendingAgenda}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">Agenda Pendente</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-xl font-bold text-emerald-600">{stats.completedAgenda}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">Agenda Concluída</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
