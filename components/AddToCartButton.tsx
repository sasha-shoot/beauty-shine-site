"use client";

import { useState } from "react";
import { useCart, type CartItem } from "@/lib/cart-context";

type Props = {
  product: Omit<CartItem, "quantity">;
  disabled?: boolean;
  className?: string;
};

export function AddToCartButton({ product, disabled, className = "" }: Props) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    if (disabled || !product.price_uah) return;
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  const noPrice = !product.price_uah;

  return (
    <button
      onClick={handleAdd}
      disabled={disabled || noPrice}
      className={`${added ? "btn-accent" : "btn-primary"} disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      title={noPrice ? "Ціна не виставлена" : undefined}
    >
      {added ? "✓ Додано в кошик" : noPrice ? "Ціна за запитом" : "🛒 В кошик"}
    </button>
  );
}
