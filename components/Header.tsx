"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart-context";

export function Header() {
  const { totalCount, isHydrated } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Scrolled state на хедері (поведінка з мокапу)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header className={`header ${scrolled ? "scrolled" : ""}`} id="header">
        <div className="header-inner">
          <Link href="/" className="logo">
            <span className="logo-mark">
              <svg width="19" height="21" viewBox="0 0 20 22" fill="none">
                <path d="M7 1.5h6v2.6l1.8 1.4c.7.55 1.2 1.4 1.2 2.3v10.7c0 1.4-1.1 2.5-2.5 2.5h-7C5.1 21 4 19.9 4 18.5V7.8c0-.9.45-1.75 1.2-2.3L7 4.1V1.5z" fill="#FFFFFF"/>
                <circle cx="10" cy="14" r="3" fill="#F5DE46"/>
                <path d="M16.5 3.5L17 5l1.5.5L17 6l-.5 1.5L16 6l-1.5-.5L16 5l.5-1.5z" fill="#F5DE46"/>
              </svg>
            </span>
            <span className="logo-word">beauty<span className="amp">&amp;</span>shine</span>
          </Link>

          <nav className="nav">
            <Link href="/catalog" className="nav-btn">Каталог</Link>
            <Link href="/#results" className="nav-btn">Послуги</Link>
            <Link href="/#studio" className="nav-btn">Про нас</Link>
            <Link href="/#features" className="nav-btn">Доставка</Link>
            <Link href="/#blog" className="nav-btn">Блог</Link>
            <Link href="/#site-footer" className="nav-btn">Контакти</Link>
          </nav>

          <div className="header-right">
            <button className="icon-btn burger" onClick={() => setMenuOpen(true)} aria-label="Меню">
              <svg viewBox="0 0 24 24"><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/></svg>
            </button>
            <Link href="/cart" className="cart-pill" aria-label="Кошик">
              <span className="cp-ic">
                <svg viewBox="0 0 24 24"><path d="M5 7h14l-1.5 9.5a2 2 0 0 1-2 1.7H8.5a2 2 0 0 1-2-1.7L5 7z"/><path d="M8 7V5a4 4 0 0 1 8 0v2"/></svg>
              </span>
              <span className="cp-label">Кошик</span>
              <span className="cart-count">{isHydrated ? totalCount : 0}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="menu-sheet" style={{display:"flex"}} onClick={() => setMenuOpen(false)}>
          <div className="menu-backdrop" />
          <div className="menu-panel" onClick={(e) => e.stopPropagation()}>
            <button className="icon-btn menu-close" onClick={() => setMenuOpen(false)} aria-label="Закрити">
              <svg viewBox="0 0 24 24"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>
            </button>
            <Link href="/catalog"    className="menu-link" onClick={() => setMenuOpen(false)}>Каталог</Link>
            <Link href="/#results"   className="menu-link" onClick={() => setMenuOpen(false)}>Послуги</Link>
            <Link href="/#studio"    className="menu-link" onClick={() => setMenuOpen(false)}>Про нас</Link>
            <Link href="/#features"  className="menu-link" onClick={() => setMenuOpen(false)}>Доставка</Link>
            <Link href="/#blog"      className="menu-link" onClick={() => setMenuOpen(false)}>Блог</Link>
            <Link href="/#site-footer" className="menu-link" onClick={() => setMenuOpen(false)}>Контакти</Link>
          </div>
        </div>
      )}
    </>
  );
}
