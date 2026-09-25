"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";

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
  logo?: string;
  markupPercentage?: number;
}

interface PurchasedProduct {
  productId: number;
  ref: string;
  quantity: number;
  color: string;
  size: string;
  purchaseDate: string;
}

interface Product {
  id: number;
  ref: string;
  name: string;
  price: number;
  images: string[];
  category: string;
}

export default function CatalogoRevendedora() {
  const params = useParams();
  const id = params?.id as string;

  const [partner, setPartner] = useState<Partner | null>(null);
  const [purchases, setPurchases] = useState<PurchasedProduct[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Carregar dados do parceiro
    const saved = localStorage.getItem("belezanativa_partners");
    if (saved) {
      const partners = JSON.parse(saved);
      const foundPartner = partners.find((p: Partner) => p.id === id);
      setPartner(foundPartner || null);
    }

    // Carregar compras do parceiro
    const savedPurchases = localStorage.getItem(`belezanativa_purchases_${id}`);
    if (savedPurchases) {
      setPurchases(JSON.parse(savedPurchases));
    }

    // Carregar produtos (simplificado - em produção viraria de uma API)
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(() => setProducts([]));

    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Carregando catálogo...</p>
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-800 text-lg font-semibold">Catálogo não encontrado</p>
          <p className="text-gray-500 text-sm mt-1">Verifique o link e tente novamente</p>
        </div>
      </div>
    );
  }

  // Buscar produtos comprados
  const purchasedProductIds = new Set(purchases.map((p) => p.productId));
  const catalogProducts = products.filter((p) => purchasedProductIds.has(p.id));

  // Calcular preço com markup
  const getMarkupPrice = (basePrice: number) => {
    const markup = partner.markupPercentage || 0;
    return basePrice * (1 + markup / 100);
  };

  const copyLink = () => {
    const url = `${window.location.origin}/catalogo-revendedora/${id}`;
    navigator.clipboard.writeText(url);
    alert("Link copiado! Compartilhe com suas clientes");
  };

  const shareWhatsApp = () => {
    const url = `${window.location.origin}/catalogo-revendedora/${id}`;
    const msg = `Olá! Confira o catálogo exclusivo de ${partner.company || partner.name}: ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {partner.logo && (
                <img
                  src={partner.logo}
                  alt={partner.company}
                  className="h-12 w-auto"
                />
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{partner.company || partner.name}</h1>
                <p className="text-sm text-gray-500">{partner.city}/{partner.state}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={copyLink}
                className="px-4 py-2 bg-[#7BC9C2] text-white rounded-lg text-sm font-semibold hover:bg-[#6ab8b1]"
              >
                📋 Copiar Link
              </button>
              <button
                onClick={shareWhatsApp}
                className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-semibold hover:bg-green-600"
              >
                💬 Compartilhar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {catalogProducts.length > 0 ? (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              {catalogProducts.length} {catalogProducts.length === 1 ? "Produto" : "Produtos"} em Catálogo
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {catalogProducts.map((product) => {
                const purchaseInfo = purchases.find((p) => p.productId === product.id);
                const finalPrice = getMarkupPrice(product.price);

                return (
                  <div key={product.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
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
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <p className="text-xs text-gray-400 font-mono mb-1">REF {product.ref}</p>
                      <h3 className="font-bold text-gray-800 mb-2 line-clamp-2">{product.name}</h3>

                      <div className="mb-3">
                        {purchaseInfo && (
                          <p className="text-xs text-gray-500 mb-1">
                            Cor: <span className="font-semibold text-gray-700">{purchaseInfo.color}</span>
                          </p>
                        )}
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-bold text-[#7BC9C2]">
                            R$ {finalPrice.toFixed(2).replace(".", ",")}
                          </span>
                          {partner.markupPercentage && partner.markupPercentage > 0 && (
                            <span className="text-xs text-gray-400">
                              (Custo: R$ {product.price.toFixed(2).replace(".", ",")})
                            </span>
                          )}
                        </div>
                      </div>

                      {purchaseInfo && (
                        <div className="pt-3 border-t border-gray-100">
                          <p className="text-xs text-gray-500">Quantidade em estoque: {purchaseInfo.quantity}</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m0 0l8 4m-8-4v10l8 4m0-10l8 4m-8-4v10l8 4m0-10l-8-4" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Catálogo em construção</h2>
            <p className="text-gray-500 text-sm">Seus produtos aparecerão aqui assim que fizer seu primeiro pedido</p>
          </div>
        )}
      </div>
    </div>
  );
}
