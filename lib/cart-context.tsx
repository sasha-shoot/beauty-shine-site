"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type CartItem = {
  slug: string;
  name: string;
  brand: string;
  image: string;
  price_uah: number;
  variants_display: string;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  totalCount: number;
  totalPrice: number;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (slug: string) => void;
  updateQuantity: (slug: string, qty: number) => void;
  clear: () => void;
  isHydrated: boolean;
};

const CartContext = createContext<CartContextType | null>(null);
const STORAGE_KEY = "bs_cart_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Завантажуємо з localStorage при першому рендері (тільки в браузері)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch {
      // ignore parse errors
    }
    setIsHydrated(true);
  }, []);

  // Зберігаємо в localStorage при зміні (після hydration)
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // localStorage might be full or disabled
    }
  }, [items, isHydrated]);

  const addItem: CartContextType["addItem"] = (newItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.slug === newItem.slug);
      if (existing) {
        return prev.map((i) =>
          i.slug === newItem.slug ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...newItem, quantity: 1 }];
    });
  };

  const removeItem: CartContextType["removeItem"] = (slug) => {
    setItems((prev) => prev.filter((i) => i.slug !== slug));
  };

  const updateQuantity: CartContextType["updateQuantity"] = (slug, qty) => {
    if (qty < 1) return removeItem(slug);
    setItems((prev) => prev.map((i) => (i.slug === slug ? { ...i, quantity: qty } : i)));
  };

  const clear = () => setItems([]);

  const totalCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price_uah * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items, totalCount, totalPrice, isHydrated,
        addItem, removeItem, updateQuantity, clear,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart має використовуватись усередині <CartProvider>");
  return ctx;
}
