import Link from "next/link";

export default function HomePage() {
  return (
    <>
      {/* ░░ HERO ░░ */}
      <section className="container-page pt-12 pb-14 sm:pt-14 sm:pb-16 grid lg:grid-cols-[1.05fr_0.95fr] gap-10 items-center">
        <div className="animate-rise [animation-delay:.05s]">
          <div className="eyebrow mb-4">Beauty &amp; Shine · Ізмаїл</div>
          <h1 className="font-serif font-semibold text-[clamp(38px,5.5vw,64px)] leading-[1.07] tracking-tight">
            Догляд, що <em className="italic text-primary">сяє</em> разом із вами
          </h1>
          <p className="mt-5 text-[17px] text-ink max-w-md">
            Професійні засоби для рук і ніг від брендів, яким довіряють наші
            майстри. Підібрано в студії — доставляємо по всій Україні.
          </p>
          <div className="mt-7 flex gap-3 flex-wrap">
            <Link href="/catalog" className="btn-primary">Перейти до каталогу</Link>
            <Link href="/about"   className="btn-ghost">Про нас</Link>
          </div>
        </div>

        {/* Hero ілюстрація — плоский флакон з іскрами */}
        <div className="relative aspect-square flex items-center justify-center animate-rise [animation-delay:.18s] order-first lg:order-none max-w-[330px] mx-auto lg:max-w-none">
          <div className="absolute inset-[5%] bg-gradient-to-br from-primary-light to-primary rounded-[46%_54%_58%_42%/48%_44%_56%_52%] animate-morph" />
          <svg viewBox="0 0 120 200" fill="none" className="relative z-10 w-[44%] drop-shadow-[0_18px_26px_rgba(22,33,62,0.25)]">
            <rect x="48" y="6" width="24" height="22" rx="4" fill="#16213E" />
            <rect x="40" y="26" width="40" height="12" rx="4" fill="#F5DE46" />
            <path d="M30 52c0-8 6-14 14-14h32c8 0 14 6 14 14v118c0 12-9 22-21 22H51c-12 0-21-10-21-22V52Z" fill="#FFFFFF" />
            <path d="M30 108h60v62c0 12-9 22-21 22H51c-12 0-21-10-21-22v-62Z" fill="#F3EEFF" />
            <circle cx="60" cy="96" r="20" fill="#9D66D6" />
            <path d="M60 84l3.2 9.8L73 97l-9.8 3.2L60 110l-3.2-9.8L47 97l9.8-3.2L60 84Z" fill="#fff" />
          </svg>
          {/* Декоративні іскри */}
          <svg className="absolute top-[7%] right-[13%] w-11 z-20 animate-twinkle" viewBox="0 0 24 24" style={{ animationDelay: "0.2s" }}>
            <path d="M12 0l2.2 9.8L24 12l-9.8 2.2L12 24l-2.2-9.8L0 12l9.8-2.2L12 0Z" fill="#F5DE46" />
          </svg>
          <svg className="absolute bottom-[13%] left-[8%] w-7 z-20 animate-twinkle" viewBox="0 0 24 24" style={{ animationDelay: "1.1s" }}>
            <path d="M12 0l2.2 9.8L24 12l-9.8 2.2L12 24l-2.2-9.8L0 12l9.8-2.2L12 0Z" fill="#fff" />
          </svg>
          <svg className="absolute top-[44%] right-[3%] w-5 z-20 animate-twinkle" viewBox="0 0 24 24" style={{ animationDelay: "2s" }}>
            <path d="M12 0l2.2 9.8L24 12l-9.8 2.2L12 24l-2.2-9.8L0 12l9.8-2.2L12 0Z" fill="#16213E" />
          </svg>
        </div>
      </section>

      {/* ░░ ХІТИ — поки порожній стан ░░ */}
      <section className="container-page py-14">
        <div className="text-center mb-8">
          <div className="eyebrow">Каталог</div>
          <h2 className="section-heading mt-2">Скоро тут будуть товари</h2>
          <p className="text-ink mt-2.5 max-w-md mx-auto">
            Готуємо каталог від брендів divapharm та Veratin. Загляньте трохи пізніше.
          </p>
        </div>
        <div className="text-center">
          <Link href="/contacts" className="btn-ghost">Зв&apos;язатись з нами</Link>
        </div>
      </section>

      {/* ░░ ПРО НАС ░░ */}
      <section className="container-page">
        <div className="bg-navy text-white rounded-[30px] py-12 px-6 sm:px-10">
          <div className="max-w-[1040px] mx-auto grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="font-serif font-semibold text-[clamp(28px,4vw,40px)] leading-tight tracking-tight">
                Сімейна студія <em className="italic text-accent">краси та здоров&apos;я</em>
              </h2>
              <p className="mt-5 text-[16px] text-[#cdc9d9]">
                Beauty &amp; Shine — це родинна справа в Ізмаїлі. Іван веде педикюр
                і подологію, Ірина — манікюр та догляд за руками.
              </p>
              <p className="mt-3 text-[14px] text-[#a39fb4]">
                Понад 300 клієнтів щомісяця довіряють нам свої руки й ноги.
                Ми відібрали засоби, якими користуємось самі у студії — щоб ви
                могли продовжити професійний догляд удома.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              {[
                { ic: "💜", t: "Підібрано майстрами", d: "Кожен засіб перевірений у роботі з клієнтами" },
                { ic: "✨", t: "Перевірені бренди",   d: "divapharm та Veratin — професійна косметика" },
                { ic: "📦", t: "Доставка по Україні", d: "Нова Пошта або самовивіз із салону" },
              ].map((v) => (
                <div key={v.t} className="bg-white/[0.06] border border-white/[0.09] rounded-2xl p-4 flex gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-xl shrink-0">
                    {v.ic}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-[14.5px]">{v.t}</h4>
                    <p className="text-[12.5px] text-[#a39fb4] mt-0.5">{v.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ░░ ДОСТАВКА ░░ */}
      <section className="container-page py-12 grid sm:grid-cols-2 gap-4">
        {[
          { ic: "🚚", t: "Нова Пошта", d: "Відправка по Україні протягом 1–2 днів" },
          { ic: "🏬", t: "Самовивіз із салону", d: "ТЦ «Дельта», 2 поверх, Ізмаїл" },
        ].map((d) => (
          <div key={d.t} className="bg-white rounded-2xl-soft p-5 flex gap-4 items-center">
            <div className="w-[52px] h-[52px] rounded-2xl bg-lavender flex items-center justify-center text-2xl shrink-0">
              {d.ic}
            </div>
            <div>
              <h4 className="font-extrabold text-[15.5px]">{d.t}</h4>
              <p className="text-[13px] text-ink mt-0.5">{d.d}</p>
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
