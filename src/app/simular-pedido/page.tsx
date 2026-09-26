'use client';

import { useState } from 'react';
import { products } from '@/data/products';

interface CartItem {
  productId: number;
  ref: string;
  name: string;
  price: number;
  color: string;
  size: string;
  quantity: number;
}

export default function SimularPedidoPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [phone, setPhone] = useState('');
  const [showProducts, setShowProducts] = useState(false);

  const addToCart = (product: any) => {
    const newItem: CartItem = {
      productId: product.id,
      ref: product.ref || `REF-${product.id}`,
      name: product.name,
      price: product.price,
      color: product.variants?.[0]?.color || 'Único',
      size: product.variants?.[0]?.sizes?.[0] || 'Único',
      quantity: 1,
    };

    const existing = cart.find(
      (item) =>
        item.productId === newItem.productId &&
        item.color === newItem.color &&
        item.size === newItem.size
    );

    if (existing) {
      setCart(
        cart.map((item) =>
          item === existing ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCart([...cart, newItem]);
    }
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter((item) => item.productId !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    setCart(
      cart.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const generateMessage = () => {
    const resume = cart
      .map((item) => {
        return `REF ${item.ref} - ${item.name}\nCor: ${item.color} | Tam: ${item.size}\nQtd: ${item.quantity} x R$ ${item.price.toFixed(2).replace('.', ',')} = R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}`;
      })
      .join('\n\n');

    return `📦 PROPOSTA DE PEDIDO\n\n${resume}\n\n${'─'.repeat(40)}\nTOTAL: R$ ${totalPrice.toFixed(2).replace('.', ',')}`;
  };

  const sendWhatsApp = () => {
    if (!phone || cart.length === 0) {
      alert('Preencha o telefone e adicione produtos!');
      return;
    }

    const message = generateMessage();
    const cleanPhone = phone.replace(/\D/g, '');
    window.open(`https://wa.me/55${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">📦 Simular Pedido</h1>
          <p className="text-lg text-gray-600">Monte um pedido e envie direto pra cliente via WhatsApp</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* PRODUTOS */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">🏪 Catálogo</h2>

              {!showProducts ? (
                <button
                  onClick={() => setShowProducts(true)}
                  className="w-full bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg font-bold transition"
                >
                  Ver {products.length} Produtos
                </button>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-teal-300"
                    >
                      <div>
                        <p className="text-xs text-gray-500 font-mono">REF {product.ref || product.id}</p>
                        <p className="font-semibold text-gray-900">{product.name}</p>
                        <p className="text-sm text-teal-600 font-bold mt-1">
                          R$ {product.price.toFixed(2).replace('.', ',')}
                        </p>
                      </div>
                      <button
                        onClick={() => addToCart(product)}
                        className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition"
                      >
                        +
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* CARRINHO */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">🛒 Pedido ({cart.length})</h2>

              {cart.length > 0 ? (
                <div className="space-y-4">
                  <div className="space-y-3 max-h-64 overflow-y-auto pb-4 border-b">
                    {cart.map((item) => (
                      <div key={item.productId} className="bg-gray-50 p-3 rounded">
                        <p className="text-xs text-gray-500 font-mono">REF {item.ref}</p>
                        <p className="text-sm font-semibold text-gray-800">{item.name}</p>
                        <p className="text-xs text-gray-600 mb-2">{item.color}</p>
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex gap-1">
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                              className="px-2 py-1 bg-gray-200 text-xs font-bold rounded hover:bg-gray-300"
                            >
                              −
                            </button>
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) =>
                                updateQuantity(item.productId, parseInt(e.target.value) || 1)
                              }
                              className="w-10 px-1 text-xs text-center border rounded"
                            />
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              className="px-2 py-1 bg-gray-200 text-xs font-bold rounded hover:bg-gray-300"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.productId)}
                            className="text-red-600 hover:text-red-700 text-sm font-bold"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span className="text-teal-600">R$ {totalPrice.toFixed(2).replace('.', ',')}</span>
                    </div>

                    <input
                      type="tel"
                      placeholder="(xx) xxxxx-xxxx"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-teal-500 focus:outline-none"
                    />

                    <button
                      onClick={sendWhatsApp}
                      className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg font-bold transition"
                    >
                      💬 Enviar WhatsApp
                    </button>

                    <button
                      onClick={() => {
                        setCart([]);
                        setPhone('');
                      }}
                      className="w-full bg-red-100 hover:bg-red-200 text-red-600 px-4 py-2 rounded-lg font-bold transition"
                    >
                      🗑️ Limpar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Carrinho vazio</p>
                  <p className="text-sm mt-2">Adicione produtos à esquerda</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* INFO */}
        <div className="mt-8 bg-teal-50 p-6 rounded-lg border border-teal-200">
          <p className="text-sm text-teal-900">
            <strong>💡 Como funciona:</strong> Monte um pedido do catálogo, coloque o telefone da cliente, clique em "Enviar WhatsApp" e a mensagem abre pronta pra você enviar! 🚀
          </p>
        </div>
      </div>
    </div>
  );
}
