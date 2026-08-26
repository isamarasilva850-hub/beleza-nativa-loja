"use client";

import { useCart } from "@/context/CartContext";

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
  } = useCart();

  if (!isOpen) return null;

  const canCheckout = totalPrice >= minOrder;

  const handleCheckout = () => {
    const lines = items.map(
      (item) =>
        `${item.ref} - ${item.name} | ${item.color} | ${item.size} | Qtd: ${item.quantity} | R$ ${(item.price * item.quantity).toFixed(2).replace(".", ",")}`
    );
    const msg = [
      "Olá! Gostaria de finalizar meu pedido:",
      "",
      ...lines,
      "",
      `Total: R$ ${totalPrice.toFixed(2).replace(".", ",")}`,
      `Itens: ${totalItems}`,
    ].join("\n");
    window.open(
      `https://wa.me/5535992100072?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  };

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

        {/* Actions */}
        <div className="flex border-b border-gray-200">
          <button className="flex-1 py-3 text-xs text-center text-primary font-semibold hover:bg-gray-50 flex flex-col items-center gap-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            COMPRA RÁPIDA
          </button>
          <button className="flex-1 py-3 text-xs text-center text-primary font-semibold hover:bg-gray-50 flex flex-col items-center gap-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12l-2 9H6L4 4H2" />
            </svg>
            SIMULAR FRETE
          </button>
          <button className="flex-1 py-3 text-xs text-center text-primary font-semibold hover:bg-gray-50 flex flex-col items-center gap-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            VER ROMANEIO
          </button>
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
            items.map((item) => (
              <div
                key={`${item.productId}-${item.color}-${item.size}`}
                className="flex gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <div className="w-20 h-20 bg-gray-200 rounded flex-shrink-0 flex items-center justify-center text-gray-400 text-xs">
                  IMG
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold text-gray-700 truncate">
                    {item.name}
                  </h4>
                  <p className="text-[10px] text-gray-500 mt-0.5">{item.ref}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center border border-gray-300 rounded">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            item.color,
                            item.size,
                            item.quantity - 1
                          )
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
                          updateQuantity(
                            item.productId,
                            item.color,
                            item.size,
                            item.quantity + 1
                          )
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
            ))
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
                ? "bg-success hover:bg-green-600"
                : "bg-primary cursor-not-allowed"
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {canCheckout
              ? "FINALIZAR PEDIDO"
              : `PEDIDO MÍNIMO DE R$ ${minOrder.toFixed(2).replace(".", ",")}`}
          </button>
        </div>
      </div>
    </>
  );
}
