import Link from "next/link";
import { Logo, Sparkle } from "./Logo";

export function Footer() {
  return (
    <footer className="container-page pb-10 pt-10">
      <div className="bg-navy text-white rounded-bubble-lg shadow-bubble overflow-hidden relative">
        <Sparkle className="absolute top-8 right-10 w-8 opacity-40 animate-twinkle" fill="#F5DE46" />
        <Sparkle className="absolute bottom-10 left-12 w-5 opacity-30 animate-twinkle" fill="#B48BE0" />

        <div className="p-8 sm:p-12 grid lg:grid-cols-[1.5fr,1fr,1fr] gap-10">
          <div>
            <div className="inline-block bg-white/10 rounded-full px-4 py-2 mb-5">
              <Logo size="sm" />
            </div>
            <p className="text-[14px] text-white/70 leading-relaxed max-w-sm">
              студія краси та здоров&apos;я в Ізмаїлі. Догляд за руками й ногами
              від брендів, яким ми довіряємо.
            </p>
            <p className="text-[12px] text-white/40 mt-4">
              © 2026 Beauty &amp; Shine. Усі права захищені.
            </p>
          </div>

          <div>
            <h4 className="text-[12px] font-bold tracking-[2px] uppercase text-white/50 mb-3">Сайт</h4>
            <ul className="space-y-2 text-[14px]">
              <li><Link href="/catalog"  className="text-white/85 hover:text-accent transition-colors">Каталог</Link></li>
              <li><Link href="/about"    className="text-white/85 hover:text-accent transition-colors">Про нас</Link></li>
              <li><Link href="/delivery" className="text-white/85 hover:text-accent transition-colors">Доставка</Link></li>
              <li><Link href="/faq"      className="text-white/85 hover:text-accent transition-colors">FAQ</Link></li>
              <li><Link href="/contacts" className="text-white/85 hover:text-accent transition-colors">Контакти</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[12px] font-bold tracking-[2px] uppercase text-white/50 mb-3">З нами</h4>
            <div className="flex gap-2.5 mb-4">
              <a aria-label="Instagram" href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-accent hover:text-navy transition-colors flex items-center justify-center text-base">📷</a>
              <a aria-label="Telegram"  href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-accent hover:text-navy transition-colors flex items-center justify-center text-base">✈️</a>
              <a aria-label="Телефон"  href="tel:+380670000000" className="w-10 h-10 rounded-full bg-white/10 hover:bg-accent hover:text-navy transition-colors flex items-center justify-center text-base">📞</a>
            </div>
            <p className="text-[13px] text-white/70 leading-relaxed">
              ТЦ «Дельта», 2&nbsp;поверх<br />Ізмаїл
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
