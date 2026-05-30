import Link from "next/link";

export const metadata = { title: "Доставка — Beauty & Shine" };

export default function DeliveryPage() {
  return (
    <section className="container-page py-12 max-w-3xl">
      <div className="eyebrow">Доставка</div>
      <h1 className="section-heading mt-2 mb-6">Як отримати замовлення</h1>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-2xl-soft p-5">
          <div className="text-3xl mb-2">🚚</div>
          <h3 className="font-extrabold text-lg">Нова Пошта</h3>
          <p className="text-[14px] text-ink mt-1">
            Відправка по всій Україні протягом 1–2 робочих днів після оплати.
            Доставка на відділення або поштомат.
          </p>
        </div>
        <div className="bg-white rounded-2xl-soft p-5">
          <div className="text-3xl mb-2">🏬</div>
          <h3 className="font-extrabold text-lg">Самовивіз із салону</h3>
          <p className="text-[14px] text-ink mt-1">
            ТЦ «Дельта», 2 поверх, Ізмаїл. Щодня 07:00–20:00. Заберіть у зручний час.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl-soft p-6">
        <h3 className="font-serif text-xl font-semibold mb-3">Оплата</h3>
        <ul className="space-y-2 text-[14.5px] text-ink">
          <li>💳 Онлайн картою — Visa, Mastercard, Apple Pay, Google Pay</li>
          <li>💵 Оплата при отриманні в поштоматі чи відділенні Нової Пошти</li>
          <li>🤝 Готівка / переказ при самовивозі із салону</li>
        </ul>
      </div>

      <div className="mt-6">
        <Link href="/catalog" className="btn-primary">До каталогу</Link>
      </div>
    </section>
  );
}
