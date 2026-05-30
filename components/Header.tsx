import Link from "next/link";
import { Logo } from "./Logo";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-lavender/90 backdrop-blur-md border-b border-lavender-deep">
      <div className="container-page py-3.5 flex items-center justify-between">
        <Logo />
        <nav className="hidden md:flex gap-7 text-[14.5px] font-semibold text-ink">
          <Link href="/catalog"  className="hover:text-primary transition-colors">Каталог</Link>
          <Link href="/about"    className="hover:text-primary transition-colors">Про нас</Link>
          <Link href="/delivery" className="hover:text-primary transition-colors">Доставка</Link>
          <Link href="/contacts" className="hover:text-primary transition-colors">Контакти</Link>
        </nav>
        <div className="flex gap-2.5">
          <Link
            href="/catalog"
            aria-label="Каталог"
            className="md:hidden w-10 h-10 rounded-[13px] bg-white text-navy flex items-center justify-center hover:bg-lavender-deep transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
          </Link>
          <Link
            href="/cart"
            aria-label="Кошик"
            className="w-10 h-10 rounded-[13px] bg-primary text-white flex items-center justify-center hover:bg-primary-dark hover:-translate-y-0.5 transition-all"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
            </svg>
          </Link>
        </div>
      </div>
    </header>
  );
}
