"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function MinhaConta() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Sistema de login será integrado com o Hunter em breve!");
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Image src="/logo.png" alt="Beleza Nativa" width={180} height={60} className="mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800">Área do Parceiro</h1>
          <p className="text-sm text-gray-500 mt-1">Faça login para acessar preços de atacado</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2] transition-colors"
              />
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600">
                <input type="checkbox" className="rounded" />
                Lembrar-me
              </label>
              <a href="#" className="text-[#7BC9C2] hover:underline">Esqueci minha senha</a>
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-[#7BC9C2] text-white rounded-lg font-bold text-sm hover:bg-[#6ab8b1] transition-colors"
            >
              ENTRAR
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500">
              Ainda não tem cadastro?{" "}
              <Link href="/cadastro" className="text-[#7BC9C2] font-semibold hover:underline">
                Cadastre-se aqui
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <a
            href="https://wa.me/5535992100072?text=Ol%C3%A1!%20Gostaria%20de%20me%20cadastrar%20como%20revendedora."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-green-600 hover:underline"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            </svg>
            Falar com a Beleza Nativa pelo WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
