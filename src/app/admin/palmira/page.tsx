"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function PalmiraDashboard() {
  const [productCount, setProductCount] = useState(0);

  useEffect(() => {
    const uploads = JSON.parse(localStorage.getItem("belezanativa_product_uploads") || "[]");
    setProductCount(uploads.length);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-700 mb-4 block">
            ← Voltar
          </Link>
          <h1 className="text-4xl font-bold text-gray-800">👩‍💼 Painel da Palmira</h1>
          <p className="text-gray-600 mt-2">Gerencie produtos e pedidos de forma simples</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
          <p className="text-sm text-blue-800 font-medium">💡 Dica: Comece pelo Upload de Produtos para adicionar novas peças com múltiplas fotos!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/admin/palmira/upload" className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 border-l-4 border-blue-500 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800">📸 Upload</h3>
                <p className="text-sm text-gray-600 mt-1">Adicione produtos com fotos</p>
              </div>
              <div className="text-4xl">📤</div>
            </div>
            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-2"><span className="text-blue-500">✓</span><span>Múltiplas fotos por produto</span></div>
              <div className="flex items-center gap-2"><span className="text-blue-500">✓</span><span>Preço, tamanhos e cores</span></div>
              <div className="flex items-center gap-2"><span className="text-blue-500">✓</span><span>Sincronização automática</span></div>
            </div>
            <div className="pt-4 border-t border-gray-100 text-blue-600 font-semibold text-sm">Clique para fazer upload →</div>
          </Link>

          <Link href="/admin/palmira/produtos" className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 border-l-4 border-purple-500 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800">📦 Produtos</h3>
                <p className="text-sm text-gray-600 mt-1">Veja todos os produtos</p>
              </div>
              <div className="text-4xl">📋</div>
            </div>
            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-2"><span className="text-purple-500">✓</span><span>Galeria com miniaturas</span></div>
              <div className="flex items-center gap-2"><span className="text-purple-500">✓</span><span>Pesquisa por referência</span></div>
              <div className="flex items-center gap-2"><span className="text-purple-500">✓</span><span>Total: {productCount} produtos</span></div>
            </div>
            <div className="pt-4 border-t border-gray-100 text-purple-600 font-semibold text-sm">Clique para visualizar →</div>
          </Link>

          <Link href="/admin/palmira/estoque" className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 border-l-4 border-green-500 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800">📊 Estoque</h3>
                <p className="text-sm text-gray-600 mt-1">Controle de quantidade</p>
              </div>
              <div className="text-4xl">📈</div>
            </div>
            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-2"><span className="text-green-500">✓</span><span>Total de peças em estoque</span></div>
              <div className="flex items-center gap-2"><span className="text-green-500">✓</span><span>Alerta de baixo estoque</span></div>
              <div className="flex items-center gap-2"><span className="text-green-500">✓</span><span>Ordenar por quantidade</span></div>
            </div>
            <div className="pt-4 border-t border-gray-100 text-green-600 font-semibold text-sm">Clique para acompanhar →</div>
          </Link>

          <Link href="/admin/palmira/adicionar-cor" className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 border-l-4 border-pink-500 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800">🎨 Adicionar Cor</h3>
                <p className="text-sm text-gray-600 mt-1">Novas cores aos produtos</p>
              </div>
              <div className="text-4xl">✨</div>
            </div>
            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-2"><span className="text-pink-500">✓</span><span>Sem reupload de fotos</span></div>
              <div className="flex items-center gap-2"><span className="text-pink-500">✓</span><span>Seleciona referência existente</span></div>
              <div className="flex items-center gap-2"><span className="text-pink-500">✓</span><span>Adiciona cor nova rapidinho</span></div>
            </div>
            <div className="pt-4 border-t border-gray-100 text-pink-600 font-semibold text-sm">Clique para adicionar →</div>
          </Link>
        </div>

        <div className="mt-8 bg-gradient-to-r from-[#7BC9C2] to-[#5fb3ac] rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold">📦 Montar Pedido Rápido</h3>
              <p className="text-sm opacity-90 mt-1">Crie pedidos em segundos e envie pelo WhatsApp</p>
            </div>
            <Link href="/admin/montar-pedido" className="bg-white/20 hover:bg-white/30 text-white font-bold py-2 px-6 rounded-lg transition-colors">Acessar →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
