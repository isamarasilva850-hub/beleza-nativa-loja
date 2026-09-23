"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Cadastro() {
  const { register, isLoggedIn } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");
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
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("As senhas não coincidem!");
      return;
    }

    if (form.password.length < 4) {
      setError("A senha deve ter pelo menos 4 caracteres.");
      return;
    }

    const ok = register({
      email: form.email,
      name: form.name,
      phone: form.phone,
      company: form.company || undefined,
      cnpj: form.cnpj || undefined,
      city: form.city || undefined,
      state: form.state || undefined,
      address: form.address || undefined,
      cep: form.cep || undefined,
      password: form.password,
      createdAt: new Date().toISOString(),
    });

    if (!ok) {
      setError("Este e-mail já está cadastrado. Faça login.");
      return;
    }

    const msg = [
      "Nova revendedora cadastrada no site!",
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

    router.push("/");
  };

  if (isLoggedIn) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Cadastro realizado!</h1>
          <p className="text-sm text-gray-500 mb-6">Você já está logada e pode ver os preços de atacado.</p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-[#7BC9C2] text-white rounded-lg font-bold text-sm hover:bg-[#6ab8b1] transition-colors"
          >
            IR PARA A LOJA
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <Image src="/logo-bn.png" alt="Beleza Nativa" width={180} height={60} className="mx-auto mb-4 rounded-lg" />
          <h1 className="text-2xl font-bold text-gray-800">Cadastro de Revendedora</h1>
          <p className="text-sm text-gray-500 mt-1">
            Preencha seus dados para se tornar uma parceira Beleza Nativa
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
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

            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-[#7BC9C2] text-white rounded-lg font-bold text-sm hover:bg-[#6ab8b1] transition-colors"
            >
              CADASTRAR
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
