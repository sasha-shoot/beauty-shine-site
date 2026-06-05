export const metadata = { title: "Контакти — Beauty & Shine" };

export default function ContactsPage() {
  return (
    <div className="space-y-4 sm:space-y-6 pt-6 pb-10">
      <section className="container-page">
        <div className="bubble rounded-bubble-lg">
          <span className="pill">Контакти</span>
          <h1 className="section-heading mt-4">Зв&apos;яжіться з нами</h1>
        </div>
      </section>

      <section className="container-page grid sm:grid-cols-2 gap-3 sm:gap-4">
        <a href="tel:+380670000000" className="bubble-sm bubble-sm-hover group">
          <div className="w-12 h-12 rounded-full bg-lavender group-hover:bg-primary group-hover:text-white flex items-center justify-center text-xl mb-3 transition-colors">📞</div>
          <h3 className="font-extrabold text-[16px]">Телефон</h3>
          <p className="text-[15px] text-primary font-bold mt-1">+380 67 000 00 00</p>
          <p className="text-[12.5px] text-ink mt-0.5">щодня 07:00–20:00</p>
        </a>
        <a href="https://t.me/beauty_shine_izmayil_bot" target="_blank" rel="noopener" className="bubble-sm bubble-sm-hover group">
          <div className="w-12 h-12 rounded-full bg-lavender group-hover:bg-primary group-hover:text-white flex items-center justify-center text-xl mb-3 transition-colors">✈️</div>
          <h3 className="font-extrabold text-[16px]">Telegram-бот</h3>
          <p className="text-[15px] text-primary font-bold mt-1">@beauty_shine_izmayil_bot</p>
          <p className="text-[12.5px] text-ink mt-0.5">запис і консультації 24/7</p>
        </a>
      </section>

      <section className="container-page">
        <div className="bubble rounded-bubble-lg">
          <span className="pill">Адреса</span>
          <h3 className="font-serif text-2xl font-semibold mt-3">Як нас знайти</h3>
          <p className="text-[15px] text-ink mt-3 leading-relaxed">
            <strong className="text-navy">ТЦ «Дельта», 2 поверх</strong><br />
            Ізмаїл, Одеська область
          </p>
          <a
            href="https://www.google.com/maps/search/?api=1&query=45.354524007391085,28.82962042698601"
            target="_blank" rel="noopener"
            className="btn-light mt-5 inline-flex"
          >
            🗺 Відкрити в Google Maps
          </a>
        </div>
      </section>
    </div>
  );
}
