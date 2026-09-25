"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function PalmiraAdminPage() {
  const [productsCount, setProductsCount] = useState(0);

  useEffect(() => {
    try {
      const products = JSON.parse(localStorage.getItem("belezanativa_product_uploads") || "[]");
      setProductsCount(products.length);
    } catch {}
  }, []);

  const menuItems = [
    {
      href: "/admin/palmira/upload",
      icon: "📸",
      title: "Upload de Produtos",
      desc: "Adicione fotos e dados dos produtos",
      color: "from-blue-500 to-blue-600",
    },
    {
      href: "/admin/palmira/produtos",
      icon: "📦",
      title: "Produtos",
      desc: `${productsCount} produtos cadastrados`,
      color: "from-purple-500 to-purple-600",
    },
    {
      href: "/admin/palmira/estoque",
      icon: "📊",
      title: "Controle de Estoque",
      desc: "Acompanhe o estoque",
      color: "from-green-500 to-green-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-[#7BC9C2] rounded-xl flex items-center justify-center text-white font-bold text-xl">
              P
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Painel da Palmira</h1>
              <p className="text-sm text-gray-500">Gerenciar produtos e estoque</p>
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <div className="h-full bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden group cursor-pointer">
                {/* Gradient Background */}
                <div className={`h-24 bg-gradient-to-r ${item.color} relative overflow-hidden`}>
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-2 right-2 text-6xl">{item.icon}</div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="text-4xl mb-3">{item.icon}</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.desc}</p>

                  {/* Arrow */}
                  <div className="mt-4 inline-block text-[#7BC9C2] font-bold group-hover:translate-x-1 transition-transform">
                    Acessar →
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Tips */}
        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">📝 Dicas Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="text-3xl">📸</div>
              <h3 className="font-semibold text-gray-800">Upload</h3>
              <p className="text-sm text-gray-600">
                Adicione quantas fotos quiser de cada produto. As fotos são otimizadas automaticamente.
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl">🖼️</div>
              <h3 className="font-semibold text-gray-800">Galeria</h3>
              <p className="text-sm text-gray-600">
                Os clientes veem um carrossel com todas as fotos do produto na loja.
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl">📊</div>
              <h3 className="font-semibold text-gray-800">Estoque</h3>
              <p className="text-sm text-gray-600">
                Acompanhe a quantidade de cada produto em tempo real.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-700">
            ← Voltar ao painel completo
          </Link>
        </div>
      </div>
    </div>
  );
}
// Force rebuild 2026-09-25 08:15:52
