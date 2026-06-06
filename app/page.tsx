import Link from "next/link";
import { getFeaturedProducts, getAllProducts } from "@/lib/airtable";
import { ProductCard } from "@/components/ProductCard";
import { ImageSlot } from "@/components/ImageSlot";

export const revalidate = 60;

export default async function HomePage() {
  // Хіти. Якщо featured порожньо — беремо перші 4 з in_stock
  let featured = await getFeaturedProducts(4);
  if (featured.length === 0) {
    const all = await getAllProducts();
    featured = all.filter((p) => p.in_stock).slice(0, 4);
  }

  return (
    <section className="screen active" data-screen="home">
      <div className="container">

        {/* ═════════════ HERO ═════════════ */}
        <section className="hero">
          <div className="hero-grid">
            <div className="hero-copy reveal">
              <span className="pill-badge"><span className="pb-star">✦</span> ТУРБО ДЛЯ ВАШОЇ КРАСИ</span>
              <h1>Догляд, що <em>сяє</em> разом із вами</h1>
              <p className="hero-sub">Професійна косметика та послуги для щоденного догляду, створені для краси та вашої впевненості.</p>
              <div className="hero-cta">
                <Link href="/catalog" className="btn btn-primary btn-lg">
                  Перейти до каталогу
                  <svg className="arr" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </Link>
                <Link href="/#studio" className="btn btn-soft btn-lg">Про нас</Link>
              </div>
              <div className="social-proof">
                <div className="avatars"><span className="av av1"></span><span className="av av2"></span><span className="av av3"></span></div>
                <div className="sp-text"><b>300+ клієнтів</b><span>довіряють нашій якості</span></div>
              </div>
            </div>

            <div className="hero-visual reveal">
              <ImageSlot shape="rounded" radius={34} className="hero-img" placeholder="Фото моделі" />
              <svg className="hero-spark" viewBox="0 0 100 100"><path d="M50 0 L60 40 L100 50 L60 60 L50 100 L40 60 L0 50 L40 40 Z" fill="currentColor"/></svg>
              <div className="float-card fc-1">
                <span className="fc-ic ic-star"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.8 6.6 7.2.6-5.5 4.7 1.7 7-6.2-3.8-6.2 3.8 1.7-7L1.7 9.2 9 8.6z"/></svg></span>
                <span className="fc-txt"><b>8+ років</b><small>досвіду роботи</small></span>
              </div>
              <div className="float-card fc-2">
                <span className="fc-ic ic-spark"><svg viewBox="0 0 100 100"><path d="M50 0 L60 40 L100 50 L60 60 L50 100 L40 60 L0 50 L40 40 Z" fill="currentColor"/></svg></span>
                <span className="fc-txt"><b>3000+</b><small>щасливих клієнтів</small></span>
              </div>
              <div className="float-card fc-3">
                <span className="fc-ic ic-truck"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="13" height="10" rx="1.5"/><path d="M15 10h4l3 3v4h-7"/><circle cx="6.5" cy="18.5" r="1.8"/><circle cx="18" cy="18.5" r="1.8"/></svg></span>
                <span className="fc-txt"><b>Доставка</b><small>по всій Україні</small></span>
              </div>
            </div>
          </div>
        </section>

        {/* ═════════════ FEATURES ═════════════ */}
        <section className="section" id="features">
          <div className="feat-row reveal">
            <div className="feat-card">
              <span className="feat-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="13" height="10" rx="1.5"/><path d="M15 10h4l3 3v4h-7"/><circle cx="6.5" cy="18.5" r="1.8"/><circle cx="18" cy="18.5" r="1.8"/></svg></span>
              <div className="feat-txt"><h4>Швидка доставка</h4><p>1–2 дні по всій Україні</p></div>
            </div>
            <div className="feat-card">
              <span className="feat-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.5 1-1a5.5 5.5 0 0 0 0-7.9z"/></svg></span>
              <div className="feat-txt"><h4>Професійна підтримка</h4><p>Допоможемо з вибором засобів</p></div>
            </div>
            <div className="feat-card">
              <span className="feat-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2h12l1 5H5z"/><path d="M5 7v13a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V7"/><path d="M9 11a3 3 0 0 0 6 0"/></svg></span>
              <div className="feat-txt"><h4>Оригінальна продукція</h4><p>100% сертифікована</p></div>
            </div>
            <div className="feat-card">
              <span className="feat-ic"><svg viewBox="0 0 100 100" fill="currentColor"><path d="M50 0 L60 40 L100 50 L60 60 L50 100 L40 60 L0 50 L40 40 Z"/></svg></span>
              <div className="feat-txt"><h4>Система лояльності</h4><p>Бонуси та знижки для клієнтів</p></div>
            </div>
          </div>
        </section>

        {/* ═════════════ CATEGORIES + POPULAR ═════════════ */}
        <section className="section">
          <div className="cat-pop reveal">
            <div className="cat-panel">
              <div className="head-row">
                <div><div className="eyebrow">Каталог</div><h3 className="block-title">Оберіть категорію</h3></div>
                <Link className="link" href="/catalog">Усі категорії <svg className="arr" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></Link>
              </div>
              <div className="cat-list">
                <Link href="/catalog?cat=Догляд за шкірою рук" className="cat-row">
                  <span className="cat-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M7 11V5.5a1.5 1.5 0 0 1 3 0V11m0-1V4.5a1.5 1.5 0 0 1 3 0V11m0-.5V6a1.5 1.5 0 0 1 3 0v7c0 4-2.5 8-6.5 8S6 18 6 15l-1.5-2.5a1.5 1.5 0 0 1 2.5-1.6L8 12"/></svg></span>
                  <span className="cat-tx"><b>Догляд за руками</b><small>Креми, олії, сироватки, скраби</small></span>
                  <svg className="arr" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </Link>
                <Link href="/catalog?cat=Догляд за шкірою ніг" className="cat-row">
                  <span className="cat-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M9 4c2 0 3.5 2 3.5 5 0 2 .5 3 1.5 4 2 2 3 3 3 5a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3c0-2 .5-4 .5-6C5.5 7 6.5 4 9 4z"/></svg></span>
                  <span className="cat-tx"><b>Догляд за ногами</b><small>Креми, бальзами, пілінги</small></span>
                  <svg className="arr" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </Link>
                <Link href="/catalog" className="cat-row">
                  <span className="cat-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg></span>
                  <span className="cat-tx"><b>Усі засоби</b><small>Повний каталог продукції</small></span>
                  <svg className="arr" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </Link>
              </div>
            </div>

            <div className="pop-panel">
              <div className="head-row">
                <div><div className="eyebrow">Хіти продажів</div><h3 className="block-title">Популярні товари</h3></div>
                <Link className="link" href="/catalog">Усі товари <svg className="arr" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></Link>
              </div>
              <div className="grid pop-grid">
                {featured.map((p) => <ProductCard key={p.rec_id} product={p} />)}
              </div>
            </div>
          </div>
        </section>

        {/* ═════════════ STUDIO DARK BANNER ═════════════ */}
        <section className="section" id="studio">
          <div className="studio-banner reveal">
            <div className="studio-copy">
              <h2>Сімейна студія краси<br/>та здоров&apos;я</h2>
              <p>Beauty &amp; Shine — це про турботу, якість і натуральність. Ми ретельно обираємо інгредієнти та працюємо для вашого щоденного комфорту і сяючого вигляду.</p>
              <Link href="/#masters" className="btn btn-purple btn-lg">Дізнатись більше <svg className="arr" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></Link>
              <div className="studio-stats">
                <div className="st"><b>8+</b><span>років досвіду</span></div>
                <div className="st"><b>300+</b><span>клієнтів щомісяця</span></div>
                <div className="st"><b>500+</b><span>процедур щомісяця</span></div>
                <div className="st"><b>100%</b><span>позитивних відгуків</span></div>
              </div>
            </div>
            <ImageSlot className="studio-img" shape="rounded" radius={24} placeholder="Фото салону" />
          </div>
        </section>

        {/* ═════════════ RESULTS (before/after) ═════════════ */}
        <section className="section" id="results">
          <div className="head-row reveal">
            <div><div className="eyebrow">До / Після</div><h2 className="block-title">Результати наших клієнтів</h2></div>
            <Link className="link" href="/catalog">Переглянути всі <svg className="arr" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></Link>
          </div>
          <div className="ba-grid reveal">
            {[
              { title: "Манікюр" },
              { title: "Педикюр" },
              { title: "Подологія" },
            ].map((b, i) => (
              <div key={i} className="ba-card">
                <div className="ba-media">
                  <ImageSlot className="ba-half" shape="rect" placeholder="До" />
                  <ImageSlot className="ba-half" shape="rect" placeholder="Після" />
                  <span className="ba-tag l">До</span>
                  <span className="ba-tag r">Після</span>
                  <span className="ba-divider"><span className="ba-handle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 5 12 9 18"/><polyline points="15 6 19 12 15 18"/></svg></span></span>
                </div>
                <div className="ba-foot"><span className="ba-title">{b.title}</span><span className="ba-link">Детальніше <svg className="arr" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span></div>
              </div>
            ))}
          </div>
        </section>

        {/* ═════════════ MASTERS ═════════════ */}
        <section className="section" id="masters">
          <div className="head-row reveal">
            <div><div className="eyebrow">Наша команда</div><h2 className="block-title">Познайомтесь з нашими майстрами</h2></div>
          </div>
          <div className="masters-grid reveal">
            <div className="master-card">
              <ImageSlot className="master-av" shape="circle" placeholder="Фото" />
              <div className="master-tx">
                <h4>Іван</h4>
                <p className="role">Майстер педикюру та подології</p>
                <span className="exp">8 років досвіду</span>
              </div>
            </div>
            <div className="master-card">
              <ImageSlot className="master-av" shape="circle" placeholder="Фото" />
              <div className="master-tx">
                <h4>Ірина</h4>
                <p className="role">Майстер манікюру та догляду за руками</p>
                <span className="exp">7 років досвіду</span>
              </div>
            </div>
          </div>
        </section>

        {/* ═════════════ SPACE ═════════════ */}
        <section className="section">
          <div className="head-row reveal">
            <div><div className="eyebrow">Наш простір</div><h2 className="block-title">Атмосфера турботи та комфорту</h2></div>
            <Link className="link" href="/#masters">Переглянути більше <svg className="arr" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></Link>
          </div>
          <div className="space-grid reveal">
            <ImageSlot className="space-img" shape="rounded" radius={22} placeholder="Студія" />
            <ImageSlot className="space-img" shape="rounded" radius={22} placeholder="Робоче місце" />
            <ImageSlot className="space-img" shape="rounded" radius={22} placeholder="Вітрина" />
            <ImageSlot className="space-img" shape="rounded" radius={22} placeholder="Зона очікування" />
          </div>
        </section>

        {/* ═════════════ TESTIMONIALS ═════════════ */}
        <section className="section">
          <div className="head-row reveal">
            <div><div className="eyebrow">Відгуки</div><h2 className="block-title">Що кажуть наші клієнти</h2></div>
            <Link className="link" href="/#results">Усі відгуки <svg className="arr" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></Link>
          </div>
          <div className="tt-grid reveal">
            <div className="tt-card">
              <div className="tt-head"><span className="tt-av" data-initial="М">М</span><div className="tt-id"><b>Марія</b><span className="stars">★★★★★</span></div></div>
              <p>Найкраща студія в Ізмаїлі! Завжди ідеальний манікюр і дуже приємна атмосфера.</p>
            </div>
            <div className="tt-card">
              <div className="tt-head"><span className="tt-av" data-initial="О">О</span><div className="tt-id"><b>Олена</b><span className="stars">★★★★★</span></div></div>
              <p>Професійні майстри, які знають свою справу. Результат перевершив очікування!</p>
            </div>
            <div className="tt-card">
              <div className="tt-head"><span className="tt-av" data-initial="К">К</span><div className="tt-id"><b>Катерина</b><span className="stars">★★★★★</span></div></div>
              <p>Догляд на найвищому рівні. Шкіра після процедур просто сяє!</p>
            </div>
          </div>
        </section>

        {/* ═════════════ BLOG ═════════════ */}
        <section className="section" id="blog">
          <div className="head-row reveal">
            <div><div className="eyebrow">Корисні поради та новини</div><h2 className="block-title">З нашого блогу</h2></div>
            <Link className="link" href="/catalog">Усі статті <svg className="arr" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></Link>
          </div>
          <div className="blog-grid reveal">
            {[
              { t: "Як доглядати за кутикулою вдома?",       m: "5 хв читання" },
              { t: "Чому тріскається шкіра стоп?",            m: "7 хв читання" },
              { t: "Найкращі засоби після педикюру",          m: "4 хв читання" },
            ].map((b, i) => (
              <article key={i} className="blog-card">
                <ImageSlot className="blog-img" shape="rect" placeholder="Зображення статті" />
                <div className="blog-body"><h4>{b.t}</h4><span className="blog-meta">{b.m}</span></div>
              </article>
            ))}
          </div>
        </section>

        {/* ═════════════ NEWSLETTER ═════════════ */}
        <section className="section">
          <div className="newsletter reveal">
            <div className="nl-copy">
              <h2>Підпишіться та отримайте<br/><span className="nl-accent">−10% на перше замовлення</span></h2>
              <p>Будьте в курсі новинок та акцій студії Beauty &amp; Shine.</p>
              <form className="nl-form">
                <input type="email" name="email" placeholder="Ваш e-mail" autoComplete="email" />
                <button type="submit" className="nl-btn" aria-label="Підписатися">
                  <svg className="arr" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </button>
              </form>
            </div>
            <div className="nl-deco">
              <svg className="nl-spark s1" viewBox="0 0 100 100"><path d="M50 0 L60 40 L100 50 L60 60 L50 100 L40 60 L0 50 L40 40 Z" fill="currentColor"/></svg>
              <svg className="nl-spark s2" viewBox="0 0 100 100"><path d="M50 0 L60 40 L100 50 L60 60 L50 100 L40 60 L0 50 L40 40 Z" fill="currentColor"/></svg>
              <ImageSlot className="nl-img" shape="rounded" radius={20} placeholder="Продукти" />
            </div>
          </div>
        </section>

      </div>
    </section>
  );
}
