"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Cadastro() {
  const [form, setForm] = useState({
    name: "",
    company: "",
    cnpj: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    city: "",
    state: "",
    address: "",
    cep: "",
  });

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }
    const msg = [
      "Olá! Gostaria de me cadastrar como revendedora.",
      "",
      `Nome: ${form.name}`,
      form.company ? `Empresa: ${form.company}` : "",
      form.cnpj ? `CNPJ/CPF: ${form.cnpj}` : "",
      `Telefone: ${form.phone}`,
      `E-mail: ${form.email}`,
      form.city ? `Cidade: ${form.city}/${form.state}` : "",
      form.address ? `Endereço: ${form.address}` : "",
      form.cep ? `CEP: ${form.cep}` : "",
    ]
      .filter(Boolean)
      .join("\n");
    window.open(
      `https://wa.me/5535992100072?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <Image src="/logo.png" alt="Beleza Nativa" width={180} height={60} className="mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800">Cadastro de Revendedora</h1>
          <p className="text-sm text-gray-500 mt-1">
            Preencha seus dados para se tornar uma parceira Beleza Nativa
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Personal Info */}
            <div>
              <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">Dados Pessoais</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Razão Social / Nome Fantasia</label>
                  <input
                    type="text"
                    value={form.company}
                    onChange={(e) => update("company", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CNPJ / CPF</label>
                  <input
                    type="text"
                    value={form.cnpj}
                    onChange={(e) => update("cnpj", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]"
                  />
                </div>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">Contato</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefone / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    placeholder="(00) 00000-0000"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">E-mail *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]"
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">Endereço</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
                  <input
                    type="text"
                    value={form.cep}
                    onChange={(e) => update("cep", e.target.value)}
                    placeholder="00000-000"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => update("address", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => update("city", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado (UF)</label>
                  <input
                    type="text"
                    maxLength={2}
                    value={form.state}
                    onChange={(e) => update("state", e.target.value.toUpperCase())}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]"
                  />
                </div>
              </div>
            </div>

            {/* Password */}
            <div>
              <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">Senha de Acesso</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Senha *</label>
                  <input
                    type="password"
                    required
                    value={form.password}
                    onChange={(e) => update("password", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Senha *</label>
                  <input
                    type="password"
                    required
                    value={form.confirmPassword}
                    onChange={(e) => update("confirmPassword", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#7BC9C2] text-white rounded-lg font-bold text-sm hover:bg-[#6ab8b1] transition-colors"
            >
              CADASTRAR VIA WHATSAPP
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500">
              Já possui cadastro?{" "}
              <Link href="/minha-conta" className="text-[#7BC9C2] font-semibold hover:underline">
                Faça login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
