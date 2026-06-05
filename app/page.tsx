import Link from "next/link";
import { Sparkle } from "@/components/Logo";
import { ProductCard } from "@/components/ProductCard";
import { getFeaturedProducts } from "@/lib/airtable";

export const revalidate = 60;

export default async function HomePage() {
  const featured = await getFeaturedProducts(4);

  return (
    <div className="space-y-4 sm:space-y-6 pt-4 sm:pt-6">

      {/* ═══════════ HERO — багатошарова картка ═══════════ */}
      <section className="container-page">
        <div className="bubble rounded-bubble-xl relative overflow-hidden">
          {/* Декоративні іскри у фоні */}
          <Sparkle className="absolute top-8 right-12 w-10 opacity-25 animate-twinkle hidden md:block" fill="#9D66D6" />
          <Sparkle className="absolute bottom-12 left-10 w-7 opacity-30 animate-twinkle hidden md:block" fill="#F5DE46" />

          <div className="grid lg:grid-cols-[1.1fr,0.9fr] gap-10 lg:gap-14 items-center">
            {/* Left: текст */}
            <div className="animate-rise">
              <span className="eyebrow">
                <Sparkle className="w-3 h-3" fill="#9D66D6" />
                Ізмаїл · Beauty &amp; Shine
              </span>
              <h1 className="hero-heading mt-6">
                Догляд, <br />
                що <em className="italic text-primary">сяє</em> <br />
                разом із вами
              </h1>
              <p className="mt-6 text-[17px] text-ink max-w-md leading-relaxed">
                Професійні засоби для рук і ніг від брендів, яким довіряють
                наші майстри. Підібрано в студії — з доставкою по всій Україні.
              </p>
              <div className="mt-8 flex gap-3 flex-wrap">
                <Link href="/catalog" className="btn-primary">
                  Перейти до каталогу
                  <span aria-hidden>→</span>
                </Link>
                <Link href="/about" className="btn-ghost">Про нас</Link>
              </div>

              {/* Невелика капсула — соціальний доказ */}
              <div className="mt-9 inline-flex items-center gap-3 bg-lavender rounded-full p-1.5 pr-5">
                <div className="flex -space-x-2">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-light to-primary border-2 border-white" />
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent to-[#E0B93A] border-2 border-white" />
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-navy to-[#3B4970] border-2 border-white" />
                </div>
                <div className="text-[13px] leading-tight">
                  <div className="font-bold">300+ клієнтів</div>
                  <div className="text-ink">довіряють нам щомісяця</div>
                </div>
              </div>
            </div>

            {/* Right: візуал з floating-бейджами */}
            <div className="relative animate-rise [animation-delay:.15s] order-first lg:order-none mx-auto w-full max-w-[440px]">
              <div className="relative aspect-square bg-lavender rounded-bubble-xl overflow-hidden flex items-center justify-center">
                {/* Morphing blob */}
                <div className="absolute inset-[8%] bg-gradient-to-br from-primary-light to-primary rounded-[46%_54%_58%_42%/48%_44%_56%_52%] animate-morph" />
                {/* Bottle */}
                <svg viewBox="0 0 120 200" fill="none" className="relative z-10 w-[42%] drop-shadow-[0_18px_26px_rgba(22,33,62,0.25)]">
                  <rect x="48" y="6"  width="24" height="22" rx="4" fill="#16213E" />
                  <rect x="40" y="26" width="40" height="12" rx="4" fill="#F5DE46" />
                  <path d="M30 52c0-8 6-14 14-14h32c8 0 14 6 14 14v118c0 12-9 22-21 22H51c-12 0-21-10-21-22V52Z" fill="#FFFFFF" />
                  <path d="M30 108h60v62c0 12-9 22-21 22H51c-12 0-21-10-21-22v-62Z" fill="#F3EEFF" />
                  <circle cx="60" cy="96" r="20" fill="#9D66D6" />
                  <path d="M60 84l3.2 9.8L73 97l-9.8 3.2L60 110l-3.2-9.8L47 97l9.8-3.2L60 84Z" fill="#fff" />
                </svg>
                <Sparkle className="absolute top-[12%] right-[14%] w-12 z-20 animate-twinkle" fill="#F5DE46" />
                <Sparkle className="absolute bottom-[14%] left-[10%] w-7 z-20 animate-twinkle [animation-delay:1.1s]" fill="#fff" />
                <Sparkle className="absolute top-[44%] right-[5%]  w-5 z-20 animate-twinkle [animation-delay:2s]" fill="#16213E" />
              </div>

              {/* Floating badge — досвід */}
              <div className="absolute -top-3 -left-3 sm:-left-6 bg-white rounded-2xl shadow-bubble px-4 py-3 flex items-center gap-3 animate-float">
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-lg">✨</div>
                <div className="leading-tight">
                  <div className="font-extrabold text-[15px]">8+ років</div>
                  <div className="text-[11.5px] text-ink">досвіду майстрів</div>
                </div>
              </div>

              {/* Floating badge — доставка */}
              <div className="absolute -bottom-3 -right-3 sm:-right-6 bg-navy text-white rounded-2xl shadow-bubble px-4 py-3 animate-float [animation-delay:1.5s]">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">📦</span>
                  <div className="leading-tight">
                    <div className="font-bold text-[14px]">Доставка</div>
                    <div className="text-[11px] text-white/70">по всій Україні</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ VALUE PROPS (4 пілюлі) ═══════════ */}
      <section className="container-page">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[
            { ic: "🚚", t: "Швидка доставка", d: "Нова Пошта 1–2 дні" },
            { ic: "💜", t: "Підібрано майстрами", d: "Тільки те, чим користуємось" },
            { ic: "✨", t: "Перевірені бренди", d: "divapharm + Veratin" },
            { ic: "🏬", t: "Самовивіз", d: "ТЦ «Дельта», Ізмаїл" },
          ].map((v) => (
            <div key={v.t} className="bubble-sm bubble-sm-hover">
              <div className="w-12 h-12 rounded-full bg-lavender flex items-center justify-center text-xl mb-3">
                {v.ic}
              </div>
              <h3 className="font-extrabold text-[14.5px]">{v.t}</h3>
              <p className="text-[12.5px] text-ink mt-0.5 leading-snug">{v.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════ КАТЕГОРІЇ ─ pill-стиль (BUBBLZ) ═══════════ */}
      <section className="container-page">
        <div className="bubble rounded-bubble-lg">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-7">
            <div>
              <span className="pill mb-3">Каталог</span>
              <h2 className="section-heading mt-2">Оберіть категорію</h2>
            </div>
            <Link href="/catalog" className="btn-light">Усі товари <span aria-hidden>→</span></Link>
          </div>

          <div className="space-y-3">
            {[
              { cat: "Догляд за руками", count: "Крем, олії, скраби", grad: "from-primary-light to-primary" },
              { cat: "Догляд за ногами", count: "Креми, бальзами, гелі", grad: "from-accent to-[#E0B93A]" },
              { cat: "Нігтьовий догляд", count: "Сироватки, олія для кутикули", grad: "from-navy to-[#3B4970]" },
            ].map((c) => (
              <Link
                key={c.cat}
                href="/catalog"
                className={`group flex items-center gap-5 bg-gradient-to-r ${c.grad} rounded-full p-2 pr-6 transition-all hover:-translate-y-0.5 hover:shadow-bubble`}
              >
                <span className="bg-white rounded-full px-5 py-3 text-[14px] font-extrabold text-navy shrink-0">
                  {c.cat}
                </span>
                <span className="text-white/95 text-[13.5px] font-medium flex-1">{c.count}</span>
                <span className="bg-white/20 group-hover:bg-white group-hover:text-navy text-white w-9 h-9 rounded-full flex items-center justify-center transition-colors">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ ХІТИ ═══════════ */}
      <section className="container-page">
        <div className="bubble rounded-bubble-lg">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-7">
            <div>
              <span className="pill-accent mb-3">Хіти</span>
              <h2 className="section-heading mt-2">Обирають наші клієнти</h2>
            </div>
            <Link href="/catalog" className="btn-light">Увесь каталог <span aria-hidden>→</span></Link>
          </div>

          {featured.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {featured.map((p) => <ProductCard key={p.rec_id} product={p} />)}
            </div>
          ) : (
            <div className="bg-lavender rounded-bubble py-12 px-6 text-center">
              <p className="text-ink">Каталог наповнюємо — зайдіть пізніше</p>
              <Link href="/contacts" className="btn-primary mt-4">Звʼязатись з нами</Link>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════ ПРО НАС (dark bubble) ═══════════ */}
      <section className="container-page">
        <div className="bubble-dark relative overflow-hidden">
          <Sparkle className="absolute top-10 right-14 w-9 opacity-40 animate-twinkle" fill="#F5DE46" />
          <Sparkle className="absolute bottom-14 left-20 w-6 opacity-25 animate-twinkle [animation-delay:1.5s]" fill="#B48BE0" />

          <div className="grid lg:grid-cols-[1.05fr,0.95fr] gap-10 items-center max-w-[1040px] mx-auto relative z-10">
            <div>
              <span className="pill-dark bg-white/10 text-white mb-4">Про нас</span>
              <h2 className="section-heading text-white mt-2">
                Сімейна студія <em className="italic text-accent">краси та здоров&apos;я</em>
              </h2>
              <p className="mt-5 text-[16px] text-white/80 leading-relaxed">
                Beauty &amp; Shine — родинна справа в Ізмаїлі. Іван веде педикюр
                і подологію, Ірина — манікюр та догляд за руками.
              </p>
              <p className="mt-3 text-[14.5px] text-white/60 leading-relaxed">
                Понад 300 клієнтів щомісяця довіряють нам свої руки й ноги.
                Тепер ці самі засоби — у себе вдома.
              </p>
              <Link href="/about" className="btn-accent mt-7">Дізнатись більше</Link>
            </div>

            <div className="grid gap-3">
              {[
                { ic: "💜", t: "Підібрано майстрами", d: "Кожен засіб перевірений у роботі" },
                { ic: "✨", t: "Перевірені бренди",    d: "divapharm + Veratin — професійна косметика" },
                { ic: "📦", t: "Доставка по Україні",  d: "Нова Пошта або самовивіз із салону" },
              ].map((v) => (
                <div key={v.t} className="bg-white/[0.07] border border-white/10 rounded-2xl p-4 flex gap-3.5 backdrop-blur transition-colors hover:bg-white/[0.12]">
                  <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center text-xl shrink-0">
                    {v.ic}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-[14.5px]">{v.t}</h4>
                    <p className="text-[12.5px] text-white/60 mt-0.5">{v.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ ДОСТАВКА — асиметричні картки ═══════════ */}
      <section className="container-page grid sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="bubble-sm bubble-sm-hover sm:translate-y-3">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-lavender flex items-center justify-center text-xl">🚚</div>
            <span className="pill">Нова Пошта</span>
          </div>
          <h4 className="font-extrabold text-[17px]">По всій Україні</h4>
          <p className="text-[13.5px] text-ink mt-1.5 leading-relaxed">
            Відправляємо протягом 1–2 робочих днів після оплати. На відділення або поштомат.
          </p>
        </div>
        <div className="bubble-sm bubble-sm-hover">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-xl">🏬</div>
            <span className="pill-accent">Самовивіз</span>
          </div>
          <h4 className="font-extrabold text-[17px]">Із салону в Ізмаїлі</h4>
          <p className="text-[13.5px] text-ink mt-1.5 leading-relaxed">
            ТЦ «Дельта», 2 поверх. Щодня 07:00–20:00. Заберіть у зручний час.
          </p>
        </div>
      </section>

    </div>
  );
}
