"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";

interface Partner {
  id: string;
  name: string;
  company: string;
  phone: string;
  city: string;
  state: string;
  status: "ativo" | "inativo" | "pendente";
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
  price: number;
  name: string;
}

interface CartItem {
  productId: number;
  ref: string;
  name: string;
  price: number;
  color: string;
  size: string;
  quantity: number;
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
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);

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

    // Carregar carrinho salvo
    const savedCart = localStorage.getItem(`catalogo_cart_${id}`);
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }

    // Carregar produtos (simplificado)
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(() => setProducts([]));

    setLoading(false);
  }, [id]);

  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem(`catalogo_cart_${id}`, JSON.stringify(newCart));
  };

  const addToCart = (product: PurchasedProduct, productData: Product) => {
    const existingItem = cart.find(
      (item) => item.productId === product.productId && item.color === product.color && item.size === product.size
    );

    if (existingItem) {
      const updated = cart.map((item) =>
        item === existingItem ? { ...item, quantity: item.quantity + 1 } : item
      );
      saveCart(updated);
    } else {
      const newItem: CartItem = {
        productId: product.productId,
        ref: product.ref,
        name: product.name,
        price: productData.price,
        color: product.color,
        size: product.size,
        quantity: 1,
      };
      saveCart([...cart, newItem]);
    }
  };

  const removeFromCart = (productId: number, color: string, size: string) => {
    const updated = cart.filter(
      (item) => !(item.productId === productId && item.color === color && item.size === size)
    );
    saveCart(updated);
  };

  const updateQuantity = (productId: number, color: string, size: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId, color, size);
      return;
    }
    const updated = cart.map((item) =>
      item.productId === productId && item.color === color && item.size === size
        ? { ...item, quantity }
        : item
    );
    saveCart(updated);
  };

  const getMarkupPrice = (basePrice: number) => {
    const markup = partner?.markupPercentage || 0;
    return basePrice * (1 + markup / 100);
  };

  const totalPrice = cart.reduce((sum, item) => sum + getMarkupPrice(item.price) * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const generateResume = () => {
    const resume = cart
      .map((item) => {
        const finalPrice = getMarkupPrice(item.price);
        return `REF ${item.ref} - ${item.name} (${item.color}/${item.size})\nQtd: ${item.quantity} x R$ ${finalPrice.toFixed(2).replace(".", ",")} = R$ ${(finalPrice * item.quantity).toFixed(2).replace(".", ",")}`;
      })
      .join("\n\n");

    return `📦 PEDIDO\n\n${resume}\n\n${"─".repeat(35)}\nTOTAL: R$ ${totalPrice.toFixed(2).replace(".", ",")}`;
  };

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

  const purchasedProductIds = new Set(purchases.map((p) => p.productId));
  const catalogProducts = products.filter((p) => purchasedProductIds.has(p.id));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {partner.logo && (
              <img src={partner.logo} alt={partner.company} className="h-10 w-auto" />
            )}
            <div>
              <h1 className="text-lg font-bold text-gray-800">{partner.company || partner.name}</h1>
              <p className="text-xs text-gray-500">{partner.city}/{partner.state}</p>
            </div>
          </div>
          <button
            onClick={() => setShowCart(!showCart)}
            className="relative px-4 py-2 bg-[#7BC9C2] text-white rounded-lg text-sm font-bold hover:bg-[#6ab8b1]"
          >
            🛒 Carrinho ({totalItems})
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Carrinho Lateral */}
        {showCart && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border-l-4 border-[#7BC9C2]">
            {cart.length > 0 ? (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-800">🛒 Seu Carrinho</h2>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {cart.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-start bg-gray-50 p-3 rounded-lg">
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 font-mono">REF {item.ref}</p>
                        <p className="text-sm font-semibold text-gray-800">{item.name}</p>
                        <p className="text-xs text-gray-600">{item.color} / {item.size}</p>
                        <p className="text-sm text-[#7BC9C2] font-bold mt-1">
                          R$ {getMarkupPrice(item.price).toFixed(2).replace(".", ",")} x {item.quantity}
                        </p>
                      </div>
                      <div className="flex gap-1 ml-2">
                        <button
                          onClick={() => updateQuantity(item.productId, item.color, item.size, item.quantity - 1)}
                          className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs font-bold hover:bg-gray-300"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(item.productId, item.color, item.size, parseInt(e.target.value) || 1)
                          }
                          className="w-10 px-1 py-1 border border-gray-300 rounded text-xs text-center"
                        />
                        <button
                          onClick={() => updateQuantity(item.productId, item.color, item.size, item.quantity + 1)}
                          className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs font-bold hover:bg-gray-300"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeFromCart(item.productId, item.color, item.size)}
                          className="px-2 py-1 bg-red-100 text-red-600 rounded text-xs font-bold hover:bg-red-200"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total e Ações */}
                <div className="border-t border-gray-200 pt-4 space-y-3">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-[#7BC9C2] text-2xl">R$ {totalPrice.toFixed(2).replace(".", ",")}</span>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generateResume());
                      alert("✅ Pedido copiado!");
                    }}
                    className="w-full py-2 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600"
                  >
                    📋 Copiar Resumo
                  </button>
                  <button
                    onClick={() => {
                      window.open(`https://wa.me/?text=${encodeURIComponent(generateResume())}`, "_blank");
                    }}
                    className="w-full py-2 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600"
                  >
                    💬 Enviar WhatsApp
                  </button>
                  <button
                    onClick={() => saveCart([])}
                    className="w-full py-2 bg-red-100 text-red-600 rounded-lg font-bold hover:bg-red-200"
                  >
                    🗑️ Limpar Carrinho
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Carrinho vazio</p>
                <p className="text-gray-400 text-sm mt-1">Adicione produtos abaixo!</p>
              </div>
            )}
          </div>
        )}

        {/* Produtos */}
        {catalogProducts.length > 0 ? (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              {catalogProducts.length} {catalogProducts.length === 1 ? "Produto" : "Produtos"} Disponíveis
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {catalogProducts.map((product) => {
                const purchaseInfo = purchases.find((p) => p.productId === product.id);
                const finalPrice = getMarkupPrice(product.price);
                const inCart = cart.some((item) => item.productId === product.id && item.color === purchaseInfo?.color);

                return (
                  <div
                    key={product.id}
                    className={`bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all ${
                      inCart ? "border-2 border-[#7BC9C2]" : "border border-gray-200"
                    }`}
                  >
                    {/* Image */}
                    <div className="relative h-48 bg-gray-100">
                      {product.images[0] ? (
                        <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-300">
                          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      {inCart && <div className="absolute top-2 right-2 bg-[#7BC9C2] text-white px-3 py-1 rounded-full text-xs font-bold">✓ No carrinho</div>}
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <p className="text-xs text-gray-400 font-mono mb-1">REF {product.ref}</p>
                      <h3 className="font-bold text-gray-800 mb-2 line-clamp-2">{product.name}</h3>

                      {purchaseInfo && (
                        <div className="mb-3">
                          <p className="text-xs text-gray-500 mb-1">
                            Cor: <span className="font-semibold text-gray-700">{purchaseInfo.color}</span>
                          </p>
                          <div className="flex items-baseline gap-2">
                            <span className="text-lg font-bold text-[#7BC9C2]">
                              R$ {finalPrice.toFixed(2).replace(".", ",")}
                            </span>
                            <span className="text-xs text-gray-400">
                              (Preço: R$ {product.price.toFixed(2).replace(".", ",")})
                            </span>
                          </div>
                        </div>
                      )}

                      {purchaseInfo && (
                        <button
                          onClick={() => addToCart(purchaseInfo, product)}
                          className={`w-full py-2 rounded-lg text-sm font-bold transition-colors ${
                            inCart
                              ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                              : "bg-[#7BC9C2] text-white hover:bg-[#6ab8b1]"
                          }`}
                        >
                          {inCart ? "✓ Adicionado" : "🛒 Adicionar"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500">Catálogo em construção</p>
            <p className="text-gray-400 text-sm">Seus produtos aparecerão aqui quando fizer seu primeiro pedido</p>
          </div>
        )}
      </div>
    </div>
  );
}
