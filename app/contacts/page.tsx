export const metadata = { title: "Контакти — Beauty & Shine" };

export default function ContactsPage() {
  return (
    <section className="container-page py-12 max-w-3xl">
      <div className="eyebrow">Контакти</div>
      <h1 className="section-heading mt-2 mb-6">Звʼяжіться з нами</h1>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <a href="tel:+380670000000" className="bg-white rounded-2xl-soft p-5 hover:shadow-soft transition-shadow">
          <div className="text-3xl mb-2">📞</div>
          <h3 className="font-extrabold text-lg">Телефон</h3>
          <p className="text-[14px] text-primary font-semibold mt-1">+380 67 000 00 00</p>
          <p className="text-[12.5px] text-ink mt-0.5">щодня 07:00–20:00</p>
        </a>
        <a href="https://t.me/beauty_shine_izmayil_bot" target="_blank" rel="noopener" className="bg-white rounded-2xl-soft p-5 hover:shadow-soft transition-shadow">
          <div className="text-3xl mb-2">✈️</div>
          <h3 className="font-extrabold text-lg">Telegram-бот</h3>
          <p className="text-[14px] text-primary font-semibold mt-1">@beauty_shine_izmayil_bot</p>
          <p className="text-[12.5px] text-ink mt-0.5">запис і консультації 24/7</p>
        </a>
      </div>

      <div className="bg-white rounded-2xl-soft p-6">
        <h3 className="font-serif text-xl font-semibold mb-3">Адреса студії</h3>
        <p className="text-[15px]">
          <strong>ТЦ «Дельта», 2 поверх</strong><br />
          Ізмаїл, Одеська область<br />
          <a
            href="https://www.google.com/maps/search/?api=1&query=45.354524007391085,28.82962042698601"
            target="_blank" rel="noopener"
            className="text-primary hover:underline mt-2 inline-block"
          >
            🗺 Відкрити в Google Maps
          </a>
        </p>
      </div>
    </section>
  );
}
