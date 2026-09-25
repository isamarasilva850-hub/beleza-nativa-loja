"use client";

import Link from "next/link";
import { useState } from "react";
import { products } from "@/data/products";
import { useReactiveStorage } from "@/hooks/useReactiveStorage";

interface ItemPedido {
  ref: string;
  name: string;
  color: string;
  price: number;
  quantity: number;
}

export default function MontarPedidoPage() {
  const [items, setItems] = useState<ItemPedido[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);

  // Observa mudanças nos produtos da Palmira em tempo real
  useReactiveStorage("belezanativa_product_uploads");

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.ref.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddItem = () => {
    if (!selectedProduct || !selectedColor || quantity < 1) return;

    const newItem: ItemPedido = {
      ref: selectedProduct.ref,
      name: selectedProduct.name,
      color: selectedColor,
      price: selectedProduct.price,
      quantity,
    };

    setItems([...items, newItem]);
    setSelectedProduct(null);
    setSelectedColor("");
    setQuantity(1);
    setSearchTerm("");
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const resumoTexto = `📦 PEDIDO\n\n${items
    .map((item) => `REF ${item.ref} - ${item.name} (${item.color})\nQtd: ${item.quantity} x R$ ${item.price.toFixed(2).replace(".", ",")} = R$ ${(item.price * item.quantity).toFixed(2).replace(".", ",")}`)
    .join("\n\n")}\n\n${"─".repeat(25)}\nTOTAL: R$ ${total.toFixed(2).replace(".", ",")}`;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-700 mb-4 block">
            ← Voltar
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">📦 Montar Pedido</h1>
          <p className="text-gray-600 mt-1">Crie pedidos rápidos para suas clientes</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Seção de Seleção */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
              {/* Busca de Produtos */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">🔍 Buscar Produto</label>
                <input
                  type="text"
                  placeholder="REF ou Nome do produto..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setSelectedProduct(null);
                    setSelectedColor("");
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#7BC9C2]"
                />
              </div>

              {/* Resultados da Busca */}
              {searchTerm && filteredProducts.length > 0 && (
                <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
                  {filteredProducts.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => {
                        setSelectedProduct(product);
                        setSelectedColor("");
                      }}
                      className={`w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-blue-50 transition-colors ${
                        selectedProduct?.id === product.id ? "bg-blue-100" : ""
                      }`}
                    >
                      <p className="font-semibold text-gray-800">
                        {product.ref} - {product.name}
                      </p>
                      <p className="text-sm text-gray-500">R$ {product.price.toFixed(2).replace(".", ",")}</p>
                    </button>
                  ))}
                </div>
              )}

              {/* Seleção de Cor */}
              {selectedProduct && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">🎨 Cor</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.variants.map((variant) => (
                      <button
                        key={variant.color}
                        onClick={() => setSelectedColor(variant.color)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          selectedColor === variant.color
                            ? "bg-[#7BC9C2] text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ backgroundColor: variant.colorHex, border: "1px solid #ccc" }}></span>
                        {variant.color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantidade */}
              {selectedProduct && selectedColor && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">📏 Quantidade</label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold px-4 py-2 rounded-lg"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center focus:outline-none focus:border-[#7BC9C2]"
                    />
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold px-4 py-2 rounded-lg"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Botão Adicionar */}
              {selectedProduct && selectedColor && (
                <button
                  onClick={handleAddItem}
                  className="w-full bg-[#7BC9C2] hover:bg-[#5fb3ac] text-white font-bold py-3 rounded-lg transition-colors"
                >
                  ✅ Adicionar ao Pedido
                </button>
              )}
            </div>
          </div>

          {/* Seção do Pedido (Lado Direito) */}
          <div className="lg:col-span-1 space-y-6">
            {/* Tabela de Itens */}
            {items.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">📋 Itens do Pedido</h2>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {items.map((item, index) => (
                    <div key={index} className="flex justify-between items-start bg-gray-50 p-3 rounded-lg">
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 font-mono">REF {item.ref}</p>
                        <p className="text-sm font-semibold text-gray-800 line-clamp-2">{item.name}</p>
                        <p className="text-xs text-gray-600">{item.color}</p>
                        <p className="text-sm text-[#7BC9C2] font-bold">
                          {item.quantity} x R$ {item.price.toFixed(2).replace(".", ",")}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(index)}
                        className="text-red-500 hover:text-red-700 font-bold text-lg ml-2"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-700">Total:</span>
                    <span className="text-2xl font-bold text-[#7BC9C2]">
                      R$ {total.toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Resumo Copiável */}
            {items.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-3">📋 Resumo Copiável</h2>
                <div
                  onClick={() => {
                    navigator.clipboard.writeText(resumoTexto);
                    alert("✅ Copiado para a área de transferência!");
                  }}
                  className="bg-gray-50 p-4 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors whitespace-pre-wrap text-xs font-mono border-2 border-dashed border-gray-300 hover:border-[#7BC9C2]"
                >
                  {resumoTexto}
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(resumoTexto);
                    alert("✅ Copiado para a área de transferência!");
                  }}
                  className="w-full mt-3 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-lg transition-colors"
                >
                  📋 Copiar Resumo
                </button>
              </div>
            )}

            {/* Botão Limpar */}
            {items.length > 0 && (
              <button
                onClick={() => setItems([])}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded-lg transition-colors"
              >
                🗑️ Limpar Pedido
              </button>
            )}

            {/* Mensagem Vazia */}
            {items.length === 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                <p className="text-gray-500 text-sm">Nenhum item adicionado ainda</p>
                <p className="text-gray-400 text-xs mt-1">Busque e adicione produtos</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
