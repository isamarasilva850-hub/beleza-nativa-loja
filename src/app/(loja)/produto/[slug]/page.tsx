"use client";

import { useState, useEffect, use } from "react";
import { products } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { getStockQuantity } from "@/lib/stock";
import Link from "next/link";
import Image from "next/image";

export default function ProdutoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const product = products.find((p) => p.slug === slug);
  const { addItem } = useCart();
  const { isLoggedIn } = useAuth();

  const [selectedVariant, setSelectedVariant] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [stockMap, setStockMap] = useState<Record<string, number>>({});
  const [showSizeChart, setShowSizeChart] = useState(false);

  useEffect(() => {
    if (!product) return;
    const map: Record<string, number> = {};
    product.variants.forEach((v) => {
      v.sizes.forEach((s) => {
        map[`${v.color}-${s}`] = getStockQuantity(product.ref, v.color, s);
      });
    });
    setStockMap(map);
  }, [product]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Produto não encontrado</h1>
        <Link href="/" className="text-primary hover:underline">Voltar para a loja</Link>
      </div>
    );
  }

  const variant = product.variants[selectedVariant];
  const retailPrice = product.price * 2;
  const priceToCart = isLoggedIn ? product.price : retailPrice;

  const getStock = (color: string, size: string) => stockMap[`${color}-${size}`] ?? -1;
  const selectedStock = selectedSize ? getStock(variant.color, selectedSize) : -1;

  const handleAdd = () => {
    if (!selectedSize) return;
    addItem({
      productId: product.id,
      ref: product.ref,
      name: product.name,
      price: priceToCart,
      color: variant.color,
      colorHex: variant.colorHex,
      size: selectedSize,
      image: product.images[0] || "",
    }, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    setQuantity(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <nav className="text-xs text-gray-400 mb-6 flex items-center gap-1">
        <Link href="/" className="hover:text-primary">Início</Link>
        <span>/</span>
        <span className="text-gray-600">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden relative">
          {product.images.length > 0 ? (
            <Image
              src={product.images[0]}
              alt={`${product.ref} - ${product.name}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-300">
              <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>

        <div>
          <p className="text-xs text-gray-400 font-mono mb-1">REF {product.ref}</p>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h1>
          <p className="text-sm text-gray-500 mb-4">{product.category} · {product.gender}</p>

          <div className="mb-6">
            <p className="text-3xl font-bold text-primary-dark">
              R$ {retailPrice.toFixed(2).replace(".", ",")}
            </p>
            <p className="text-xs text-gray-400 mt-1">Preço de varejo (uso próprio)</p>

            {isLoggedIn ? (
              <>
                <div className="mt-2 bg-primary/10 border border-primary/20 rounded-lg px-3 py-2">
                  <p className="text-lg font-bold text-primary">
                    R$ {product.price.toFixed(2).replace(".", ",")}
                  </p>
                  <p className="text-xs text-primary/70">Preço de revenda (atacado)</p>
                </div>

                <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-xs font-bold text-gray-600 mb-3">💰 SEU LUCRO</p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Lucro por unidade:</span>
                      <span className="text-lg font-bold text-green-600">
                        R$ {(retailPrice - product.price).toFixed(2).replace(".", ",")}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-green-200">
                      <span className="text-sm text-gray-600">Margem de lucro:</span>
                      <span className="text-lg font-bold text-green-600">
                        {((((retailPrice - product.price) / retailPrice) * 100).toFixed(1)).replace(".", ",")}%
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-green-200">
                    <p className="text-[11px] text-green-700">
                      Você compra por R$ {product.price.toFixed(2).replace(".", ",")} e suas clientes pagam R$ {retailPrice.toFixed(2).replace(".", ",")}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <Link href="/minha-conta" className="text-xs text-primary mt-1 hover:underline block">
                Logue-se para ver o preço de revenda e seu lucro
              </Link>
            )}
          </div>

          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-700 mb-2">
              Cor: <span className="font-normal text-gray-500">{variant.color}</span>
            </p>
            <div className="flex gap-2">
              {product.variants.map((v, i) => (
                <button
                  key={i}
                  onClick={() => { setSelectedVariant(i); setSelectedSize(""); }}
                  className={`w-10 h-10 rounded-full border-2 transition-all ${
                    selectedVariant === i
                      ? "border-primary scale-110 shadow-md"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                  style={{ backgroundColor: v.colorHex }}
                  title={v.color}
                />
              ))}
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-gray-700">Tamanho:</p>
              <button
                onClick={() => setShowSizeChart(true)}
                className="text-xs text-primary hover:underline font-semibold"
              >
                📏 Ver tabela
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {variant.sizes.map((size) => {
                const stock = getStock(variant.color, size);
                const notConfigured = stock === -1;
                const outOfStock = !notConfigured && stock <= 0;
                const isSelected = selectedSize === size;
                return (
                  <button
                    key={size}
                    onClick={() => !outOfStock && setSelectedSize(size)}
                    disabled={outOfStock}
                    className={`relative min-w-[60px] px-3 py-2 rounded-lg text-sm font-semibold border transition-all ${
                      outOfStock
                        ? "border-gray-200 bg-gray-50 text-gray-300 cursor-not-allowed line-through"
                        : isSelected
                        ? "border-primary bg-primary text-white shadow-md"
                        : "border-gray-200 bg-white text-gray-700 hover:border-primary"
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>{size}</span>
                      <span className={`text-xs font-normal ${
                        outOfStock ? "text-gray-400" : stock <= 3 ? "text-amber-600 font-bold" : "text-gray-500"
                      }`}>
                        ({notConfigured ? "?" : stock})
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
            {selectedSize && selectedStock > 0 && selectedStock !== -1 && selectedStock <= 5 && (
              <p className="text-xs text-amber-600 mt-2 font-medium">
                Restam apenas {selectedStock} unidade(s)!
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center border border-gray-200 rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2.5 text-gray-600 hover:bg-gray-100 rounded-l-lg"
              >
                -
              </button>
              <span className="px-4 py-2.5 text-sm font-bold min-w-[40px] text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2.5 text-gray-600 hover:bg-gray-100 rounded-r-lg"
              >
                +
              </button>
            </div>
            <button
              onClick={handleAdd}
              disabled={!selectedSize}
              className={`flex-1 py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                added
                  ? "bg-green-500 text-white"
                  : !selectedSize
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-primary text-white hover:bg-primary-dark"
              }`}
            >
              {added ? (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  ADICIONADO!
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  {selectedSize ? "ADICIONAR À SACOLA" : "SELECIONE O TAMANHO"}
                </>
              )}
            </button>
          </div>


          {showSizeChart && (
            <>
              <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowSizeChart(false)} />
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <div className="sticky top-0 bg-[#7BC9C2] text-white px-6 py-4 flex items-center justify-between">
                    <h2 className="text-lg font-bold">📏 Guia de Tamanhos</h2>
                    <button onClick={() => setShowSizeChart(false)} className="text-2xl hover:opacity-70">&times;</button>
                  </div>

                  <div className="p-6 space-y-6">
                    <div>
                      <h3 className="font-bold text-gray-800 mb-3">Como medir:</h3>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li><strong>Busto:</strong> Meça ao redor do peito, na parte mais saliente, sem apertar</li>
                        <li><strong>Cintura:</strong> Meça a circunferência mais fina da sua cintura</li>
                        <li><strong>Quadril:</strong> Meça a circunferência mais saliente do quadril</li>
                      </ul>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-sm border-collapse">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-3 py-2 text-left font-bold">Tamanho</th>
                            <th className="border border-gray-300 px-3 py-2 text-center font-bold">Busto</th>
                            <th className="border border-gray-300 px-3 py-2 text-center font-bold">Cintura</th>
                            <th className="border border-gray-300 px-3 py-2 text-center font-bold">Quadril</th>
                          </tr>
                        </thead>
                        <tbody className="text-gray-700">
                          <tr>
                            <td className="border border-gray-300 px-3 py-2 font-bold bg-blue-50">P</td>
                            <td className="border border-gray-300 px-3 py-2 text-center">80-85cm</td>
                            <td className="border border-gray-300 px-3 py-2 text-center">62-67cm</td>
                            <td className="border border-gray-300 px-3 py-2 text-center">88-93cm</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 px-3 py-2 font-bold bg-blue-50">M</td>
                            <td className="border border-gray-300 px-3 py-2 text-center">86-91cm</td>
                            <td className="border border-gray-300 px-3 py-2 text-center">68-73cm</td>
                            <td className="border border-gray-300 px-3 py-2 text-center">94-99cm</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 px-3 py-2 font-bold bg-blue-50">G</td>
                            <td className="border border-gray-300 px-3 py-2 text-center">92-97cm</td>
                            <td className="border border-gray-300 px-3 py-2 text-center">74-79cm</td>
                            <td className="border border-gray-300 px-3 py-2 text-center">100-105cm</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 px-3 py-2 font-bold bg-blue-50">GG</td>
                            <td className="border border-gray-300 px-3 py-2 text-center">98-103cm</td>
                            <td className="border border-gray-300 px-3 py-2 text-center">80-85cm</td>
                            <td className="border border-gray-300 px-3 py-2 text-center">106-111cm</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-xs text-blue-700">
                        <strong>💡 Dica:</strong> Se você está entre dois tamanhos, escolha o maior para mais conforto!
                      </p>
                    </div>

                    <button
                      onClick={() => setShowSizeChart(false)}
                      className="w-full py-2 bg-[#7BC9C2] text-white rounded-lg font-bold text-sm hover:bg-[#6ab8b1]"
                    >
                      Fechar
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="space-y-4 border-t border-gray-100 pt-6">
            {product.description && (
              <div>
                <h3 className="text-sm font-bold text-gray-700 mb-1">Descrição</h3>
                <p className="text-sm text-gray-500">{product.description}</p>
              </div>
            )}
            {product.composition && (
              <div>
                <h3 className="text-sm font-bold text-gray-700 mb-1">Composição</h3>
                <p className="text-sm text-gray-500">{product.composition}</p>
              </div>
            )}
            {product.care && (
              <div>
                <h3 className="text-sm font-bold text-gray-700 mb-1">Cuidados</h3>
                <p className="text-sm text-gray-500">{product.care}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
