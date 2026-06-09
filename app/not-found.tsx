import Link from "next/link";

export default function NotFound() {
  return (
    <section className="screen active" data-screen="notfound">
      <div className="container nf-wrap">
        <div className="nf-card">
          <div className="nf-spark-field" aria-hidden="true">
            <svg className="nf-sp s1" viewBox="0 0 100 100"><path d="M50 0 L60 40 L100 50 L60 60 L50 100 L40 60 L0 50 L40 40 Z" fill="currentColor"/></svg>
            <svg className="nf-sp s2" viewBox="0 0 100 100"><path d="M50 0 L60 40 L100 50 L60 60 L50 100 L40 60 L0 50 L40 40 Z" fill="currentColor"/></svg>
            <svg className="nf-sp s3" viewBox="0 0 100 100"><path d="M50 0 L60 40 L100 50 L60 60 L50 100 L40 60 L0 50 L40 40 Z" fill="currentColor"/></svg>
          </div>
          <div className="nf-code">404</div>
          <h2>Сторінку не знайдено</h2>
          <p>Можливо, посилання застаріло або сторінку прибрали. Але краса нікуди не зникла — повертайтесь до магазину.</p>
          <div className="nf-cta">
            <Link href="/" className="btn btn-purple btn-lg">На головну</Link>
            <Link href="/catalog" className="btn btn-ghost btn-lg">До каталогу</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
