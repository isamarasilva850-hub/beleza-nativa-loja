"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface Product {
  id: string;
  ref: string;
  name: string;
  price: number;
  gender: string;
  order: number;
  image?: string;
}

export default function VisualizarLojaPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("todos");

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/products");
      const data = await response.json();

      const formatted = data.map((item: any, index: number) => ({
        id: item.id || index.toString(),
        ref: item.ref,
        name: item.name,
        price: parseFloat(item.price),
        gender: item.gender || "Feminino",
        order: item.display_order ?? index,
        image: item.images?.[0]?.image_base64 || item.images?.[0]?.image_url,
      }));

      formatted.sort((a: Product, b: Product) => a.order - b.order);
      setProducts(formatted);
    } catch (err) {
      console.error("Erro ao carregar produtos:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = filter === "todos"
    ? products
    : products.filter(p => p.gender === filter);

  const genderIcons: Record<string, string> = {
    "Feminino": "👧",
    "Masculino": "👨",
    "Infantil": "👶"
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7BC9C2] mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando prévia da loja...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <Link href="/admin/palmira" className="text-sm text-gray-500 hover:text-gray-700 mb-6 block">
          ← Voltar
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">👀 Prévia da Loja</h1>
          <p className="text-gray-600">Veja exatamente como seus produtos aparecem para os clientes</p>
        </div>

        {/* Cards com Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-3xl mb-2">📦</div>
            <div className="text-2xl font-bold text-gray-800">{products.length}</div>
            <div className="text-sm text-gray-600">Produtos na loja</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-3xl mb-2">👧</div>
            <div className="text-2xl font-bold text-gray-800">{products.filter(p => p.gender === "Feminino").length}</div>
            <div className="text-sm text-gray-600">Feminino</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-3xl mb-2">👨</div>
            <div className="text-2xl font-bold text-gray-800">{products.filter(p => p.gender === "Masculino").length}</div>
            <div className="text-sm text-gray-600">Masculino</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-3xl mb-2">👶</div>
            <div className="text-2xl font-bold text-gray-800">{products.filter(p => p.gender === "Infantil").length}</div>
            <div className="text-sm text-gray-600">Infantil</div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4">🔍 Filtrar por categoria</h2>
          <div className="flex gap-3 flex-wrap">
            {["todos", "Feminino", "Masculino", "Infantil"].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  filter === cat
                    ? "bg-[#7BC9C2] text-white shadow-lg"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {cat === "todos" ? "📦 Todos" : `${genderIcons[cat]} ${cat}`}
              </button>
            ))}
          </div>
        </div>

        {/* Grid de Produtos */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-[#7BC9C2] to-[#5fb3ac] text-white">
            <h2 className="text-lg font-bold">📸 {filteredProducts.length} produto(s)</h2>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-500 text-lg">Nenhum produto encontrado nesta categoria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {filteredProducts.map((product, index) => (
                <div
                  key={product.ref}
                  className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Posição */}
                  <div className="absolute top-3 left-3 bg-[#7BC9C2] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm z-10 relative">
                    #{index + 1}
                  </div>

                  {/* Imagem */}
                  <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <span className="text-4xl">📷</span>
                      </div>
                    )}
                  </div>

                  {/* Informações */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-xs text-gray-400 font-mono">REF {product.ref}</p>
                        <h3 className="text-sm font-bold text-gray-800 line-clamp-2">{product.name}</h3>
                      </div>
                      <span className="text-lg">{genderIcons[product.gender]}</span>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                      <span className="text-lg font-bold text-[#7BC9C2]">
                        R$ {product.price.toFixed(2).replace(".", ",")}
                      </span>
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {product.gender}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <p className="text-blue-900">
            <strong>💡 Info:</strong> Esta é a prévia exata de como seus produtos aparecem na loja! A ordem dos cards corresponde à posição que aparecem quando os clientes acessam o site. Use o botão "🔄 Reordenar" para mudar a sequência.
          </p>
        </div>
      </div>
    </div>
  );
}
