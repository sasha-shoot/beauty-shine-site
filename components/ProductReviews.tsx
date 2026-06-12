"use client";

import { useEffect, useState, useCallback } from "react";
import { useUser } from "@/lib/user-context";
import { useUI } from "@/lib/ui-context";

type Review = {
  rec_id: string;
  user_id: string;
  name: string;
  picture: string;
  text: string;
  rating: number;
  date: string;
};

function Stars({ n }: { n: number }) {
  return <span className="stars">{"★".repeat(n)}{"☆".repeat(5 - n)}</span>;
}

function fmtDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  const M = ["січня","лютого","березня","квітня","травня","червня","липня","серпня","вересня","жовтня","листопада","грудня"];
  return `${d.getDate()} ${M[d.getMonth()]} ${d.getFullYear()}`;
}

export function ProductReviews({ productId, productName }: { productId: string; productName: string }) {
  const { user, isHydrated } = useUser();
  const { openProfile } = useUI();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [mine, setMine] = useState<Review | null>(null);
  const [loaded, setLoaded] = useState(false);

  const [editing, setEditing] = useState(false);
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/reviews?product=${encodeURIComponent(productId)}`, { cache: "no-store" });
      const data = await res.json();
      if (data.ok) {
        setReviews(data.reviews || []);
        setMine(data.mine || null);
      }
    } catch { /* мовчки */ }
    setLoaded(true);
  }, [productId]);

  useEffect(() => { load(); }, [load]);

  const avg = reviews.length
    ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10
    : 0;

  const startEdit = () => {
    if (mine) { setText(mine.text); setRating(mine.rating); }
    setMsg("");
    setEditing(true);
  };

  const submit = async () => {
    if (text.trim().length < 10) {
      setMsg("Напишіть хоча б кілька слів (від 10 символів)");
      return;
    }
    setBusy(true); setMsg("");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.trim(), rating, tags: ["Товари"], product_id: productId }),
      });
      const data = await res.json();
      if (data.ok) { setEditing(false); await load(); }
      else setMsg(data.error || "Щось пішло не так");
    } catch { setMsg("Помилка з'єднання"); }
    setBusy(false);
  };

  const remove = async () => {
    if (!confirm("Видалити ваш відгук про цей товар?")) return;
    setBusy(true);
    try {
      await fetch(`/api/reviews?product=${encodeURIComponent(productId)}`, { method: "DELETE" });
      setEditing(false); setText("");
      await load();
    } catch { /* мовчки */ }
    setBusy(false);
  };

  if (!loaded) return null;

  return (
    <section className="section prod-reviews">
      <div className="head-row">
        <div>
          <div className="eyebrow">Відгуки про товар</div>
          <h2 className="block-title">
            {reviews.length > 0
              ? <>Покупці кажуть <span className="pr-avg">★ {avg}</span></>
              : "Поки без відгуків"}
          </h2>
        </div>
      </div>

      {/* Форма */}
      <div className="rv-form-wrap">
        {!isHydrated ? null : !user ? (
          <div className="rv-cta-login">
            <p>Користувались «{productName}»? Поділіться враженням!</p>
            <button className="btn btn-purple" onClick={openProfile}>Увійти та оцінити</button>
          </div>
        ) : editing ? (
          <div className="rv-form">
            <h3>{mine ? "Редагувати відгук" : `Ваш відгук про «${productName}»`}</h3>
            <div className="rv-form-row">
              <div className="rv-rating-pick">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} type="button" className={`rv-star ${n <= rating ? "on" : ""}`}
                          onClick={() => setRating(n)} aria-label={`${n} з 5`}>★</button>
                ))}
              </div>
            </div>
            <textarea className="rv-textarea" value={text} onChange={(e) => setText(e.target.value)}
                      placeholder="Як вам товар? Ефект, текстура, аромат…" maxLength={600} rows={3} />
            <div className="rv-form-foot">
              <span className="rv-count">{text.length}/600</span>
              {msg && <span className="rv-msg">{msg}</span>}
              <div className="rv-form-btns">
                {mine && <button className="btn btn-ghost" onClick={remove} disabled={busy}>Видалити</button>}
                <button className="btn btn-ghost" onClick={() => setEditing(false)} disabled={busy}>Скасувати</button>
                <button className="btn btn-purple" onClick={submit} disabled={busy}>
                  {busy ? "Зберігаємо…" : "Опублікувати"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="rv-cta-login">
            <p>{mine ? "Ваш відгук опубліковано — дякуємо!" : `Користувались «${productName}»? Поділіться враженням!`}</p>
            <button className="btn btn-purple" onClick={startEdit}>
              {mine ? "Редагувати мій відгук" : "Залишити відгук"}
            </button>
          </div>
        )}
      </div>

      {/* Список */}
      {reviews.length > 0 && (
        <div className="pr-list">
          {reviews.map((r) => (
            <div key={r.rec_id} className="pr-item">
              {r.picture ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img className="rv-av rv-av-img" src={r.picture} alt={r.name} referrerPolicy="no-referrer" />
              ) : (
                <span className="rv-av" data-initial={r.name[0]}>{r.name[0]?.toUpperCase()}</span>
              )}
              <div className="pr-item-body">
                <div className="pr-item-head">
                  <b>{r.name}{mine && r.user_id === mine.user_id ? " (ви)" : ""}</b>
                  <Stars n={r.rating} />
                  <span className="rv-date">{fmtDate(r.date)}</span>
                </div>
                <p>{r.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
