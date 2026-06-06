"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart, type CartItem } from "@/lib/cart-context";
import type { Product } from "@/lib/airtable";
import { ImageSlot } from "./ImageSlot";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!product.price_uah) return;
    const item: Omit<CartItem, "quantity"> = {
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      image: product.image,
      price_uah: product.price_uah,
      variants_display: product.variants_display,
    };
    addItem(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <Link href={`/product/${product.slug}`} className="card">
      <div className="card-media">
        <ImageSlot
          shape="rounded"
          radius={18}
          placeholder={product.name}
          src={product.image}
          alt={product.name}
        />
      </div>
      <div className="card-body">
        <div className="card-name">{product.name}</div>
        <div className="card-meta">
          <span className="stars">★★★★★</span>
          <span className="reviews">(0)</span>
        </div>
        <div className="card-bottom">
          <span className="card-price num">
            {product.price_uah ? `${product.price_uah} грн` : "за запитом"}
          </span>
          <button
            className={`add-btn ${added ? "added" : ""}`}
            onClick={handleAdd}
            disabled={!product.price_uah}
            aria-label="Додати в кошик"
          >
            {added ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </Link>
  );
}
