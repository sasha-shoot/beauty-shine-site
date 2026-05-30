import Link from "next/link";

export const metadata = { title: "Про нас — Beauty & Shine" };

export default function AboutPage() {
  return (
    <section className="container-page py-12 max-w-3xl">
      <div className="eyebrow">Про нас</div>
      <h1 className="section-heading mt-2 mb-6">Сімейна студія в Ізмаїлі</h1>

      <div className="bg-white rounded-2xl-soft p-6 sm:p-8 space-y-5">
        <p className="text-[16px] text-navy leading-relaxed">
          <strong>Beauty &amp; Shine</strong> — це родинна справа. Іван веде педикюр та
          подологію, Ірина — манікюр та догляд за руками. Понад 300 клієнтів
          щомісяця довіряють нам свої руки й ноги в нашій студії в ТЦ «Дельта».
        </p>
        <p className="text-[15px] text-ink leading-relaxed">
          Ми — перший салон в Україні, що пропонує клієнтам повноцінний бот-помічник
          для запису й консультацій. А тепер запускаємо магазин з тими самими засобами,
          якими користуємось у студії, щоб ви могли продовжити професійний догляд удома.
        </p>

        <div className="grid sm:grid-cols-2 gap-4 pt-2">
          <div className="bg-lavender rounded-xl p-4">
            <h3 className="font-serif text-xl font-semibold mb-1">Ірина</h3>
            <p className="text-[14px] text-ink">
              Майстер манікюру з 8+ річним стажем. Сертифікований спеціаліст,
              який постійно вдосконалює техніку.
            </p>
          </div>
          <div className="bg-lavender rounded-xl p-4">
            <h3 className="font-serif text-xl font-semibold mb-1">Іван</h3>
            <p className="text-[14px] text-ink">
              Подолог, один із найкращих фахівців в Україні. Сертифікований майстер
              з медичним підходом і справжньою турботою.
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-lavender-deep flex gap-3 flex-wrap">
          <Link href="/catalog"  className="btn-primary">До каталогу</Link>
          <Link href="/contacts" className="btn-ghost">Контакти</Link>
        </div>
      </div>
    </section>
  );
}
