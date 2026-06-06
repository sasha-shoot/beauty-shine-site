import Link from "next/link";

export default function NotFound() {
  return (
    <section className="screen active"><div className="container">
      <div className="empty" style={{padding:"80px 24px"}}>
        <div className="empty-emoji">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><line x1="20" y1="20" x2="16.5" y2="16.5"/></svg>
        </div>
        <h3>Сторінку не знайдено</h3>
        <p>Можливо, вона переїхала або ще не створена. Спробуйте повернутись на головну.</p>
        <div style={{display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap", marginTop:16}}>
          <Link href="/" className="btn btn-primary btn-lg">На головну</Link>
          <Link href="/catalog" className="btn btn-soft btn-lg">До каталогу</Link>
        </div>
      </div>
    </div></section>
  );
}
