import Link from "next/link";

export function Footer() {
  return (
    <footer className="footer" id="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="col">
            <div className="logo" style={{ cursor: "default" }}>
              <span className="logo-mark">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/designer/logo-mark.png" alt="Beauty & Shine" style={{ width: 40, height: 32 }} />
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
              <a href="https://t.me/beauty_shine_izmayil_bot" target="_blank" rel="noopener" aria-label="Telegram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"><path d="M21 4L3 11l5 2 2 6 3-4 4 3z"/></svg></a>
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
            <Link href="/delivery">Доставка і оплата</Link>
            <Link href="/returns">Повернення</Link>
            <Link href="/faq">Питання та відповіді</Link>
            <Link href="/#results">Система лояльності</Link>
          </div>
          <div className="col">
            <h5>Про нас</h5>
            <Link href="/#studio">Наша історія</Link>
            <Link href="/#masters">Майстри</Link>
            <Link href="/reviews">Відгуки</Link>
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
