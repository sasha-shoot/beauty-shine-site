"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { items, totalPrice, clear, isHydrated } = useCart();
  const router = useRouter();
  const [delivery, setDelivery] = useState<"np" | "pickup">("np");
  const [payment, setPayment] = useState<"online" | "cod">("online");

  const deliveryCost = delivery === "np" ? 90 : 0;
  const grandTotal = totalPrice + deliveryCost;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO Etap 4: відправка в Airtable «Замовлення» + hutko інтеграція
    const orderNo = `BS-${String(Math.floor(Math.random() * 1000000)).padStart(6, "0")}`;
    try { sessionStorage.setItem("bs_last_order", orderNo); } catch {}
    clear();
    router.push("/confirmation");
  }

  if (!isHydrated) return null;

  if (items.length === 0) {
    return (
      <section className="screen active"><div className="container checkout">
        <div className="empty">
          <h3>Кошик порожній</h3>
          <p>Оформити замовлення можна тільки з товарами у кошику.</p>
          <Link href="/catalog" className="btn btn-primary btn-lg">До каталогу</Link>
        </div>
      </div></section>
    );
  }

  return (
    <section className="screen active" data-screen="checkout"><div className="container checkout">
      <Link href="/cart" className="back-btn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        Назад
      </Link>
      <h1 style={{ marginTop: 8 }}>Оформлення <em>замовлення</em></h1>

      <div className="checkout-grid">
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-card">
            <h3><span className="num-circle">1</span> Контактні дані</h3>
            <div className="row2">
              <div className="field">
                <label>Ім&apos;я</label>
                <input type="text" name="name" placeholder="Як до Вас звертатись" autoComplete="name" required />
              </div>
              <div className="field">
                <label>Телефон</label>
                <input type="tel" name="phone" placeholder="+380 __ ___ __ __" autoComplete="tel" required />
              </div>
            </div>
          </div>

          <div className="form-card">
            <h3><span className="num-circle">2</span> Доставка</h3>
            <div className="radio-group">
              <label className={`radio-card ${delivery === "np" ? "active" : ""}`}>
                <input type="radio" name="delivery" value="np" checked={delivery === "np"} onChange={() => setDelivery("np")} />
                <span className="radio-dot" />
                <span className="radio-content">
                  <span className="radio-title">Нова Пошта · 1–2 дні</span>
                  <span className="radio-sub">По всій Україні, безпечно у відділення</span>
                </span>
              </label>
              <label className={`radio-card ${delivery === "pickup" ? "active" : ""}`}>
                <input type="radio" name="delivery" value="pickup" checked={delivery === "pickup"} onChange={() => setDelivery("pickup")} />
                <span className="radio-dot" />
                <span className="radio-content">
                  <span className="radio-title">Самовивіз із салону · безкоштовно</span>
                  <span className="radio-sub">ТЦ «Дельта», 2 поверх, Ізмаїл</span>
                </span>
              </label>
            </div>

            {delivery === "np" && (
              <div style={{ marginTop: 16 }}>
                <div className="row2">
                  <div className="field">
                    <label>Місто</label>
                    <input type="text" name="city" placeholder="Київ, Львів, Одеса…" list="citiesList" />
                    <datalist id="citiesList">
                      <option value="Київ" />
                      <option value="Львів" />
                      <option value="Одеса" />
                      <option value="Харків" />
                      <option value="Дніпро" />
                      <option value="Вінниця" />
                      <option value="Полтава" />
                      <option value="Чернівці" />
                      <option value="Ізмаїл" />
                    </datalist>
                  </div>
                  <div className="field">
                    <label>Відділення</label>
                    <select name="branch">
                      <option value="">Оберіть зі списку…</option>
                      <option>№ 1 (вул. Хрещатик, 22)</option>
                      <option>№ 4 (вул. Сагайдачного, 14)</option>
                      <option>№ 7 (просп. Перемоги, 88)</option>
                      <option>№ 12 (вул. Шевченка, 5)</option>
                      <option>№ 25 (вул. Соборна, 110)</option>
                      <option>№ 37 (вул. Незалежності, 64)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="form-card">
            <h3><span className="num-circle">3</span> Оплата</h3>
            <div className="radio-group">
              <label className={`radio-card ${payment === "online" ? "active" : ""}`}>
                <input type="radio" name="payment" value="online" checked={payment === "online"} onChange={() => setPayment("online")} />
                <span className="radio-dot" />
                <span className="radio-content">
                  <span className="radio-title">Передоплата онлайн</span>
                  <span className="radio-sub">Картою або Apple/Google Pay після підтвердження</span>
                </span>
              </label>
              <label className={`radio-card ${payment === "cod" ? "active" : ""}`}>
                <input type="radio" name="payment" value="cod" checked={payment === "cod"} onChange={() => setPayment("cod")} />
                <span className="radio-dot" />
                <span className="radio-content">
                  <span className="radio-title">При отриманні</span>
                  <span className="radio-sub">Готівкою чи карткою при отриманні замовлення</span>
                </span>
              </label>
            </div>
          </div>

          <div className="form-card">
            <h3><span className="num-circle">4</span> Коментар</h3>
            <div className="field">
              <label>Особливі побажання (необов&apos;язково)</label>
              <textarea name="comment" rows={3} placeholder="Зателефонувати перед відправкою, упакувати в подарунок…" />
            </div>
          </div>
        </form>

        <aside className="summary">
          <h3>Ваше замовлення</h3>
          <div className="summary-list">
            {items.map((item) => (
              <div key={item.slug} className="summary-row">
                <span className="lbl">{item.name} × {item.quantity}</span>
                <span className="pr num">{item.price_uah * item.quantity} грн</span>
              </div>
            ))}
          </div>
          <div className="summary-row" style={{ marginTop: 6 }}>
            <span className="lbl" style={{ color: "var(--ink-3)", fontSize: 13.5 }}>Доставка</span>
            <span className="pr num">{deliveryCost === 0 ? "безкоштовно" : `${deliveryCost} грн`}</span>
          </div>
          <div className="summary-total">
            <span className="lbl">До сплати</span>
            <span className="val num">{grandTotal} грн</span>
          </div>
          <button type="submit" className="btn btn-purple btn-lg btn-full" onClick={handleSubmit}>
            <span>Підтвердити замовлення</span>
          </button>
          <p style={{ marginTop: 12, fontSize: 13, color: "var(--ink-3)", textAlign: "center" }}>
            Натискаючи кнопку, Ви погоджуєтесь з умовами обробки персональних даних.
          </p>
        </aside>
      </div>
    </div></section>
  );
}
