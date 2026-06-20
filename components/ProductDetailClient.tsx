"use client";

import { useState, useEffect } from "react";
import { useCart, type CartItem } from "@/lib/cart-context";
import type { Product } from "@/lib/airtable";
import { ImageSlot } from "./ImageSlot";

function bonusFor(price: number) { return Math.floor(price / 25); }

const FAV_KEY = "bs_fav_v1";

export function ProductDetailClient({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<"desc" | "use" | "ing">("desc");
  const [added, setAdded] = useState(false);
  const [fav, setFav] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Галерея: головне фото + додаткові з product.gallery (без дублів)
  const images = [product.image, ...product.gallery].filter(
    (v, i, a) => Boolean(v) && a.indexOf(v) === i
  );
  const [activeImg, setActiveImg] = useState(images[0] ?? "");
  const isDiva = /diva/i.test(product.brand);
  const hasVariants = product.variants.length >= 2;
  const [variantIdx, setVariantIdx] = useState(0);
  const selectedVariant = hasVariants ? product.variants[variantIdx] : null;
  const currentPrice = selectedVariant ? selectedVariant.price : (product.price_uah ?? 0);
  useEffect(() => {
    // скидаємо активне фото та варіант при переході на інший товар
    setActiveImg(images[0] ?? "");
    setVariantIdx(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.slug]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(FAV_KEY);
      const set = new Set<string>(raw ? JSON.parse(raw) : []);
      setFav(set.has(product.slug));
    } catch {}
    setHydrated(true);
  }, [product.slug]);

  function toggleFav() {
    try {
      const raw = localStorage.getItem(FAV_KEY);
      const set = new Set<string>(raw ? JSON.parse(raw) : []);
      if (set.has(product.slug)) set.delete(product.slug);
      else set.add(product.slug);
      localStorage.setItem(FAV_KEY, JSON.stringify([...set]));
      setFav(set.has(product.slug));
      window.dispatchEvent(new Event("bs:fav-changed"));
    } catch {}
  }

  function handleAdd() {
    if (!currentPrice) return;
    const variantName = selectedVariant ? selectedVariant.name : "";
    const item: Omit<CartItem, "quantity"> = {
      slug: variantName ? `${product.slug}::${variantName}` : product.slug,
      productSlug: product.slug,
      name: product.name,
      brand: product.brand,
      image: product.image,
      price_uah: currentPrice,
      variant: variantName,
    };
    for (let i = 0; i < qty; i++) addItem(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  }

  const tabContent =
    tab === "desc" ? <p style={{ whiteSpace: "pre-line", color: "var(--ink-2)", lineHeight: 1.7 }}>{product.long}</p> :
    tab === "use"  ? <p style={{ whiteSpace: "pre-line", color: "var(--ink-2)", lineHeight: 1.7 }}>{product.usage}</p> :
    (product.inci && !product.inci.startsWith("TODO") && !product.inci.startsWith("Не застосовується")) ?
      <ul style={{ listStyle: "disc", paddingLeft: 20, color: "var(--ink-2)", lineHeight: 1.7, fontFamily: "monospace", fontSize: 12.5 }}>
        {product.inci.split(/,\s*/).map((i, k) => <li key={k}>{i}</li>)}
      </ul> :
      <p style={{ color: "var(--ink-3)" }}>Склад уточнюється у виробника.</p>;

  return (
    <div className="prod-grid">
      <div className="prod-media">
        <div className="prod-img">
          <svg className="deco-star pds-1" viewBox="0 0 100 100"><path d="M50 0 L60 40 L100 50 L60 60 L50 100 L40 60 L0 50 L40 40 Z" fill="currentColor"/></svg>
          <svg className="deco-star pds-2" viewBox="0 0 100 100"><path d="M50 0 L60 40 L100 50 L60 60 L50 100 L40 60 L0 50 L40 40 Z" fill="currentColor"/></svg>
          <div className="bottle">
            <ImageSlot shape="rounded" radius={28} placeholder={product.name} src={activeImg} alt={product.name} />
          </div>
        </div>
        {images.length > 1 && (
          <div className="prod-thumbs">
            {images.map((img, i) => (
              <button
                key={i}
                type="button"
                className={`prod-thumb ${activeImg === img ? "active" : ""}`}
                onClick={() => setActiveImg(img)}
                aria-label={`Показати фото ${i + 1}`}
              >
                <img src={img} alt={`${product.name} — фото ${i + 1}`} loading="lazy" />
              </button>
            ))}
          </div>
        )}
      </div>
      <div>
        <div className="prod-cat">{product.category}</div>
        <h1>{product.name}</h1>
        <div className="prod-brand">{product.brand}</div>
        {isDiva && (
          <div className="partner-badge">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="pb-logo" src="/divafarm/divapharm-logo.png" alt="DivaPharm" />
            <span className="pb-text">Офіційний партнер</span>
          </div>
        )}
        {product.price_uah ? (
          <>
            <div className="prod-price num">{currentPrice}<small>грн</small></div>
            <div className="prod-bonus" title="Бонуси за програмою лояльності">
              <svg viewBox="0 0 100 100" fill="currentColor"><path d="M50 0 L60 40 L100 50 L60 60 L50 100 L40 60 L0 50 L40 40 Z"/></svg>
              <span>+{bonusFor(currentPrice)} ✦ бонусів на рахунок за це замовлення</span>
            </div>
          </>
        ) : (
          <div className="prod-price num"><small>Ціна за запитом</small></div>
        )}
        <p className="prod-lead">{product.short}</p>

        {hasVariants && (
          <div className="prod-variants">
            <span className="prod-variants-label">Об'єм</span>
            <div className="prod-variants-opts">
              {product.variants.map((v, i) => (
                <button
                  key={v.name}
                  type="button"
                  className={`variant-opt ${i === variantIdx ? "active" : ""}`}
                  onClick={() => setVariantIdx(i)}
                >
                  <span className="vo-name">{v.name}</span>
                  <span className="vo-price">{v.price} грн</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {product.price_uah ? (
          <div className="qty">
            <span className="qty-label">Кількість</span>
            <div className="qty-control">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Менше">
                <svg viewBox="0 0 24 24" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </button>
              <span>{qty}</span>
              <button onClick={() => setQty((q) => Math.min(99, q + 1))} aria-label="Більше">
                <svg viewBox="0 0 24 24" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </button>
            </div>
          </div>
        ) : null}

        <div className="prod-cta">
          <button className={`btn btn-purple btn-lg ${added ? "added" : ""}`} onClick={handleAdd} disabled={!product.price_uah}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            <span>{added ? "✓ Додано" : "Додати в кошик"}</span>
          </button>
          <button className={`btn btn-ghost btn-lg ${hydrated && fav ? "fav-active" : ""}`} onClick={toggleFav}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill={hydrated && fav ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.9"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.5 1-1a5.5 5.5 0 0 0 0-7.9z"/></svg>
            <span>{hydrated && fav ? "В обраному" : "В обране"}</span>
          </button>
        </div>

        <div className="prod-delivery">
          <div className="pd-head">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
            <span>Доставка по всій Україні</span>
          </div>
          <ul className="pd-list">
            <li><b>Нова Пошта</b> — у відділення або поштомат</li>
            <li><b>Укрпошта</b> — у відділення</li>
            <li><b>Самовивіз</b> — зі студії в Ізмаїлі (ТЦ «Дельта»)</li>
          </ul>
          <p className="pd-note">Спосіб доставки оберете під час оформлення. Оплата перевізнику при отриманні.</p>
        </div>

        <div className="tabs">
          <div className="tab-headers" role="tablist">
            <button className={`tab-head ${tab === "desc" ? "active" : ""}`} onClick={() => setTab("desc")}>Опис</button>
            <button className={`tab-head ${tab === "use"  ? "active" : ""}`} onClick={() => setTab("use")}>Застосування</button>
            <button className={`tab-head ${tab === "ing"  ? "active" : ""}`} onClick={() => setTab("ing")}>Склад</button>
          </div>
          <div className="tab-body">{tabContent}</div>
        </div>
      </div>
    </div>
  );
}
