"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart, CartItem } from "@/context/CartContext";
import { products } from "@/data/products";
import { getArteLegenda } from "@/data/artes-legendas";

interface ReceiptData {
  name: string;
  items: CartItem[];
  total: number;
  totalItems: number;
  date: string;
  number: number;
}

interface UniqueProduct {
  ref: string;
  name: string;
  image: string;
  slug: string;
  colors: string[];
  sizes: string[];
  category: string;
}

function getUniqueProducts(items: CartItem[]): UniqueProduct[] {
  const map: Record<string, UniqueProduct> = {};
  for (const item of items) {
    if (!map[item.ref]) {
      const product = products.find((p) => p.ref === item.ref);
      map[item.ref] = {
        ref: item.ref,
        name: item.name,
        image: item.image,
        slug: product?.slug || "",
        colors: [],
        sizes: [],
        category: product?.category || "Lingerie",
      };
    }
    if (!map[item.ref].colors.includes(item.color)) {
      map[item.ref].colors.push(item.color);
    }
    if (!map[item.ref].sizes.includes(item.size)) {
      map[item.ref].sizes.push(item.size);
    }
  }
  return Object.values(map);
}

function buildFallbackCaption(prod: UniqueProduct): string {
  const lines = [
    `${prod.name}`,
    `REF ${prod.ref}`,
    ``,
    `Lingerie de qualidade com o melhor preço!`,
    `Me chama que te mostro as cores disponíveis!`,
    ``,
    `#BelezaNativa #Lingerie #Atacado #Revenda`,
  ];
  return lines.join("\n");
}

