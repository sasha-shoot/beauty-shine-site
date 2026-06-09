"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function ConfirmationPage() {
  const [orderNo, setOrderNo] = useState("№ BS-000000");

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("bs_last_order");
      if (stored) setOrderNo(`№ ${stored}`);
    } catch {}
  }, []);

  return (
    <section className="screen active" data-screen="success">
      <div className="container confirm">
        <div className="confirm-card">
          <div className="confirm-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h2>Дякуємо! <em>Замовлення прийняте</em></h2>
          <div className="order-no">{orderNo}</div>
          <p>Ми надіслали підтвердження на Ваш телефон. Менеджер зв&apos;яжеться протягом години у робочий час.</p>

          <div className="next-steps">
            <div><b>1</b><span>Менеджер передзвонить для уточнення деталей</span></div>
            <div><b>2</b><span>Ми відправимо замовлення Новою Поштою або підготуємо до самовивозу</span></div>
            <div><b>3</b><span>Ви отримуєте посилку і насолоджуєтесь доглядом ✦</span></div>
          </div>

          <Link href="/" className="btn btn-primary btn-lg">Повернутись до магазину</Link>
        </div>
      </div>
    </section>
  );
}
