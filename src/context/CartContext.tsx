"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { deductStock, buildPalmiraMessage, getStockQuantity } from "@/lib/stock";

const CART_KEY = "belezanativa_cart";

export interface CartItem {
  productId: number;
  ref: string;
  name: string;
  price: number;
  color: string;
  colorHex: string;
  size: string;
  quantity: number;
  image: string;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: number, color: string, size: string) => void;
  updateQuantity: (productId: number, color: string, size: string, quantity: number) => void;
  clearCart: () => void;
  checkout: (revendedora: string) => void;
  totalItems: number;
  totalPrice: number;
  minOrder: number;
  checkStock: (ref: string, color: string, size: string) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const PALMIRA_PHONE = "5535997380503";
const STORE_PHONE = "5535992100072";
const ORDERS_KEY = "belezanativa_orders";

function getNextOrderNumber(): number {
  const orders = localStorage.getItem(ORDERS_KEY);
  const list = orders ? JSON.parse(orders) : [];
  return list.length > 0 ? Math.max(...list.map((o: any) => o.number || 0)) + 1 : 1;
}

function loadCart(): CartItem[] {
  try {
    const saved = localStorage.getItem(CART_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const minOrder = 600;

  useEffect(() => {
    setItems(loadCart());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch {}
  }, [items, hydrated]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((prev) => !prev), []);

  const checkStock = useCallback((ref: string, color: string, size: string) => {
    return getStockQuantity(ref, color, size);
  }, []);

  const addItem = useCallback(
    (newItem: Omit<CartItem, "quantity">, quantity = 1) => {
      setItems((prev) => {
        const existing = prev.find(
          (i) =>
            i.productId === newItem.productId &&
            i.color === newItem.color &&
            i.size === newItem.size
        );
        if (existing) {
          return prev.map((i) =>
            i.productId === newItem.productId &&
            i.color === newItem.color &&
            i.size === newItem.size
              ? { ...i, quantity: i.quantity + quantity }
              : i
          );
        }
        return [...prev, { ...newItem, quantity }];
      });
      setIsOpen(true);
    },
    []
  );

  const removeItem = useCallback(
    (productId: number, color: string, size: string) => {
      setItems((prev) =>
        prev.filter(
          (i) =>
            !(i.productId === productId && i.color === color && i.size === size)
        )
      );
    },
    []
  );

  const updateQuantity = useCallback(
    (productId: number, color: string, size: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(productId, color, size);
        return;
      }
      setItems((prev) =>
        prev.map((i) =>
          i.productId === productId && i.color === color && i.size === size
            ? { ...i, quantity }
            : i
        )
      );
    },
    [removeItem]
  );

  const clearCart = useCallback(() => setItems([]), []);

  const checkout = useCallback((revendedora: string) => {
    if (items.length === 0) return;

    const orderNumber = getNextOrderNumber();

    const orderLines = items.map(
      (item) =>
        `${item.ref} - ${item.name} | ${item.color} | ${item.size} | Qtd: ${item.quantity} | R$ ${(item.price * item.quantity).toFixed(2).replace(".", ",")}`
    );

    const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const totalQty = items.reduce((sum, i) => sum + i.quantity, 0);

    const storeMsg = [
      `📦 *PEDIDO #${orderNumber}*`,
      `Revendedora: ${revendedora}`,
      "",
      ...orderLines,
      "",
      `*Total: R$ ${totalPrice.toFixed(2).replace(".", ",")}*`,
      `Itens: ${totalQty}`,
    ].join("\n");

    const palmiraMsg = buildPalmiraMessage(
      items.map((i) => ({ ref: i.ref, name: i.name, color: i.color, size: i.size, quantity: i.quantity })),
      orderNumber,
      revendedora
    );

    deductStock(
      items.map((i) => ({ ref: i.ref, color: i.color, size: i.size, quantity: i.quantity }))
    );

    const order = {
      number: orderNumber,
      date: new Date().toISOString(),
      revendedora,
      items: items.map((i) => ({
        ref: i.ref,
        name: i.name,
        color: i.color,
        size: i.size,
        quantity: i.quantity,
        unitPrice: i.price,
        total: i.price * i.quantity,
      })),
      total: totalPrice,
      totalItems: totalQty,
      status: "pendente",
    };

    const orders = localStorage.getItem(ORDERS_KEY);
    const list = orders ? JSON.parse(orders) : [];
    list.push(order);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(list));

    window.open(
      `https://wa.me/${STORE_PHONE}?text=${encodeURIComponent(storeMsg)}`,
      "_blank"
    );

    setTimeout(() => {
      window.open(
        `https://wa.me/${PALMIRA_PHONE}?text=${encodeURIComponent(palmiraMsg)}`,
        "_blank"
      );
    }, 1500);

    setItems([]);
    setIsOpen(false);
  }, [items]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart,
        closeCart,
        toggleCart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        checkout,
        totalItems,
        totalPrice,
        minOrder,
        checkStock,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
