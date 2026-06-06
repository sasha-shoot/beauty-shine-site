"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { ImageSlot } from "@/components/ImageSlot";

export default function CartPage() {
  const { items, totalCount, totalPrice, updateQuantity, removeItem, clear, isHydrated } = useCart();

  if (!isHydrated) {
    return (
      <section className="screen active"><div className="container">
        <div className="cart-page"><h1>Завантаження…</h1></div>
      </div></section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="screen active"><div className="container">
        <div className="cart-page">
          <div className="empty">
            <div className="empty-emoji">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M5 7h14l-1.5 9.5a2 2 0 0 1-2 1.7H8.5a2 2 0 0 1-2-1.7L5 7z"/><path d="M8 7V5a4 4 0 0 1 8 0v2"/></svg>
            </div>
            <h3>Кошик порожній</h3>
            <p>Час подивитись каталог і обрати щось для догляду.</p>
            <Link href="/catalog" className="btn btn-primary btn-lg">До каталогу</Link>
          </div>
        </div>
      </div></section>
    );
  }

  return (
    <section className="screen active"><div className="container">
      <div className="cart-page">
        <div className="head-row">
          <div>
            <div className="eyebrow">Кошик</div>
            <h1 style={{fontFamily:"'Playfair Display', serif", fontSize:36, fontWeight:600, lineHeight:1.1}}>
              Ваше <em style={{color:"var(--purple)"}}>замовлення</em>
            </h1>
            <p style={{color:"var(--ink-3)", marginTop:4, fontSize:14}}>
              {totalCount} {totalCount === 1 ? "товар" : totalCount < 5 ? "товари" : "товарів"}
            </p>
          </div>
          <button onClick={clear} className="link" style={{cursor:"pointer", border:"none", background:"none"}}>
            ✕ Очистити кошик
          </button>
        </div>

        <div className="cart-list">
          {items.map((item) => (
            <div key={item.slug} className="cart-item">
              <Link href={`/product/${item.slug}`} className="cart-item-img">
                <ImageSlot shape="rounded" radius={14} placeholder={item.name} src={item.image} alt={item.name} />
              </Link>
              <div className="cart-item-info">
                <Link href={`/product/${item.slug}`}><b>{item.name}</b></Link>
                <small>{item.brand} · {item.variants_display}</small>
                <button onClick={() => removeItem(item.slug)} style={{marginTop:6, fontSize:11.5, color:"var(--ink-3)", background:"none", border:"none", cursor:"pointer"}}>
                  Видалити
                </button>
              </div>
              <div style={{display:"flex", flexDirection:"column", gap:8, alignItems:"flex-end"}}>
                <div className="cart-qty">
                  <button onClick={() => updateQuantity(item.slug, item.quantity - 1)} aria-label="Менше">−</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.slug, item.quantity + 1)} aria-label="Більше">+</button>
                </div>
                <span className="cart-item-price num">{item.price_uah * item.quantity} грн</span>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-totals">
          <span className="cart-totals-label">До сплати:</span>
          <span className="cart-totals-value num">{totalPrice} грн</span>
        </div>

        <div style={{display:"flex", gap:12, flexWrap:"wrap"}}>
          <Link href="/checkout" className="btn btn-primary btn-lg" style={{flex:1, minWidth:200}}>
            Оформити замовлення
            <svg className="arr" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </Link>
          <Link href="/catalog" className="btn btn-soft btn-lg">Продовжити покупки</Link>
        </div>
      </div>
    </div></section>
  );
}
