'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePartners } from '@/hooks/usePartners';
import { useOrders } from '@/hooks/useOrders';

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

export default function SimularPedidoRevendedora() {
  const { partners, loadPartners } = usePartners();
  const { createOrder } = useOrders();
  const [selectedPartnerId, setSelectedPartnerId] = useState('');
  const [selectedPartner, setSelectedPartner] = useState<any>(null);
  const [purchases, setPurchases] = useState<PurchasedProduct[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [partnerBusca, setPartnerBusca] = useState('');
  const [buscaProduto, setBuscaProduto] = useState('');
  const [todosProdutos, setTodosProdutos] = useState<any[]>([]);

  useEffect(() => {
    loadPartners();
    fetch('/api/products')
      .then((r) => r.json())
      .then((lista) => {
        if (Array.isArray(lista)) setTodosProdutos(lista);
      })
      .catch((err) => console.error('Erro ao carregar produtos', err));
  }, [loadPartners]);

  const rotuloRevendedora = (p: any) => `${p.company || p.name} - ${p.city}/${p.state}`;

  const combinacoesDoProduto = (p: any): { color: string; size: string }[] => {
    const variantes = p.variants?.length
      ? p.variants
      : (p.colors || []).map((c: any) => ({
          color: c.color_name,
          sizes: ['P', 'M', 'G', 'GG'].filter((t) => Number(c[`qty_${t.toLowerCase()}`]) > 0),
        }));
    return variantes.flatMap((v: any) => (v.sizes || []).map((s: string) => ({ color: v.color, size: s })));
  };

  const resultadosBusca = buscaProduto.trim()
    ? todosProdutos
        .filter((p) => {
          const termo = buscaProduto.trim().toLowerCase();
          return p.ref?.toLowerCase().includes(termo) || p.name?.toLowerCase().includes(termo);
        })
        .slice(0, 8)
    : [];

  const adicionarDaBusca = (p: any, color: string, size: string) => {
    addToCart({
      productId: p.id,
      ref: p.ref,
      name: p.name,
      price: Number(p.price) || 0,
      color,
      size,
    } as any);
  };

  useEffect(() => {
    if (selectedPartnerId) {
      const partner = partners.find((p) => p.id === selectedPartnerId) || null;
      setSelectedPartner(partner);

      const savedPurchases = localStorage.getItem(`belezanativa_purchases_${selectedPartnerId}`);
      if (savedPurchases) {
        setPurchases(JSON.parse(savedPurchases));
      } else {
        setPurchases([]);
      }

      setCart([]);
    }
  }, [selectedPartnerId, partners]);

  const addToCart = (product: PurchasedProduct) => {
    const existingItem = cart.find(
      (item) => item.productId === product.productId && item.color === product.color && item.size === product.size
    );

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item === existingItem ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      const newItem: CartItem = {
        productId: product.productId,
        ref: product.ref,
        name: product.name,
        price: product.price,
        color: product.color,
        size: product.size,
        quantity: 1,
      };
      setCart([...cart, newItem]);
    }
  };

  const removeFromCart = (productId: number, color: string, size: string) => {
    setCart(
      cart.filter(
        (item) => !(item.productId === productId && item.color === color && item.size === size)
      )
    );
  };

  const updateQuantity = (productId: number, color: string, size: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId, color, size);
      return;
    }
    setCart(
      cart.map((item) =>
        item.productId === productId && item.color === color && item.size === size
          ? { ...item, quantity }
          : item
      )
    );
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const generateResume = () => {
    const resume = cart
      .map((item) => {
        return `REF ${item.ref} - ${item.name} (${item.color}/${item.size})\nQtd: ${item.quantity} x R$ ${item.price.toFixed(2).replace('.', ',')} = R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}`;
      })
      .join('\n\n');

    return `📦 PEDIDO DE ${selectedPartner?.company || selectedPartner?.name}\n\n${resume}\n\n${'─'.repeat(35)}\nTOTAL: R$ ${totalPrice.toFixed(2).replace('.', ',')}`;
  };

  const createPedido = async () => {
    if (!selectedPartner || cart.length === 0) {
      alert('Selecione uma revendedora e adicione produtos');
      return;
    }

    setCreatingOrder(true);
    try {
      await createOrder({
        partnerId: selectedPartner.id,
        partnerName: selectedPartner.company || selectedPartner.name,
        partnerPhone: selectedPartner.phone,
        items: cart,
        total: totalPrice,
        date: new Date().toISOString().split('T')[0],
        status: 'pendente',
      });
      alert('✅ Pedido criado com sucesso! Vá para Pedidos das Revendedoras');
      setCart([]);
    } catch (error) {
      alert('❌ Erro ao criar pedido');
      console.error(error);
    } finally {
      setCreatingOrder(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-700 mb-4 block">
            ← Voltar
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">📦 Simulador de Pedido - Revendedora</h1>
          <p className="text-gray-600 mt-1">Simule um pedido da revendedora antes de enviar</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Seção Esquerda - Seleção */}
          <div className="lg:col-span-2">
            {/* Seleção de Revendedora */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h2 className="font-bold text-gray-800 mb-4">👥 Selecione a Revendedora</h2>
              <input
                list="lista-revendedoras"
                value={partnerBusca}
                placeholder="Digite o nome da revendedora..."
                onChange={(e) => {
                  setPartnerBusca(e.target.value);
                  const encontrada = partners.find((p) => rotuloRevendedora(p) === e.target.value);
                  setSelectedPartnerId(encontrada?.id || '');
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]"
              />
              <datalist id="lista-revendedoras">
                {partners.map((p) => (
                  <option key={p.id} value={rotuloRevendedora(p)} />
                ))}
              </datalist>
            </div>

            {/* Produtos da Revendedora */}
            {selectedPartner && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="font-bold text-gray-800 mb-4">📦 Produtos Disponíveis</h2>
                {purchases.length > 0 ? (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {purchases.map((product, idx) => {
                      const inCart = cart.some(
                        (item) => item.productId === product.productId && item.color === product.color
                      );
                      return (
                        <div
                          key={idx}
                          className={`flex justify-between items-center p-4 rounded-lg border-2 ${
                            inCart ? "bg-blue-50 border-[#7BC9C2]" : "bg-gray-50 border-gray-200"
                          }`}
                        >
                          <div>
                            <p className="text-xs text-gray-500 font-mono">REF {product.ref}</p>
                            <p className="font-semibold text-gray-800">{product.name}</p>
                            <p className="text-xs text-gray-600">
                              {product.color} / {product.size}
                            </p>
                            <p className="text-sm text-[#7BC9C2] font-bold mt-1">
                              R$ {product.price.toFixed(2).replace(".", ",")}
                            </p>
                          </div>
                          <button
                            onClick={() => addToCart(product)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                              inCart
                                ? "bg-gray-200 text-gray-700"
                                : "bg-[#7BC9C2] text-white hover:bg-[#6ab8b1]"
                            }`}
                          >
                            {inCart ? "✓" : "+"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    Esta revendedora não tem produtos cadastrados ainda
                  </p>
                )}
              </div>
            )}

            {selectedPartner && (
              <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
                <h2 className="font-bold text-gray-800 mb-4">🔎 Buscar produto pela REF ou nome</h2>
                <input
                  type="text"
                  value={buscaProduto}
                  placeholder="Ex: 562 ou conjunto renda"
                  onChange={(e) => setBuscaProduto(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]"
                />
                <div className="mt-4 space-y-3">
                  {resultadosBusca.map((p) => (
                    <div key={p.id} className="p-4 rounded-lg border-2 border-gray-200 bg-gray-50">
                      <p className="text-xs text-gray-500 font-mono">REF {p.ref}</p>
                      <p className="font-semibold text-gray-800">{p.name}</p>
                      <p className="text-sm text-[#7BC9C2] font-bold mb-2">R$ {(Number(p.price) || 0).toFixed(2).replace('.', ',')}</p>
                      <div className="flex flex-wrap gap-2">
                        {combinacoesDoProduto(p).map((c) => (
                          <button
                            key={`${c.color}-${c.size}`}
                            onClick={() => adicionarDaBusca(p, c.color, c.size)}
                            className="px-3 py-1 rounded-lg text-xs font-bold bg-[#7BC9C2] text-white hover:bg-[#6ab8b1]"
                          >
                            + {c.color} / {c.size}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                  {buscaProduto.trim() && resultadosBusca.length === 0 && (
                    <p className="text-gray-500 text-center py-4">Nenhum produto encontrado</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Seção Direita - Carrinho */}
          <div>
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
              <h2 className="font-bold text-gray-800 mb-4">🛒 Resumo do Pedido</h2>

              {cart.length > 0 ? (
                <div className="space-y-4">
                  <div className="space-y-3 max-h-64 overflow-y-auto border-b border-gray-200 pb-4">
                    {cart.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-start bg-gray-50 p-3 rounded">
                        <div className="flex-1 text-xs">
                          <p className="text-gray-500 font-mono">REF {item.ref}</p>
                          <p className="font-semibold text-gray-700 line-clamp-2">{item.name}</p>
                          <p className="text-gray-600">{item.color}</p>
                          <p className="text-[#7BC9C2] font-bold">
                            {item.quantity} x R$ {item.price.toFixed(2).replace(".", ",")}
                          </p>
                        </div>
                        <div className="flex gap-1 ml-2">
                          <button
                            onClick={() => updateQuantity(item.productId, item.color, item.size, item.quantity - 1)}
                            className="px-2 py-1 bg-gray-200 text-xs font-bold rounded hover:bg-gray-300"
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
                            className="w-8 px-1 py-1 border border-gray-300 rounded text-xs text-center"
                          />
                          <button
                            onClick={() => updateQuantity(item.productId, item.color, item.size, item.quantity + 1)}
                            className="px-2 py-1 bg-gray-200 text-xs font-bold rounded hover:bg-gray-300"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center font-bold">
                      <span>Total:</span>
                      <span className="text-[#7BC9C2] text-xl">
                        R$ {totalPrice.toFixed(2).replace(".", ",")}
                      </span>
                    </div>

                    <button
                      onClick={createPedido}
                      disabled={creatingOrder}
                      className="w-full py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 disabled:opacity-50"
                    >
                      {creatingOrder ? '⏳ Criando...' : '✅ Finalizar Pedido'}
                    </button>

                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(generateResume());
                        alert('✅ Resumo copiado!');
                      }}
                      className="w-full py-2 bg-blue-500 text-white rounded-lg text-sm font-bold hover:bg-blue-600"
                    >
                      📋 Copiar Resumo
                    </button>

                    <button
                      onClick={() => {
                        window.open(`https://wa.me/${selectedPartner?.phone}?text=${encodeURIComponent(generateResume())}`, '_blank');
                      }}
                      className="w-full py-2 bg-teal-500 text-white rounded-lg text-sm font-bold hover:bg-teal-600"
                    >
                      💬 Enviar WhatsApp
                    </button>

                    <button
                      onClick={() => setCart([])}
                      className="w-full py-2 bg-red-100 text-red-600 rounded-lg text-sm font-bold hover:bg-red-200"
                    >
                      🗑️ Limpar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <p>Carrinho vazio</p>
                  <p className="text-sm">Adicione produtos à esquerda</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
