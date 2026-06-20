"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { ImageSlot } from "@/components/ImageSlot";

function plural(n: number, forms: [string, string, string]) {
  const m10 = n % 10, m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return forms[0];
  if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return forms[1];
  return forms[2];
}

export default function CartPage() {
  const { items, totalCount, totalPrice, updateQuantity, removeItem, clear, isHydrated } = useCart();

  if (!isHydrated) {
    return (
      <section className="screen active"><div className="container">
        <div style={{ background: "#fff", borderRadius: "var(--r-bubble)", padding: 32, marginTop: 24, boxShadow: "var(--shadow-bubble)" }}>
          <h1>Завантаження…</h1>
        </div>
      </div></section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="screen active"><div className="container">
        <div style={{ background: "#fff", borderRadius: "var(--r-bubble)", padding: 32, marginTop: 24, boxShadow: "var(--shadow-bubble)" }}>
          <div className="cart-empty">
            <div className="cart-empty-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 7h14l-1.5 9.5a2 2 0 0 1-2 1.7H8.5a2 2 0 0 1-2-1.7L5 7z"/><path d="M8 7V5a4 4 0 0 1 8 0v2"/></svg>
            </div>
            <h4>Кошик порожній</h4>
            <p>Додайте улюблені засоби з каталогу — ми вже чекаємо.</p>
            <Link href="/catalog" className="btn btn-primary btn-lg">До каталогу</Link>
          </div>
        </div>
      </div></section>
    );
  }

  return (
    <section className="screen active"><div className="container">
      <div style={{ background: "#fff", borderRadius: "var(--r-bubble)", padding: 32, marginTop: 24, boxShadow: "var(--shadow-bubble)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 16, marginBottom: 24 }}>
          <div>
            <div className="eyebrow">Кошик</div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 600, lineHeight: 1.1, marginTop: 6 }}>
              Ваше <em style={{ color: "var(--purple)" }}>замовлення</em>
            </h1>
            <p style={{ color: "var(--ink-3)", marginTop: 4, fontSize: 14 }}>
              {totalCount} {plural(totalCount, ["товар", "товари", "товарів"])}
            </p>
          </div>
          <button onClick={clear} className="link" style={{ cursor: "pointer", border: "none", background: "none" }}>
            ✕ Очистити кошик
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {items.map((c) => (
            <div key={c.slug} className="cart-item">
              <Link href={`/product/${c.productSlug}`} className="cart-item-img">
                <div className="bottle">
                  <ImageSlot shape="rounded" radius={14} placeholder={c.name} src={c.image} alt={c.name} />
                </div>
              </Link>
              <div className="cart-item-info">
                <div className="cart-item-brand">{c.brand}</div>
                <Link href={`/product/${c.productSlug}`} className="cart-item-name">{c.name}</Link>
                {c.variant && <span className="cart-item-variant">{c.variant}</span>}
                <div className="cart-item-bottom">
                  <div className="qty-mini">
                    <button onClick={() => updateQuantity(c.slug, c.quantity - 1)} aria-label="Менше">
                      <svg viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round"/></svg>
                    </button>
                    <span>{c.quantity}</span>
                    <button onClick={() => updateQuantity(c.slug, c.quantity + 1)} aria-label="Більше">
                      <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19" strokeLinecap="round"/><line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round"/></svg>
                    </button>
                  </div>
                  <div className="cart-item-price num">{c.price_uah * c.quantity} грн</div>
                </div>
              </div>
              <button className="remove" onClick={() => removeItem(c.slug)} aria-label="Видалити">
                <svg viewBox="0 0 24 24" strokeLinecap="round"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>
              </button>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 24, marginBottom: 16 }}>
          <span style={{ color: "var(--ink-3)", fontSize: 14.5 }}>До сплати:</span>
          <span className="num" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: 34, color: "var(--ink)" }}>{totalPrice} грн</span>
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link href="/checkout" className="btn btn-purple btn-lg" style={{ flex: 1, minWidth: 200 }}>
            Оформити замовлення
            <svg className="arr" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </Link>
          <Link href="/catalog" className="btn btn-ghost btn-lg">Продовжити покупки</Link>
        </div>
      </div>
    </div></section>
  );
}
