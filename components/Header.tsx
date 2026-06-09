"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart-context";
import { useUI } from "@/lib/ui-context";
import { useUser } from "@/lib/user-context";

export function Header() {
  const { totalCount, isHydrated: cartHydrated } = useCart();
  const { openCart, openProfile } = useUI();
  const { user, isHydrated: userHydrated } = useUser();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/designer/logo-mark.png" alt="Beauty & Shine" style={{ height: 25, width: 32, opacity: 1 }} />
            </span>
            <span className="logo-word">beauty<span className="amp">&amp;</span>shine</span>
          </Link>

          <nav className="nav">
            <Link href="/catalog"        className="nav-btn">Каталог</Link>
            <Link href="/#results"       className="nav-btn">Послуги</Link>
            <Link href="/#studio"        className="nav-btn">Про нас</Link>
            <Link href="/reviews"        className="nav-btn">Відгуки</Link>
            <Link href="/#site-footer"   className="nav-btn">Контакти</Link>
          </nav>

          <div className="header-right">
            <button className="icon-btn burger" onClick={() => setMenuOpen(true)} aria-label="Меню">
              <svg viewBox="0 0 24 24"><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/></svg>
            </button>
            <button
              className={`icon-btn profile-btn ${userHydrated && user ? "logged" : ""}`}
              onClick={openProfile}
              aria-label="Профіль"
            >
              <svg className="pf-ic-default" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/></svg>
              <span className="pf-ic-avatar">{userHydrated && user ? user.initial : ""}</span>
            </button>
            <button onClick={openCart} className="cart-pill" aria-label="Кошик" style={{ width: 124 }}>
              <span className="cp-ic">
                <svg viewBox="0 0 24 24"><path d="M5 7h14l-1.5 9.5a2 2 0 0 1-2 1.7H8.5a2 2 0 0 1-2-1.7L5 7z"/><path d="M8 7V5a4 4 0 0 1 8 0v2"/></svg>
              </span>
              <span className="cp-label">Кошик</span>
              <span className="cart-count">{cartHydrated ? totalCount : 0}</span>
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="menu-sheet" style={{ display: "flex" }} onClick={() => setMenuOpen(false)}>
          <div className="menu-backdrop" />
          <div className="menu-panel" onClick={(e) => e.stopPropagation()}>
            <button className="icon-btn menu-close" onClick={() => setMenuOpen(false)} aria-label="Закрити">
              <svg viewBox="0 0 24 24"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>
            </button>
            <Link href="/catalog"      className="menu-link" onClick={() => setMenuOpen(false)}>Каталог</Link>
            <Link href="/#results"     className="menu-link" onClick={() => setMenuOpen(false)}>Послуги</Link>
            <Link href="/#studio"      className="menu-link" onClick={() => setMenuOpen(false)}>Про нас</Link>
            <Link href="/reviews"      className="menu-link" onClick={() => setMenuOpen(false)}>Відгуки</Link>
            <Link href="/#site-footer" className="menu-link" onClick={() => setMenuOpen(false)}>Контакти</Link>
          </div>
        </div>
      )}
    </>
  );
}
