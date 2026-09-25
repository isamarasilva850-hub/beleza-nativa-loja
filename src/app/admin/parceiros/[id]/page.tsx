"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { products } from "@/data/products";

interface Partner {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  city: string;
  state: string;
}

interface PurchasedProduct {
  productId: number;
  ref: string;
  quantity: number;
  color: string;
  size: string;
  purchaseDate: string;
}

export default function ParceiroCompras() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [partner, setPartner] = useState<Partner | null>(null);
  const [purchases, setPurchases] = useState<PurchasedProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("P");

  useEffect(() => {
    // Carregar parceiro
    const saved = localStorage.getItem("belezanativa_partners");
    if (saved) {
      const partners = JSON.parse(saved);
      const found = partners.find((p: Partner) => p.id === id);
      setPartner(found || null);
    }

    // Carregar compras existentes
    const savedPurchases = localStorage.getItem(`belezanativa_purchases_${id}`);
    if (savedPurchases) {
      setPurchases(JSON.parse(savedPurchases));
    }
  }, [id]);

  const savePurchases = (data: PurchasedProduct[]) => {
    setPurchases(data);
    localStorage.setItem(`belezanativa_purchases_${id}`, JSON.stringify(data));
  };

  const handleAddProduct = () => {
    if (!selectedProduct || !selectedColor) return;

    const product = products.find((p) => p.id === selectedProduct);
    if (!product) return;

    const newPurchase: PurchasedProduct = {
      productId: selectedProduct,
      ref: product.ref,
      quantity,
      color: selectedColor,
      size: selectedSize,
      purchaseDate: new Date().toLocaleDateString("pt-BR"),
    };

    const updated = [newPurchase, ...purchases];
    savePurchases(updated);

    // Reset form
    setSelectedProduct(null);
    setSelectedColor("");
    setQuantity(1);
    setSelectedSize("P");
  };

  const removeProduct = (productId: number, color: string) => {
    const updated = purchases.filter((p) => !(p.productId === productId && p.color === color));
    savePurchases(updated);
  };

  const selectedProductData = products.find((p) => p.id === selectedProduct);
  const variants = selectedProductData?.variants || [];

  if (!partner) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Parceiro não encontrado</p>
      </div>
    );
  }

  const catalogUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/catalogo-revendedora/${id}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={() => router.back()}
          className="text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          ← Voltar
        </button>
        <h1 className="text-3xl font-bold text-gray-800">
          📦 Catálogo de {partner.company || partner.name}
        </h1>
        <p className="text-gray-600 text-sm mt-1">
          {partner.city}/{partner.state} • {partner.phone}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulário de Compra */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4 sticky top-4">
            <h2 className="font-bold text-gray-800">Adicionar Produto</h2>

            {/* Busca de Produto */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">Produto</label>
              <select
                value={selectedProduct || ""}
                onChange={(e) => {
                  setSelectedProduct(Number(e.target.value) || null);
                  setSelectedColor("");
                }}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]"
              >
                <option value="">Selecione um produto...</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.ref} - {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Cores */}
            {selectedProductData && variants.length > 0 && (
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">Cor</label>
                <select
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]"
                >
                  <option value="">Selecione uma cor...</option>
                  {variants.map((v) => (
                    <option key={v.color} value={v.color}>
                      {v.color}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Tamanho */}
            {selectedProductData && selectedColor && (
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">Tamanho</label>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]"
                >
                  {variants
                    .find((v) => v.color === selectedColor)
                    ?.sizes.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                </select>
              </div>
            )}

            {/* Quantidade */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">Quantidade</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]"
              />
            </div>

            {/* Botão */}
            <button
              onClick={handleAddProduct}
              disabled={!selectedProduct || !selectedColor}
              className="w-full py-2 bg-[#7BC9C2] text-white rounded-lg text-sm font-semibold hover:bg-[#6ab8b1] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ✅ Adicionar
            </button>
          </div>
        </div>

        {/* Lista de Compras */}
        <div className="lg:col-span-2">
          {purchases.length > 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="font-bold text-gray-800">
                  {purchases.length} {purchases.length === 1 ? "Produto" : "Produtos"} em Catálogo
                </h2>
              </div>
              <div className="divide-y divide-gray-100">
                {purchases.map((purchase, idx) => {
                  const product = products.find((p) => p.id === purchase.productId);
                  return (
                    <div key={idx} className="p-4 hover:bg-gray-50 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-400 font-mono mb-1">REF {purchase.ref}</p>
                        <p className="font-semibold text-gray-800">{product?.name}</p>
                        <div className="flex gap-3 mt-1 text-xs text-gray-500">
                          <span>Cor: {purchase.color}</span>
                          <span>Tam: {purchase.size}</span>
                          <span className="font-medium text-[#7BC9C2]">Qtd: {purchase.quantity}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeProduct(purchase.productId, purchase.color)}
                        className="text-red-500 hover:text-red-700 text-lg font-semibold"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Link do Catálogo */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-2 font-semibold uppercase">🔗 Link do Catálogo</p>
                <div className="flex gap-2">
                  <input
                    readOnly
                    value={catalogUrl}
                    className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-600 font-mono"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(catalogUrl);
                      alert("Link copiado! Compartilhe com a revendedora");
                    }}
                    className="px-3 py-2 bg-blue-500 text-white rounded-lg text-xs font-semibold hover:bg-blue-600"
                  >
                    Copiar
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
              <p className="text-gray-500">Nenhum produto adicionado ainda</p>
              <p className="text-gray-400 text-sm mt-1">Adicione produtos ao catálogo desta revendedora</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