export default function CartSidebar() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    totalItems,
    totalPrice,
    minOrder,
    checkout,
    checkStock,
  } = useCart();

  const [showConfirm, setShowConfirm] = useState(false);
  const [revendedora, setRevendedora] = useState("");
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [receiptTab, setReceiptTab] = useState<"resumo" | "artes">("artes");
  const [copiedRef, setCopiedRef] = useState<string | null>(null);
  const [legendaMode, setLegendaMode] = useState<Record<string, "completa" | "curta">>({});
  const [tipoCompra, setTipoCompra] = useState<"revenda" | "uso_proprio">("revenda");

  if (!isOpen && !showReceipt) return null;

  const minOrderAdjusted = tipoCompra === "revenda" ? 600 : 0;
  const canCheckout = totalPrice >= minOrderAdjusted;

  const handleCheckout = () => {
    setShowConfirm(true);
  };

  const confirmOrder = () => {
    const name = revendedora.trim() || "Não informado";

    const savedItems = items.map((i) => ({ ...i }));
    const savedTotal = totalPrice;
    const savedCount = totalItems;

    checkout(name);

    let orderNumber = 0;
    try {
      const orders = JSON.parse(localStorage.getItem("belezanativa_orders") || "[]");
      const lastOrder = orders[orders.length - 1];
      if (lastOrder) orderNumber = lastOrder.number;
    } catch {}

    setReceiptData({
      name,
      items: savedItems,
      total: savedTotal,
      totalItems: savedCount,
      date: new Date().toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      number: orderNumber,
    });

    setShowConfirm(false);
    setRevendedora("");
    setReceiptTab("artes");
    setShowReceipt(true);
  };

  const closeReceipt = () => {
    setShowReceipt(false);
    setReceiptData(null);
  };

  const copyCaption = async (ref: string, caption: string) => {
    try {
      await navigator.clipboard.writeText(caption);
      setCopiedRef(ref);
      setTimeout(() => setCopiedRef(null), 2000);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = caption;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopiedRef(ref);
      setTimeout(() => setCopiedRef(null), 2000);
    }
  };

  if (showReceipt && receiptData) {
    const uniqueProducts = getUniqueProducts(receiptData.items);
    const storeUrl = typeof window !== "undefined" ? window.location.origin : "";
    const productRefs = uniqueProducts.map(p => p.ref).join(',');
    const catalogLink = `${storeUrl}?catalogo=${encodeURIComponent(receiptData.name)}&refs=${productRefs}`;

    return (
      <>
        <div className="fixed inset-0 bg-black/50 z-50" onClick={closeReceipt} />
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="bg-[#7BC9C2] text-white px-6 py-4 text-center relative">
              <button
                onClick={closeReceipt}
                className="absolute right-4 top-4 text-white/70 hover:text-white text-2xl"
              >
                &times;
              </button>
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-lg font-bold">Pedido #{receiptData.number} Enviado!</h2>
              <p className="text-xs text-white/80">{receiptData.name} · {receiptData.date}</p>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setReceiptTab("artes")}
                className={`flex-1 py-3 text-xs font-bold text-center transition-colors ${
                  receiptTab === "artes"
                    ? "text-[#7BC9C2] border-b-2 border-[#7BC9C2]"
                    : "text-gray-400"
                }`}
              >
                ARTES + LEGENDAS
              </button>
              <button
                onClick={() => setReceiptTab("resumo")}
                className={`flex-1 py-3 text-xs font-bold text-center transition-colors ${
                  receiptTab === "resumo"
                    ? "text-[#7BC9C2] border-b-2 border-[#7BC9C2]"
                    : "text-gray-400"
                }`}
              >
                RESUMO DO PEDIDO
              </button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto">
              {receiptTab === "artes" ? (
                <div className="px-4 py-4">
                  <div className="bg-pink-50 border border-pink-100 rounded-lg p-3 mb-4">
                    <p className="text-xs text-pink-700 font-semibold mb-0.5">Kit de Divulgação</p>
                    <p className="text-[10px] text-pink-600">
                      Salve as fotos e copie as legendas prontas pra postar nas suas redes sociais!
                    </p>
                  </div>

                  <div className="space-y-4">
                    {uniqueProducts.map((prod) => {
                      const arteLegenda = getArteLegenda(prod.ref);
                      const hasArteImage = !!arteLegenda && arteLegenda.arte !== "";
                      const hasLegenda = !!arteLegenda && arteLegenda.legendaCompleta !== "";
                      const mode = legendaMode[prod.ref] || "completa";
                      const caption = hasLegenda
                        ? (mode === "completa" ? arteLegenda.legendaCompleta : arteLegenda.legendaCurta)
                        : buildFallbackCaption(prod);
                      const arteImage = hasArteImage ? arteLegenda.arte : prod.image;
                      const isCopied = copiedRef === prod.ref;
                      return (
                        <div key={prod.ref} className="border border-gray-100 rounded-xl overflow-hidden">
                          <div className="relative aspect-square bg-[#f5f0e8]">
                            {arteImage ? (
                              <Image
                                src={arteImage}
                                alt={prod.name}
                                fill
                                className={hasArteImage ? "object-contain" : "object-cover"}
                                sizes="400px"
                              />
                            ) : (
                              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300">
                                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="text-xs mt-1">REF {prod.ref}</span>
                              </div>
                            )}
                            {!hasArteImage && (
                              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                                <p className="text-white text-sm font-bold">{prod.name}</p>
                                <p className="text-white/80 text-[10px]">REF {prod.ref}</p>
                              </div>
                            )}
                          </div>

                          <div className="p-3 bg-gray-50">
                            <div className="flex items-center justify-between mb-2">
                              {hasLegenda ? (
                                <div className="flex gap-1">
                                  <button
                                    onClick={() => setLegendaMode((prev) => ({ ...prev, [prod.ref]: "completa" }))}
                                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full transition-colors ${
                                      mode === "completa" ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-500"
                                    }`}
                                  >
                                    FEED
                                  </button>
                                  <button
                                    onClick={() => setLegendaMode((prev) => ({ ...prev, [prod.ref]: "curta" }))}
                                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full transition-colors ${
                                      mode === "curta" ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-500"
                                    }`}
                                  >
                                    STATUS
                                  </button>
                                </div>
                              ) : (
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Legenda</p>
                              )}
                              <button
                                onClick={() => copyCaption(prod.ref, caption)}
                                className={`text-[10px] font-bold px-3 py-1 rounded-full transition-colors flex items-center gap-1 ${
                                  isCopied
                                    ? "bg-green-500 text-white"
                                    : "bg-[#7BC9C2] text-white hover:bg-[#6ab8b1]"
                                }`}
                              >
                                {isCopied ? (
                                  <>
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    COPIADA!
                                  </>
                                ) : (
                                  <>
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                    </svg>
                                    COPIAR
                                  </>
                                )}
                              </button>
                            </div>
                            <pre className="text-[11px] text-gray-600 whitespace-pre-wrap font-sans leading-relaxed bg-white rounded-lg p-2.5 border border-gray-200">
                              {caption}
                            </pre>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Catalog Link */}
                  <div className="mt-4 bg-[#7BC9C2]/10 border border-[#7BC9C2]/20 rounded-xl p-4 text-center">
                    <p className="text-xs font-bold text-gray-700 mb-1">Link do Catálogo</p>
                    <p className="text-[10px] text-gray-500 mb-2">Compartilhe com suas clientes!</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-white rounded-lg px-3 py-2 text-xs text-gray-600 truncate border border-gray-200">
                        {catalogLink}
                      </div>
                      <button
                        onClick={() => copyCaption("catalog", catalogLink)}
                        className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors flex-shrink-0 ${
                          copiedRef === "catalog"
                            ? "bg-green-500 text-white"
                            : "bg-[#7BC9C2] text-white hover:bg-[#6ab8b1]"
                        }`}
                      >
                        {copiedRef === "catalog" ? "COPIADO!" : "COPIAR"}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="px-6 py-4">
                  {/* Customer Info */}
                  <div className="border-b border-dashed border-gray-200 pb-3 mb-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Revendedora:</span>
                      <span className="font-semibold text-gray-800">{receiptData.name}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-gray-500">Data:</span>
                      <span className="text-gray-600">{receiptData.date}</span>
                    </div>
                  </div>

                  {/* Items */}
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    {receiptData.totalItems} {receiptData.totalItems === 1 ? "peça" : "peças"}
                  </p>

                  <div className="space-y-3 mb-4">
                    {receiptData.items.map((item, i) => (
                      <div key={i} className="flex gap-3 bg-gray-50 rounded-lg p-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate">{item.name}</p>
                          <p className="text-xs text-gray-400 mt-0.5">REF {item.ref}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className="w-3 h-3 rounded-full border border-gray-300"
                              style={{ backgroundColor: item.colorHex }}
                            />
                            <span className="text-xs text-gray-500">
                              {item.color} / Tam. {item.size}
                            </span>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm font-bold text-gray-400">_______</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">
                            {item.quantity}x
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="border-t border-dashed border-gray-200 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-gray-700">TOTAL DO PEDIDO</span>
                      <span className="text-xl font-bold text-gray-400">_______</span>
                    </div>
                  </div>

                  {/* Branding */}
                  <div className="mt-4 bg-gray-50 rounded-lg p-4 text-center">
                    <p className="text-xs font-bold text-gray-600">BELEZA NATIVA</p>
                    <p className="text-[10px] text-gray-400">Lingerie e Moda Praia - Atacado</p>
                    <p className="text-[10px] text-gray-400 mt-1">Finalizamos pelo WhatsApp</p>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="px-6 py-4 border-t border-gray-200">
              <button
                onClick={closeReceipt}
                className="w-full py-3 bg-[#7BC9C2] text-white rounded-lg font-bold text-sm hover:bg-[#6ab8b1] transition-colors"
              >
                VOLTAR À LOJA
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 z-50"
        onClick={closeCart}
      />
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="bg-primary text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className="font-bold text-lg">Minha Sacola</span>
          </div>
          <button onClick={closeCart} className="hover:opacity-70 text-2xl">&times;</button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <svg className="w-16 h-16 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <p className="font-medium">Sua sacola está vazia</p>
            </div>
          ) : (
            items.map((item) => {
              const stockQty = checkStock(item.ref, item.color, item.size);
              const lowStock = stockQty > 0 && stockQty !== -1 && stockQty <= 3;
              return (
                <div
                  key={`${item.productId}-${item.color}-${item.size}`}
                  className="flex gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  {item.image ? (
                    <div className="w-20 h-20 rounded flex-shrink-0 relative overflow-hidden">
                      <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
                    </div>
                  ) : (
                    <div className="w-20 h-20 bg-gray-200 rounded flex-shrink-0 flex items-center justify-center text-gray-400 text-xs">
                      IMG
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-gray-700 truncate">
                      {item.name}
                    </h4>
                    <p className="text-[10px] text-gray-500 mt-0.5">{item.ref}</p>
                    {lowStock && (
                      <p className="text-[10px] text-amber-600 font-semibold mt-0.5">
                        Restam apenas {stockQty} em estoque
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center border border-gray-300 rounded">
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.color, item.size, item.quantity - 1)
                          }
                          className="px-2 py-1 text-sm text-gray-600 hover:bg-gray-100"
                        >
                          -
                        </button>
                        <span className="px-2 py-1 text-sm font-medium min-w-[24px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.color, item.size, item.quantity + 1)
                          }
                          className="px-2 py-1 text-sm text-gray-600 hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-sm font-bold text-primary-dark">
                        R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className="w-3 h-3 rounded-full border border-gray-300"
                        style={{ backgroundColor: item.colorHex }}
                      />
                      <span className="text-[10px] text-gray-500">
                        {item.color} / {item.size}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId, item.color, item.size)}
                    className="text-gray-400 hover:text-red-500 self-start"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-600">
              {totalItems} {totalItems === 1 ? "item" : "itens"} na sacola
            </span>
            <span className="text-lg font-bold text-primary-dark">
              R$ {totalPrice.toFixed(2).replace(".", ",")}
            </span>
          </div>
          <button
            disabled={!canCheckout}
            onClick={handleCheckout}
            className={`w-full py-3 rounded-lg font-bold text-white text-sm flex items-center justify-center gap-2 transition-colors ${
              canCheckout
                ? "bg-green-500 hover:bg-green-600"
                : "bg-primary cursor-not-allowed"
            }`}
          >
            {canCheckout ? (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                </svg>
                FINALIZAR PELO WHATSAPP
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {minOrderAdjusted > 0
                  ? `PEDIDO MÍNIMO DE R$ ${minOrderAdjusted.toFixed(2).replace(".", ",")}`
                  : "Valor total suficiente"}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Confirm Modal */}
      {showConfirm && (
        <>
          <div className="fixed inset-0 bg-black/60 z-[60]" onClick={() => setShowConfirm(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl z-[60] w-[90%] max-w-sm p-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Finalizar pelo WhatsApp</h3>
                <p className="text-xs text-gray-500">
                  {totalItems} {totalItems === 1 ? "item" : "itens"} · R$ {totalPrice.toFixed(2).replace(".", ",")}
                </p>
              </div>
            </div>

            <div className="bg-green-50 border border-green-100 rounded-lg p-3 mb-4">
              <p className="text-xs text-green-700">
                Seu pedido será enviado direto para o nosso WhatsApp. Lá finalizamos o pagamento e combinamos a entrega.
              </p>
            </div>

            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de compra</label>
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setTipoCompra("revenda")}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-colors ${
                  tipoCompra === "revenda"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-600 border border-gray-200"
                }`}
              >
                Revenda (Min. R$ 600)
              </button>
              <button
                onClick={() => setTipoCompra("uso_proprio")}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-colors ${
                  tipoCompra === "uso_proprio"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-600 border border-gray-200"
                }`}
              >
                Uso Próprio
              </button>
            </div>

            <label className="block text-sm font-medium text-gray-700 mb-1">
              {tipoCompra === "revenda" ? "Nome da revendedora" : "Seu nome"}
            </label>
            <input
              type="text"
              placeholder="Nome da revendedora..."
              value={revendedora}
              onChange={(e) => setRevendedora(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2] mb-4"
              autoFocus
            />

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={confirmOrder}
                className="flex-1 py-2.5 bg-green-500 text-white rounded-lg text-sm font-bold hover:bg-green-600 flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                </svg>
                Enviar pedido
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
