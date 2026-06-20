"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { useUI } from "@/lib/ui-context";
import { ImageSlot } from "./ImageSlot";

function plural(n: number, forms: [string, string, string]) {
  const m10 = n % 10, m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return forms[0];
  if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return forms[1];
  return forms[2];
}

export function CartDrawer() {
  const { cartOpen, closeCart } = useUI();
  const { items, totalCount, totalPrice, updateQuantity, removeItem, isHydrated } = useCart();

  return (
    <div className={`drawer-root ${cartOpen ? "open" : ""}`} onClick={(e) => {
      if ((e.target as HTMLElement).hasAttribute("data-close-drawer")) closeCart();
    }}>
      <div className="drawer-backdrop" data-close-drawer />
      <aside className="drawer" role="dialog" aria-label="Кошик">
        <span className="drawer-grab"></span>
        <header className="drawer-head" style={{ borderWidth: 0, borderRadius: 0, padding: "13px 24px 16px", opacity: 1, textAlign: "left" }}>
          <h3>
            Кошик
            {isHydrated && totalCount > 0 && (
              <small> · {totalCount} {plural(totalCount, ["товар", "товари", "товарів"])}</small>
            )}
          </h3>
          <button className="icon-btn" onClick={closeCart} aria-label="Закрити">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>
          </button>
        </header>

        <div className="drawer-body" style={{ textAlign: "left" }}>
          {!isHydrated ? null : items.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 7h14l-1.5 9.5a2 2 0 0 1-2 1.7H8.5a2 2 0 0 1-2-1.7L5 7z"/><path d="M8 7V5a4 4 0 0 1 8 0v2"/></svg>
              </div>
              <h4>Кошик порожній</h4>
              <p>Додайте улюблені засоби з каталогу — ми вже чекаємо.</p>
              <Link href="/catalog" className="btn btn-primary" onClick={closeCart}>До каталогу</Link>
            </div>
          ) : (
            items.map((c) => (
              <div key={c.slug} className="cart-item">
                <Link href={`/product/${c.productSlug}`} className="cart-item-img" onClick={closeCart}>
                  <div className="bottle">
                    <ImageSlot shape="rounded" radius={14} placeholder={c.name} src={c.image} alt={c.name} />
                  </div>
                </Link>
                <div className="cart-item-info">
                  <div className="cart-item-brand">{c.brand}</div>
                  <Link href={`/product/${c.productSlug}`} className="cart-item-name" onClick={closeCart}>{c.name}</Link>
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
            ))
          )}
        </div>

        {items.length > 0 && (
          <footer className="drawer-foot">
            <div className="total-row">
              <span className="lbl">Сума</span>
              <span className="val num">{totalPrice} грн</span>
            </div>
            <Link href="/checkout" className="btn btn-purple btn-lg btn-full" onClick={closeCart}>
              Оформити замовлення
            </Link>
          </footer>
        )}
      </aside>
    </div>
  );
}
