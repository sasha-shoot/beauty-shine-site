export const metadata = { title: "FAQ — Beauty & Shine" };

const FAQ = [
  {
    q: "Які бренди продаєте?",
    a: "divapharm (українська професійна косметика для подології) та Veratin (засоби для рук, кутикули, нігтів). Тільки те, чим користуємось у студії самі.",
  },
  {
    q: "Як швидко доставляєте?",
    a: "Нова Пошта по всій Україні — 1–2 робочих дні після оплати. Самовивіз із салону — у день оплати.",
  },
  {
    q: "Як оплатити?",
    a: "Онлайн карткою (Visa, Mastercard, Apple Pay, Google Pay), при отриманні на Новій Пошті, або готівкою при самовивозі.",
  },
  {
    q: "Чи є повернення товару?",
    a: "Так, у межах 14 днів з моменту отримання, якщо товар не використовувався. Деталі — у пункті 5 Договору оферти.",
  },
  {
    q: "Як зв'язатись з консультантом?",
    a: "Найшвидше — через Telegram-бот @beauty_shine_izmayil_bot, там є ШІ-помічник 24/7 і можна замовити дзвінок майстра.",
  },
];

export default function FAQPage() {
  return (
    <section className="container-page py-12 max-w-3xl">
      <div className="eyebrow">FAQ</div>
      <h1 className="section-heading mt-2 mb-6">Часті питання</h1>

      <div className="space-y-3">
        {FAQ.map((item, i) => (
          <details key={i} className="bg-white rounded-2xl-soft p-5 group">
            <summary className="font-extrabold text-[15.5px] cursor-pointer list-none flex justify-between items-center">
              <span>{item.q}</span>
              <span className="text-primary text-xl group-open:rotate-45 transition-transform">+</span>
            </summary>
            <p className="text-[14.5px] text-ink mt-3 leading-relaxed">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
