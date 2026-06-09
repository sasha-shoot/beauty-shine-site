"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useCart } from "@/lib/cart-context";
import { useUser } from "@/lib/user-context";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { items, totalPrice, clear, isHydrated } = useCart();
  const { user } = useUser();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  // Префіл з даних користувача, якщо є
  const [form, setForm] = useState({
    name: "",
    phone: "",
    city: "",
    branch: "",
    comment: "",
  });
  useEffect(() => {
    if (user) {
      setForm((f) => ({
        ...f,
        name: f.name || user.name || "",
        phone: f.phone || user.phone || "",
        city: f.city || user.city || "",
      }));
    }
  }, [user]);

  function update(k: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;

    if (!form.name.trim()) { alert("Введіть ім'я"); return; }
    if (form.phone.replace(/\D/g, "").length < 10) { alert("Введіть коректний номер телефону"); return; }
    if (!form.city.trim()) { alert("Вкажіть місто"); return; }
    if (!form.branch.trim()) { alert("Оберіть відділення"); return; }

    setSubmitting(true);

    const orderNo = `BS-${String(Math.floor(Math.random() * 1000000)).padStart(6, "0")}`;
    try {
      sessionStorage.setItem("bs_last_order", orderNo);
    } catch {}

    // TODO Etap 4: реальна відправка в Airtable «Замовлення» + повідомлення в Telegram-бот
    // POST /api/orders { order_no, user_id, customer_name, customer_phone, items, total, address, comment }

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
                <input
                  type="text"
                  placeholder="Як до Вас звертатись"
                  autoComplete="name"
                  required
                  value={form.name}
                  onChange={update("name")}
                />
              </div>
              <div className="field">
                <label>Телефон</label>
                <input
                  type="tel"
                  placeholder="+380 __ ___ __ __"
                  autoComplete="tel"
                  required
                  value={form.phone}
                  onChange={update("phone")}
                />
              </div>
            </div>
          </div>

          <div className="form-card">
            <h3><span className="num-circle">2</span> Адреса доставки</h3>
            <div className="row2">
              <div className="field">
                <label>Місто</label>
                <input
                  type="text"
                  placeholder="Київ, Львів, Одеса…"
                  list="citiesList"
                  value={form.city}
                  onChange={update("city")}
                />
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
                <label>Відділення Нової Пошти</label>
                <input
                  type="text"
                  placeholder="Наприклад: № 12 (вул. Шевченка, 5)"
                  value={form.branch}
                  onChange={update("branch")}
                />
              </div>
            </div>
            <p style={{ marginTop: 12, fontSize: 13, color: "var(--ink-3)", lineHeight: 1.5 }}>
              Відправляє посилку наш постачальник прямо до вас. Оплата за доставку — за тарифом Нової Пошти при отриманні.
            </p>
          </div>

          <div className="form-card">
            <h3><span className="num-circle">3</span> Коментар</h3>
            <div className="field">
              <label>Особливі побажання (необов&apos;язково)</label>
              <textarea
                rows={3}
                placeholder="Зателефонувати перед відправкою, упакувати в подарунок…"
                value={form.comment}
                onChange={update("comment")}
              />
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
          <div className="summary-total">
            <span className="lbl">До сплати</span>
            <span className="val num">{totalPrice} грн</span>
          </div>
          <button
            type="button"
            className="btn btn-purple btn-lg btn-full"
            onClick={handleSubmit}
            disabled={submitting}
          >
            <span>{submitting ? "Відправляємо…" : "Підтвердити замовлення"}</span>
          </button>
          <p style={{ marginTop: 12, fontSize: 13, color: "var(--ink-3)", textAlign: "center", lineHeight: 1.5 }}>
            Менеджер зв&apos;яжеться з Вами для уточнення оплати та підтвердження.
          </p>
        </aside>
      </div>
    </div></section>
  );
}
