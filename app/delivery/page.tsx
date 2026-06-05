import Link from "next/link";

export const metadata = { title: "Доставка — Beauty & Shine" };

export default function DeliveryPage() {
  return (
    <div className="space-y-4 sm:space-y-6 pt-6 pb-10">
      <section className="container-page">
        <div className="bubble rounded-bubble-lg">
          <span className="pill">Доставка</span>
          <h1 className="section-heading mt-4">Як отримати замовлення</h1>
        </div>
      </section>

      <section className="container-page grid sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="bubble-sm bubble-sm-hover sm:translate-y-3">
          <div className="w-14 h-14 rounded-full bg-lavender flex items-center justify-center text-2xl mb-4">🚚</div>
          <h3 className="font-extrabold text-[18px]">Нова Пошта</h3>
          <p className="text-[14px] text-ink mt-2 leading-relaxed">
            Відправка по всій Україні протягом 1–2 робочих днів після оплати.
            Доставка на відділення або поштомат.
          </p>
        </div>
        <div className="bubble-sm bubble-sm-hover">
          <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center text-2xl mb-4">🏬</div>
          <h3 className="font-extrabold text-[18px]">Самовивіз із салону</h3>
          <p className="text-[14px] text-ink mt-2 leading-relaxed">
            ТЦ «Дельта», 2 поверх, Ізмаїл. Щодня 07:00–20:00. Заберіть у зручний час.
          </p>
        </div>
      </section>

      <section className="container-page">
        <div className="bubble rounded-bubble-lg">
          <span className="pill-accent">Оплата</span>
          <h3 className="font-serif text-2xl font-semibold mt-3 mb-4">Способи оплати</h3>
          <ul className="space-y-2.5 text-[14.5px] text-ink">
            <li className="flex items-start gap-3"><span className="text-lg shrink-0">💳</span><span><strong className="text-navy">Онлайн карткою</strong> — Visa, Mastercard, Apple Pay, Google Pay</span></li>
            <li className="flex items-start gap-3"><span className="text-lg shrink-0">💵</span><span><strong className="text-navy">При отриманні</strong> у відділенні чи поштоматі Нової Пошти</span></li>
            <li className="flex items-start gap-3"><span className="text-lg shrink-0">🤝</span><span><strong className="text-navy">Готівка / переказ</strong> при самовивозі із салону</span></li>
          </ul>
          <Link href="/catalog" className="btn-primary mt-6">До каталогу</Link>
        </div>
      </section>
    </div>
  );
}
