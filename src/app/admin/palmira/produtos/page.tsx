"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import { notifyStorageChange } from "@/lib/storageEvents";

interface UploadedProduct {
  ref: string;
  name: string;
  price: number;
  color: string;
  images: string[];
  sizes: string[];
  quantity: number;
  timestamp: string;
}

export default function PalmiraProdutosPage() {
  const [products, setProducts] = useState<UploadedProduct[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const uploads = JSON.parse(localStorage.getItem("belezanativa_product_uploads") || "[]");
    setProducts(uploads);
  }, []);

  const filteredProducts = products.filter(
    (p) =>
      p.ref.toLowerCase().includes(search.toLowerCase()) ||
      p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href="/admin/palmira" className="text-sm text-gray-500 hover:text-gray-700 mb-4 block">
            ← Voltar
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">📦 Produtos Cadastrados</h1>
          <p className="text-gray-600 mt-1">Total: {filteredProducts.length} produtos</p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="🔍 Buscar por referência ou nome..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#7BC9C2]"
          />
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.ref} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
                {/* Image */}
                <div className="relative h-48 bg-gray-100">
                  {product.images[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-300">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  {product.images.length > 1 && (
                    <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {product.images.length} fotos
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <p className="text-xs text-gray-400 font-mono mb-1">REF {product.ref}</p>
                  <h3 className="font-bold text-gray-800 mb-2 line-clamp-2">{product.name}</h3>

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-bold text-[#7BC9C2]">
                      R$ {product.price.toFixed(2).replace(".", ",")}
                    </span>
                    {product.color && (
                      <div className="flex items-center gap-2">
                        <div
                          className="w-5 h-5 rounded-full border border-gray-300"
                          style={{ backgroundColor: product.color }}
                        />
                        <span className="text-xs text-gray-600">{product.color}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 text-xs text-gray-600">
                    <p>📏 Tamanhos: {product.sizes.join(", ")}</p>
                    <p>📦 Quantidade: {product.quantity}</p>
                    <p className="text-gray-400">
                      {new Date(product.timestamp).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl">
            <p className="text-gray-500">Nenhum produto encontrado</p>
            <Link href="/admin/palmira/upload" className="text-[#7BC9C2] hover:underline text-sm mt-2 inline-block">
              Adicionar produto →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
