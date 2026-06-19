"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useCart, type CartItem } from "@/lib/cart-context";
import type { Product } from "@/lib/airtable";
import { ImageSlot } from "./ImageSlot";

function bonusFor(price: number) {
  return Math.floor(price / 25);
}

const FAV_KEY = "bs_fav_v1";

function getFavs(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(FAV_KEY);
    if (raw) return new Set(JSON.parse(raw));
  } catch {}
  return new Set();
}

function saveFavs(s: Set<string>) {
  try { localStorage.setItem(FAV_KEY, JSON.stringify([...s])); } catch {}
  window.dispatchEvent(new Event("bs:fav-changed"));
}

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [favs, setFavsState] = useState<Set<string>>(new Set());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setFavsState(getFavs());
    setHydrated(true);
    const onChange = () => setFavsState(getFavs());
    window.addEventListener("bs:fav-changed", onChange);
    return () => window.removeEventListener("bs:fav-changed", onChange);
  }, []);

  const isFav = favs.has(product.slug);

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
  }

  function toggleFav(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const next = new Set(favs);
    if (next.has(product.slug)) next.delete(product.slug);
    else next.add(product.slug);
    setFavsState(next);
    saveFavs(next);
  }

  const href = `/product/${product.slug}`;
  const isDiva = /diva/i.test(product.brand);

  return (
    <article className="card">
      {/* card-img — НЕ Link, щоб heart кнопка не була вкладена. Натомість Link тільки на bottle і corner-star */}
      <div className="card-img" style={{ position: "relative" }}>
        <Link href={href} className="card-img-link" aria-label={product.name} style={{ position: "absolute", inset: 0, zIndex: 1 }}>
          <span className="sr-only">{product.name}</span>
        </Link>
        <svg className="corner-star" viewBox="0 0 100 100" style={{ position: "relative", zIndex: 2 }}>
          <path d="M50 0 L60 40 L100 50 L60 60 L50 100 L40 60 L0 50 L40 40 Z" fill="currentColor"/>
        </svg>
        <div className="bottle" style={{ position: "relative", zIndex: 2, pointerEvents: "none" }}>
          <ImageSlot
            shape="rounded"
            radius={18}
            placeholder={product.name}
            src={product.image}
            alt={product.name}
          />
        </div>
        <span className="badge-brand" style={{ position: "relative", zIndex: 2, pointerEvents: "none" }}>{product.brand}</span>
      </div>
      <div className="card-body">
        <Link href={href} style={{ display: "block" }}>
          <div className="card-cat">{product.category}</div>
          <div className="card-name">{product.name}</div>
        </Link>
        {isDiva && (
          <span className="card-partner">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/divafarm/divapharm-logo.png" alt="" />
            Офіційний партнер
          </span>
        )}
        {product.price_uah ? (
          <div className="card-bonus" title="Бонуси за програмою лояльності">
            <svg viewBox="0 0 100 100" fill="currentColor"><path d="M50 0 L60 40 L100 50 L60 60 L50 100 L40 60 L0 50 L40 40 Z"/></svg>
            +{bonusFor(product.price_uah)} ✦ бонусів
          </div>
        ) : null}
        <div className="card-foot">
          <div className="price num">
            {product.price_uah ? <>{product.price_uah}<small> грн</small></> : <small>за запитом</small>}
          </div>
          <div className="card-actions">
            <button
              className={`heart ${hydrated && isFav ? "on" : ""}`}
              onClick={toggleFav}
              aria-label={hydrated && isFav ? "Прибрати з обраного" : "Додати в обране"}
              type="button"
            >
              <svg viewBox="0 0 24 24" fill={hydrated && isFav ? "currentColor" : "none"}>
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button
              className="add-btn"
              onClick={handleAdd}
              aria-label="Додати в кошик"
              disabled={!product.price_uah}
              type="button"
            >
              <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
