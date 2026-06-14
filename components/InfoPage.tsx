import Link from "next/link";
import { ReactNode } from "react";

export function InfoPage({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <section className="screen active" data-screen="info">
      <div className="container info-container">
        <Link href="/" className="back-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          Назад
        </Link>

        <div className="info-head reveal">
          <div className="eyebrow">{eyebrow}</div>
          <h1>{title}</h1>
          {intro && <p className="info-intro">{intro}</p>}
        </div>

        <div className="info-body reveal">{children}</div>

        <div className="info-cta reveal">
          <div className="info-cta-inner">
            <div>
              <h3>Залишились питання?</h3>
              <p>Напишіть нам у Telegram-бот — відповімо швидко та допоможемо з вибором.</p>
            </div>
            <a className="btn btn-purple btn-lg" href="https://t.me/beauty_shine_izmayil_bot" target="_blank" rel="noopener">
              Написати в Telegram
              <svg className="arr" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Картка-блок усередині інфо-сторінки */
export function InfoCard({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <div className="info-card">
      <div className="info-card-head">
        <span className="info-card-ic">{icon}</span>
        <h3>{title}</h3>
      </div>
      <div className="info-card-body">{children}</div>
    </div>
  );
}
