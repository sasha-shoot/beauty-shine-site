import Link from "next/link";
import { Logo } from "./Logo";

export function Header() {
  return (
    <header className="sticky top-3 sm:top-5 z-50 px-3 sm:px-5 mt-3 sm:mt-5">
      <div className="max-w-page mx-auto">
        <div className="bg-white/90 backdrop-blur-md rounded-full shadow-pill px-4 sm:px-5 py-2 sm:py-2.5 flex items-center justify-between gap-3">
          <div className="pl-1.5">
            <Logo />
          </div>

          <nav className="hidden lg:flex gap-1 text-[14px] font-semibold text-ink">
            <Link href="/catalog"  className="px-4 py-2 rounded-full hover:bg-lavender hover:text-navy transition-colors">Каталог</Link>
            <Link href="/about"    className="px-4 py-2 rounded-full hover:bg-lavender hover:text-navy transition-colors">Про нас</Link>
            <Link href="/delivery" className="px-4 py-2 rounded-full hover:bg-lavender hover:text-navy transition-colors">Доставка</Link>
            <Link href="/contacts" className="px-4 py-2 rounded-full hover:bg-lavender hover:text-navy transition-colors">Контакти</Link>
          </nav>

          <div className="flex gap-2">
            <Link
              href="/catalog"
              aria-label="Каталог"
              className="lg:hidden w-9 h-9 rounded-full bg-lavender text-navy flex items-center justify-center hover:bg-lavender-deep transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" />
              </svg>
            </Link>
            <Link
              href="/cart"
              aria-label="Кошик"
              className="inline-flex items-center gap-2 bg-navy text-white pl-3.5 pr-4 py-2 rounded-full hover:bg-primary transition-all hover:-translate-y-px"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
              </svg>
              <span className="text-[13px] font-bold hidden sm:inline">Кошик</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
