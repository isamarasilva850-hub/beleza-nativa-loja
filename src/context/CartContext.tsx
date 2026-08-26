"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

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
  totalItems: number;
  totalPrice: number;
  minOrder: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const minOrder = 600;

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((prev) => !prev), []);

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
        totalItems,
        totalPrice,
        minOrder,
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
