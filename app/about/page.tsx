import Link from "next/link";
import { Sparkle } from "@/components/Logo";

export const metadata = { title: "Про нас — Beauty & Shine" };

export default function AboutPage() {
  return (
    <div className="space-y-4 sm:space-y-6 pt-6 pb-10">
      {/* Hero про нас */}
      <section className="container-page">
        <div className="bubble rounded-bubble-lg relative overflow-hidden">
          <Sparkle className="absolute top-8 right-12 w-9 opacity-25 animate-twinkle" fill="#9D66D6" />
          <span className="pill">Про нас</span>
          <h1 className="section-heading mt-4 max-w-2xl">
            Сімейна студія <em className="italic text-primary">в Ізмаїлі</em>
          </h1>
          <p className="mt-5 text-[16.5px] text-ink max-w-2xl leading-relaxed">
            <strong className="text-navy">Beauty &amp; Shine</strong> — це родинна справа. Іван веде педикюр та подологію,
            Ірина — манікюр і догляд за руками. Понад 300 клієнтів щомісяця
            довіряють нам свої руки й ноги.
          </p>
          <p className="mt-3 text-[15px] text-ink max-w-2xl leading-relaxed">
            Ми — перший салон в Україні з повноцінним бот-помічником для запису
            й консультацій. А тепер запускаємо магазин з тими самими засобами,
            якими користуємось у студії.
          </p>
        </div>
      </section>

      {/* Майстри — дві картки */}
      <section className="container-page grid sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="bubble-sm bubble-sm-hover">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-light to-primary flex items-center justify-center text-white font-serif text-2xl font-bold">І</div>
            <div>
              <h3 className="font-serif text-2xl font-semibold">Ірина</h3>
              <span className="pill text-[11px] mt-0.5">Майстер манікюру</span>
            </div>
          </div>
          <p className="text-[14px] text-ink leading-relaxed">
            Понад 8 років стажу. Сертифікований майстер, що постійно вдосконалює
            техніку та стежить за новинками нігтьового сервісу.
          </p>
        </div>
        <div className="bubble-sm bubble-sm-hover">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-navy to-[#3B4970] flex items-center justify-center text-white font-serif text-2xl font-bold">І</div>
            <div>
              <h3 className="font-serif text-2xl font-semibold">Іван</h3>
              <span className="pill text-[11px] mt-0.5">Подолог</span>
            </div>
          </div>
          <p className="text-[14px] text-ink leading-relaxed">
            Один із найкращих подологів в Україні. Сертифікований майстер,
            що поєднує медичний підхід зі справжньою турботою про клієнта.
          </p>
        </div>
      </section>

      <section className="container-page">
        <div className="flex gap-3 flex-wrap">
          <Link href="/catalog"  className="btn-primary">До каталогу</Link>
          <Link href="/contacts" className="btn-ghost">Контакти</Link>
        </div>
      </section>
    </div>
  );
}
