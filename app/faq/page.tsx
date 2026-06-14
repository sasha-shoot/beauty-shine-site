"use client";

import Link from "next/link";
import { useState } from "react";

const FAQ_GROUPS = [
  {
    title: "Замовлення та доставка",
    items: [
      {
        q: "Як зробити замовлення?",
        a: "Оберіть товари в каталозі, додайте їх у кошик і перейдіть до оформлення. Вкажіть контактні дані та спосіб доставки — ми зв'яжемося для підтвердження. Замовити також можна через наш Telegram-бот.",
      },
      {
        q: "Скільки коштує доставка?",
        a: "Самовивіз зі студії — безкоштовно. Нова Пошта — за тарифами перевізника. Кур'єр по Ізмаїлу — вартість узгоджуємо при підтвердженні замовлення.",
      },
      {
        q: "Як швидко прийде замовлення?",
        a: "Новою Поштою — зазвичай 1–3 робочі дні. Якщо оформите до 14:00, відправляємо того ж дня. Кур'єром по Ізмаїлу — у день замовлення або на зручний для вас час.",
      },
      {
        q: "Чи можна відстежити посилку?",
        a: "Так, після відправлення ми надішлемо вам номер ТТН Нової Пошти, за яким можна відстежити рух посилки.",
      },
    ],
  },
  {
    title: "Оплата та повернення",
    items: [
      {
        q: "Які способи оплати доступні?",
        a: "Можна оплатити карткою чи переказом заздалегідь, або при отриманні — післяплатою на Новій Пошті, готівкою чи карткою при самовивозі та доставці кур'єром.",
      },
      {
        q: "Чи можна повернути товар?",
        a: "Так, протягом 14 днів — за умови, що товар не розпакований, у заводській упаковці, без слідів використання та зі збереженими пломбами. Детальніше — на сторінці «Повернення».",
      },
      {
        q: "Товар приїхав пошкодженим. Що робити?",
        a: "Одразу напишіть нам у Telegram із фото товару. Ми замінимо його або повернемо кошти за наш рахунок — це не підпадає під звичайні умови повернення.",
      },
    ],
  },
  {
    title: "Товари та підбір",
    items: [
      {
        q: "Як обрати засіб під свою потребу?",
        a: "Напишіть нашому Telegram-боту — там є ШІ-помічник, який підкаже засіб під ваш тип шкіри чи нігтів. Або зверніться до нас напряму: наші майстри радять тільки те, що справді потрібно, без нав'язування.",
      },
      {
        q: "Ваша продукція оригінальна?",
        a: "Так, ми працюємо лише з оригінальною сертифікованою продукцією перевірених брендів, якою користуються наші майстри у студії.",
      },
      {
        q: "Чи можна купити те, чим користуються майстри в студії?",
        a: "Звісно! Більшість засобів у каталозі — саме ті, що ми використовуємо на процедурах. Тому ви отримуєте салонний догляд вдома.",
      },
    ],
  },
  {
    title: "Запис на процедури",
    items: [
      {
        q: "Як записатися на манікюр чи педикюр?",
        a: "Найзручніше — через наш Telegram-бот: оберіть послугу, дату й час, і запис підтвердиться автоматично. Бот також нагадає про візит заздалегідь.",
      },
      {
        q: "Чи можна скасувати запис?",
        a: "Так. У боті або в особистому кабінеті на сайті ви можете керувати своїми записами. Якщо плани змінились — просто повідомте нас завчасно.",
      },
      {
        q: "Що таке програма лояльності?",
        a: "За замовлення та візити ви отримуєте бонуси, які накопичуються на вашому рахунку. Досягнувши потрібної суми, отримуєте знижку на наступне замовлення. Деталі — у Telegram-боті.",
      },
    ],
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq-item ${open ? "open" : ""}`}>
      <button className="faq-q" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <span>{q}</span>
        <svg className="faq-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      <div className="faq-a-wrap">
        <p className="faq-a">{a}</p>
      </div>
    </div>
  );
}

export default function FaqPage() {
  return (
    <section className="screen active" data-screen="info">
      <div className="container info-container">
        <Link href="/" className="back-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          Назад
        </Link>

        <div className="info-head reveal">
          <div className="eyebrow">Клієнтам</div>
          <h1>Питання та <em>відповіді</em></h1>
          <p className="info-intro">Зібрали відповіді на найчастіші запитання. Не знайшли своє — напишіть нам у Telegram, відповімо швидко.</p>
        </div>

        <div className="faq-wrap reveal">
          {FAQ_GROUPS.map((group) => (
            <div key={group.title} className="faq-group">
              <h2 className="faq-group-title">{group.title}</h2>
              {group.items.map((item) => (
                <FaqItem key={item.q} q={item.q} a={item.a} />
              ))}
            </div>
          ))}
        </div>

        <div className="info-cta reveal">
          <div className="info-cta-inner">
            <div>
              <h3>Не знайшли відповідь?</h3>
              <p>Напишіть нам у Telegram-бот — допоможемо з будь-яким питанням.</p>
            </div>
            <a className="btn btn-purple btn-lg" href="https://t.me/beauty_shine_izmayil_bot" target="_blank" rel="noopener">
              Написати в Telegram
              <svg className="arr" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
