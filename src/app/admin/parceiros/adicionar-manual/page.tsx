"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

export default function AdicionarManual() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    company: "",
    cnpj: "",
    phone: "",
    email: "",
    city: "",
    state: "",
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.name || !form.phone || !form.email) {
      setError("❌ Preencha no mínimo: Nome, Telefone e E-mail!");
      return;
    }

    try {
      const partners = JSON.parse(localStorage.getItem("belezanativa_partners") || "[]");

      const newPartner: Partner = {
        id: Date.now().toString(36),
        name: form.name,
        company: form.company || "",
        cnpj: form.cnpj || "",
        phone: form.phone,
        email: form.email,
        city: form.city || "",
        state: form.state || "",
        status: "ativo",
        createdAt: new Date().toLocaleDateString("pt-BR"),
        totalOrders: 0,
        totalSpent: 0,
      };

      partners.push(newPartner);
      localStorage.setItem("belezanativa_partners", JSON.stringify(partners));

      setSuccess(`✅ ${form.name} adicionada com sucesso!`);
      setForm({
        name: "",
        company: "",
        cnpj: "",
        phone: "",
        email: "",
        city: "",
        state: "",
      });

      setTimeout(() => {
        router.push("/admin/parceiros");
      }, 2000);
    } catch (err: any) {
      setError(`❌ ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href="/admin/parceiros" className="text-sm text-gray-500 hover:text-gray-700 mb-4 block">
            ← Voltar
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">➕ Adicionar Revendedora Manual</h1>
          <p className="text-gray-600 mt-1">Preencha os dados da cliente que não conseguiu se cadastrar</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-6">
          {/* Dados Pessoais */}
          <div className="space-y-4">
            <h3 className="font-bold text-gray-800">📋 Dados Pessoais</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">Nome Completo *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ex: Juziany Fernandes Cardoso"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#7BC9C2]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Razão Social / Nome Fantasia</label>
                <input
                  type="text"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  placeholder="Ex: 60274409 Juziany"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#7BC9C2]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">CNPJ / CPF</label>
                <input
                  type="text"
                  value={form.cnpj}
                  onChange={(e) => setForm({ ...form, cnpj: e.target.value })}
                  placeholder="Ex: 60.274.409/0001-28"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#7BC9C2]"
                />
              </div>
            </div>
          </div>

          {/* Contato */}
          <div className="space-y-4">
            <h3 className="font-bold text-gray-800">📞 Contato</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Telefone / WhatsApp *</label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="Ex: 38999543057"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#7BC9C2]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">E-mail *</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="Ex: sorellefernandes@gmail.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#7BC9C2]"
                />
              </div>
            </div>
          </div>

          {/* Localização */}
          <div className="space-y-4">
            <h3 className="font-bold text-gray-800">📍 Localização</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Cidade</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  placeholder="Ex: Itamarandiba"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#7BC9C2]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Estado (UF)</label>
                <input
                  type="text"
                  maxLength={2}
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value.toUpperCase() })}
                  placeholder="Ex: MG"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#7BC9C2]"
                />
              </div>
            </div>
          </div>

          {/* Mensagens */}
          {success && (
            <div className="p-4 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
              {success}
            </div>
          )}
          {error && (
            <div className="p-4 bg-red-100 text-red-700 rounded-lg text-sm font-medium">
              {error}
            </div>
          )}

          {/* Botão */}
          <button
            type="submit"
            className="w-full bg-[#7BC9C2] hover:bg-[#5fb3ac] text-white font-bold py-3 rounded-lg transition-colors"
          >
            ✅ ADICIONAR REVENDEDORA
          </button>
        </form>

        {/* Info */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-900">
            <strong>ℹ️ Dica:</strong> Preencha os dados que a cliente mandou no WhatsApp e clique em adicionar.
            Ela aparecerá imediatamente no painel de Gerenciar Cadastros!
          </p>
        </div>
      </div>
    </div>
  );
}
