"use client";

import { useState } from "react";

interface Partner {
  id: string;
  name: string;
  company: string;
  cnpj: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  status: "ativo" | "inativo" | "pendente";
  createdAt: string;
  totalOrders: number;
  totalSpent: number;
}

export default function AdminParceiros() {
  const [partners, setPartners] = useState<Partner[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("belezanativa_partners");
      if (saved) return JSON.parse(saved);
    }
    return [];
  });
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    name: "", company: "", cnpj: "", phone: "", email: "", city: "", state: "",
  });

  const savePartners = (data: Partner[]) => {
    setPartners(data);
    localStorage.setItem("belezanativa_partners", JSON.stringify(data));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPartner: Partner = {
      id: Date.now().toString(36),
      ...form,
      status: "ativo",
      createdAt: new Date().toLocaleDateString("pt-BR"),
      totalOrders: 0,
      totalSpent: 0,
    };
    savePartners([newPartner, ...partners]);
    setForm({ name: "", company: "", cnpj: "", phone: "", email: "", city: "", state: "" });
    setShowForm(false);
  };

  const toggleStatus = (id: string) => {
    savePartners(
      partners.map((p) =>
        p.id === id ? { ...p, status: p.status === "ativo" ? "inativo" : "ativo" } : p
      )
    );
  };

  const filtered = partners.filter(
    (p) =>
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.company.toLowerCase().includes(search.toLowerCase()) ||
      p.cnpj.includes(search)
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Parceiros</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-[#7BC9C2] text-white rounded-lg text-sm font-semibold hover:bg-[#6ab8b1] transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Novo Parceiro
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Cadastrar Novo Parceiro</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Nome Completo</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Razão Social / Nome Fantasia</label>
              <input
                type="text"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">CNPJ / CPF</label>
              <input
                type="text"
                value={form.cnpj}
                onChange={(e) => setForm({ ...form, cnpj: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Telefone / WhatsApp</label>
              <input
                type="text"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">E-mail</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]"
              />
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-600 mb-1">Cidade</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]"
                />
              </div>
              <div className="w-20">
                <label className="block text-xs font-medium text-gray-600 mb-1">UF</label>
                <input
                  type="text"
                  maxLength={2}
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]"
                />
              </div>
            </div>
            <div className="sm:col-span-2 flex gap-3 justify-end pt-2">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">
                Cancelar
              </button>
              <button type="submit" className="px-6 py-2 bg-[#7BC9C2] text-white rounded-lg text-sm font-semibold hover:bg-[#6ab8b1] transition-colors">
                Cadastrar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <input
          type="text"
          placeholder="Buscar parceiro por nome, empresa ou CNPJ..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]"
        />
      </div>

      {/* Partners List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr className="text-left text-gray-600">
                  <th className="px-4 py-3 font-semibold">Parceiro</th>
                  <th className="px-4 py-3 font-semibold">Contato</th>
                  <th className="px-4 py-3 font-semibold">Cidade</th>
                  <th className="px-4 py-3 font-semibold">Pedidos</th>
                  <th className="px-4 py-3 font-semibold">Total Gasto</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-800 text-xs">{p.name}</p>
                      <p className="text-xs text-gray-400">{p.company || "—"}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs text-gray-700">{p.phone}</p>
                      <p className="text-xs text-gray-400">{p.email || "—"}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {p.city ? `${p.city}/${p.state}` : "—"}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-700">{p.totalOrders}</td>
                    <td className="px-4 py-3 text-xs font-medium text-gray-700">
                      R$ {p.totalSpent.toFixed(2).replace(".", ",")}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        p.status === "ativo" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <a
                          href={`/admin/parceiros/${p.id}`}
                          className="text-xs text-blue-500 hover:underline"
                        >
                          📦 Catálogo
                        </a>
                        <button
                          onClick={() => toggleStatus(p.id)}
                          className="text-xs text-[#7BC9C2] hover:underline"
                        >
                          {p.status === "ativo" ? "Desativar" : "Ativar"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 text-gray-400">
            <svg className="w-16 h-16 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-lg font-medium">Nenhum parceiro cadastrado</p>
            <p className="text-sm mt-1">Clique em &quot;Novo Parceiro&quot; para começar</p>
          </div>
        )}
      </div>
    </div>
  );
}
