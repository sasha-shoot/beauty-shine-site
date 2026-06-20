"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { useCart } from "@/lib/cart-context";
import { useUser } from "@/lib/user-context";
import { useRouter } from "next/navigation";
import { DeliveryPicker, type DeliveryValue } from "@/components/DeliveryPicker";

export default function CheckoutPage() {
  const { items, totalPrice, clear, isHydrated } = useCart();
  const { user } = useUser();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const [contact, setContact] = useState({ name: "", phone: "", comment: "" });
  const [delivery, setDelivery] = useState<DeliveryValue>({ method: "np_branch", city: "", point: "" });

  useEffect(() => {
    if (user) {
      setContact((c) => ({
        ...c,
        name: c.name || user.name || "",
        phone: c.phone || user.phone || "",
      }));
    }
  }, [user]);

  const onDelivery = useCallback((v: DeliveryValue) => setDelivery(v), []);

  function updateContact(k: keyof typeof contact) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setContact((c) => ({ ...c, [k]: e.target.value }));
  }

  async function handleSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (submitting) return;

    if (!contact.name.trim()) { alert("Введіть ім'я"); return; }
    if (contact.phone.replace(/\D/g, "").length < 10) { alert("Введіть коректний номер телефону"); return; }

    const isPickup = delivery.method === "pickup";
    if (!isPickup) {
      if (!delivery.city.trim()) { alert("Вкажіть місто доставки"); return; }
      if (!delivery.point.trim()) { alert("Оберіть відділення або поштомат"); return; }
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: contact.name,
          customer_phone: contact.phone,
          delivery_method: delivery.method,
          city: delivery.city,
          point: delivery.point,
          comment: contact.comment,
          items: items.map((i) => ({ name: i.name, qty: i.quantity, price: i.price_uah, variant: i.variant })),
          total: totalPrice,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        alert(data.error || "Не вдалося оформити замовлення. Спробуйте ще раз.");
        setSubmitting(false);
        return;
      }

      try { sessionStorage.setItem("bs_last_order", data.order_no); } catch {}
      clear();
      router.push("/confirmation");
    } catch (err) {
      console.error(err);
      alert("Мережева помилка. Спробуйте ще раз.");
      setSubmitting(false);
    }
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
                  value={contact.name}
                  onChange={updateContact("name")}
                />
              </div>
              <div className="field">
                <label>Телефон</label>
                <input
                  type="tel"
                  placeholder="+380 __ ___ __ __"
                  autoComplete="tel"
                  required
                  value={contact.phone}
                  onChange={updateContact("phone")}
                />
              </div>
            </div>
          </div>

          <DeliveryPicker onChange={onDelivery} />

          <div className="form-card">
            <h3><span className="num-circle">3</span> Коментар</h3>
            <div className="field">
              <label>Особливі побажання (необов&apos;язково)</label>
              <textarea
                rows={3}
                placeholder="Зателефонувати перед відправкою, упакувати в подарунок…"
                value={contact.comment}
                onChange={updateContact("comment")}
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
            onClick={() => handleSubmit()}
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
