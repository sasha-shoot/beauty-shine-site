import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="bg-white border-t border-lavender-deep mt-12">
      <div className="container-page py-9">
        <div className="flex justify-between items-start flex-wrap gap-7">
          <div>
            <Logo size="sm" />
            <p className="mt-2.5 text-[13px] text-ink leading-snug">
              студія краси та здоров&apos;я · Ізмаїл, ТЦ «Дельта»
              <br />
              © 2026 Beauty &amp; Shine. Усі права захищені.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-x-12 gap-y-2 text-[13px]">
            <Link href="/about"    className="text-ink hover:text-primary transition-colors">Про нас</Link>
            <Link href="/delivery" className="text-ink hover:text-primary transition-colors">Доставка</Link>
            <Link href="/contacts" className="text-ink hover:text-primary transition-colors">Контакти</Link>
            <Link href="/faq"      className="text-ink hover:text-primary transition-colors">FAQ</Link>
          </div>
          <div className="flex gap-2.5">
            <a className="w-10 h-10 rounded-[13px] bg-lavender flex items-center justify-center hover:bg-lavender-deep transition-colors" href="#" aria-label="Instagram">📷</a>
            <a className="w-10 h-10 rounded-[13px] bg-lavender flex items-center justify-center hover:bg-lavender-deep transition-colors" href="#" aria-label="Telegram">✈️</a>
            <a className="w-10 h-10 rounded-[13px] bg-lavender flex items-center justify-center hover:bg-lavender-deep transition-colors" href="tel:+380670000000" aria-label="Телефон">📞</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
