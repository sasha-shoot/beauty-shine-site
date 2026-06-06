import Link from "next/link";

export function Footer() {
  return (
    <footer className="footer" id="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="col">
            <div className="logo" style={{ cursor: "default" }}>
              <span className="logo-mark">
                <svg width="19" height="21" viewBox="0 0 20 22" fill="none">
                  <path d="M7 1.5h6v2.6l1.8 1.4c.7.55 1.2 1.4 1.2 2.3v10.7c0 1.4-1.1 2.5-2.5 2.5h-7C5.1 21 4 19.9 4 18.5V7.8c0-.9.45-1.75 1.2-2.3L7 4.1V1.5z" fill="#FFFFFF"/>
                  <circle cx="10" cy="14" r="3" fill="#F5DE46"/>
                  <path d="M16.5 3.5L17 5l1.5.5L17 6l-.5 1.5L16 6l-1.5-.5L16 5l.5-1.5z" fill="#F5DE46"/>
                </svg>
              </span>
              <span className="logo-word" style={{ color: "#fff" }}>
                beauty<span className="amp">&amp;</span>shine
              </span>
            </div>
            <p style={{ marginTop: 16, maxWidth: 280 }}>
              Професійна косметика для вашої краси та щоденного догляду. Сімейна студія в Ізмаїлі.
            </p>
            <div className="socials">
              <a href="#" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg></a>
              <a href="#" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M15 8h-2a2 2 0 0 0-2 2v11M8 13h6"/></svg></a>
              <a href="#" aria-label="Telegram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"><path d="M21 4L3 11l5 2 2 6 3-4 4 3z"/></svg></a>
            </div>
          </div>
          <div className="col">
            <h5>Каталог</h5>
            <Link href="/catalog?cat=hands">Догляд за руками</Link>
            <Link href="/catalog?cat=feet">Догляд за ногами</Link>
            <Link href="/catalog">Усі засоби</Link>
            <Link href="/catalog">Хіти продажів</Link>
          </div>
          <div className="col">
            <h5>Клієнтам</h5>
            <Link href="/#features">Доставка і оплата</Link>
            <Link href="/#features">Повернення</Link>
            <Link href="/#results">Питання та відповіді</Link>
            <Link href="/#results">Система лояльності</Link>
          </div>
          <div className="col">
            <h5>Про нас</h5>
            <Link href="/#studio">Наша історія</Link>
            <Link href="/#masters">Майстри</Link>
            <Link href="/#blog">Блог</Link>
            <Link href="/#site-footer">Контакти</Link>
          </div>
          <div className="col">
            <h5>Контакти</h5>
            <a href="tel:+380991234567">+38 (099) 123 45 67</a>
            <a href="mailto:info@beautyshine.ua">info@beautyshine.ua</a>
            <p>ТЦ «Дельта», 2 поверх, Ізмаїл</p>
            <p>Пн–Пт: 9:00–20:00<br/>Сб–Нд: 10:00–18:00</p>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Beauty &amp; Shine · Усі права захищено</span>
          <span>Зроблено з ✦ в Ізмаїлі</span>
        </div>
      </div>
    </footer>
  );
}
