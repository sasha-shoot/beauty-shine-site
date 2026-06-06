"use client";

import { useState } from "react";
import { useCart, type CartItem } from "@/lib/cart-context";

type Props = {
  product: Omit<CartItem, "quantity">;
  disabled?: boolean;
  className?: string;
};

export function AddToCartButton({ product, disabled, className = "" }: Props) {
  const { addItem, totalCount } = useCart();
  const [status, setStatus] = useState<"idle" | "added" | "error">("idle");

  function handleAdd() {
    if (disabled) {
      console.warn("[Cart] Button disabled — товар відсутній (in_stock=false)");
      return;
    }
    if (!product.price_uah) {
      console.warn("[Cart] Не можна додати — ціна не виставлена (price_uah порожнє в Airtable)");
      setStatus("error");
      setTimeout(() => setStatus("idle"), 2200);
      return;
    }
    try {
      addItem(product);
      console.info(`[Cart] Додано: ${product.name} | Всього у кошику тепер: ${totalCount + 1}`);
      setStatus("added");
      setTimeout(() => setStatus("idle"), 1800);
    } catch (e) {
      console.error("[Cart] Помилка додавання:", e);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 2200);
    }
  }

  const labelMap = {
    idle:  "🛒 В кошик",
    added: "✓ Додано в кошик",
    error: "⚠ Виставте ціну",
  };
  const styleMap = {
    idle:  "btn-primary",
    added: "btn-accent",
    error: "btn-ghost",
  };

  return (
    <button
      onClick={handleAdd}
      disabled={disabled}
      className={`${styleMap[status]} disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {labelMap[status]}
    </button>
  );
}
