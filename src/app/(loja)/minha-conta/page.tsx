"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

interface Order {
  number: number;
  date: string;
  totalItems: number;
  total: number;
  items?: any[];
}

export default function MinhaConta() {
  const { isLoggedIn, user, login, logout } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [remember, setRemember] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined" && isLoggedIn) {
      const savedOrders = JSON.parse(localStorage.getItem("belezanativa_orders") || "[]");
      setOrders(savedOrders.sort((a: Order, b: Order) => b.number - a.number));
    }
  }, [isLoggedIn]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const ok = login(email, password);
    if (!ok) {
      setError("E-mail ou senha incorretos. Verifique seus dados ou cadastre-se.");
    }
  };

  if (isLoggedIn && user) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-[#7BC9C2] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <h1 className="text-xl font-bold text-gray-800">{user.name}</h1>
              <p className="text-sm text-gray-500">{user.email}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                Revendedora
              </span>
            </div>

            <div className="space-y-3 mb-6">
              {user.phone && (
                <div className="flex items-center gap-3 text-sm">
                  <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-gray-600">{user.phone}</span>
                </div>
              )}
              {user.city && (
                <div className="flex items-center gap-3 text-sm">
                  <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-gray-600">{user.city}{user.state ? `/${user.state}` : ""}</span>
                </div>
              )}
              {user.company && (
                <div className="flex items-center gap-3 text-sm">
                  <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span className="text-gray-600">{user.company}</span>
                </div>
              )}
            </div>

            <div className="bg-primary/5 rounded-lg p-4 mb-6">
              <p className="text-sm font-semibold text-primary mb-1">Preço de revenda ativo</p>
              <p className="text-xs text-gray-500">
                Você está vendo os preços de atacado em todos os produtos.
              </p>
            </div>

            <button
              onClick={logout}
              className="w-full py-3 border border-red-200 text-red-500 rounded-lg font-bold text-sm hover:bg-red-50 transition-colors"
            >
              SAIR DA CONTA
            </button>
          </div>

          {orders.length > 0 && (
            <div className="mt-8 w-full max-w-4xl">
              <h2 className="text-xl font-bold text-gray-800 mb-4">📋 Histórico de Pedidos</h2>
              <div className="space-y-3">
                {orders.map((order) => (
                  <div key={order.number} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 font-semibold mb-1">PEDIDO Nº</p>
                        <p className="text-lg font-bold text-gray-800">#{order.number}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-semibold mb-1">DATA</p>
                        <p className="text-sm text-gray-700">{order.date}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-semibold mb-1">ITENS</p>
                        <p className="text-lg font-bold text-gray-800">{order.totalItems}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 font-semibold mb-1">TOTAL</p>
                        <p className="text-lg font-bold text-primary">R$ {order.total.toFixed(2).replace(".", ",")}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 text-center">
            <Link href="/" className="text-sm text-gray-400 hover:text-gray-600">
              ← Voltar à loja
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Image src="/logo-bn.png" alt="Beleza Nativa" width={180} height={60} className="mx-auto mb-4 rounded-lg" />
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
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
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
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2] transition-colors"
              />
            </div>

            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600">
                <input
                  type="checkbox"
                  className="rounded"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                Lembrar-me
              </label>
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
