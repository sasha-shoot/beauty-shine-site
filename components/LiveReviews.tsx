"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useUser } from "@/lib/user-context";
import { useUI } from "@/lib/ui-context";

type Review = {
  rec_id: string;
  user_id: string;
  name: string;
  picture: string;
  text: string;
  rating: number;
  tag: string;
  date: string;
};

const TAGS = ["Салон", "Майстер Ірина", "Майстер Іван", "Манікюр", "Педикюр", "Подологія", "Товари"];

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

function LiveReviewsInner() {
  const params = useSearchParams();
  const { user, isHydrated } = useUser();
  const { openProfile } = useUI();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [mine, setMine] = useState<Review | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Форма
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);
  const [tags, setTags] = useState<string[]>(["Салон"]);
  const toggleTag = (t: string) =>
    setTags((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : prev.length < 5 ? [...prev, t] : prev);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/reviews", { cache: "no-store" });
      const data = await res.json();
      if (data.ok) {
        setReviews(data.reviews || []);
        setMine(data.mine || null);
      }
    } catch { /* мовчки */ }
    setLoaded(true);
  }, []);

  useEffect(() => { load(); }, [load]);

  // Префіл з URL: /reviews?tag=Майстер Ірина (прихід з кнопки під записом)
  useEffect(() => {
    const t = params.get("tag");
    if (t && TAGS.includes(t)) {
      setTags(["Салон", t].filter((x, i, a) => a.indexOf(x) === i));
      setEditing(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const startEdit = () => {
    if (mine) {
      setText(mine.text);
      setRating(mine.rating);
      const saved = (mine.tag || "").split(",").map((s) => s.trim()).filter((t) => TAGS.includes(t));
      setTags(saved.length ? saved : ["Салон"]);
    }
    setMsg("");
    setEditing(true);
  };

  const submit = async () => {
    if (text.trim().length < 10) {
      setMsg("Напишіть хоча б кілька слів (від 10 символів)");
      return;
    }
    setBusy(true);
    setMsg("");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.trim(), rating, tags }),
      });
      const data = await res.json();
      if (data.ok) {
        setEditing(false);
        setMsg("");
        await load();
      } else {
        setMsg(data.error || "Щось пішло не так");
      }
    } catch {
      setMsg("Помилка з'єднання, спробуйте ще раз");
    }
    setBusy(false);
  };

  const remove = async () => {
    if (!confirm("Видалити ваш відгук?")) return;
    setBusy(true);
    try {
      await fetch("/api/reviews", { method: "DELETE" });
      setEditing(false);
      setText("");
      await load();
    } catch { /* мовчки */ }
    setBusy(false);
  };

  return (
    <>
      {/* ── Блок «залишити відгук» ── */}
      <div className="rv-form-wrap reveal">
        {!isHydrated || !loaded ? null : !user ? (
          <div className="rv-cta-login">
            <p>Були в нас або замовляли засоби? Поділіться враженнями!</p>
            <button className="btn btn-purple" onClick={openProfile}>
              Увійти та залишити відгук
            </button>
          </div>
        ) : editing ? (
          <div className="rv-form">
            <h3>{mine ? "Редагувати відгук" : "Ваш відгук"}</h3>
            <div className="rv-form-row">
              <div className="rv-rating-pick">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    className={`rv-star ${n <= rating ? "on" : ""}`}
                    onClick={() => setRating(n)}
                    aria-label={`${n} з 5`}
                  >★</button>
                ))}
              </div>
              <div className="rv-tag-chips">
                {TAGS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={`rv-chip ${tags.includes(t) ? "on" : ""}`}
                    onClick={() => toggleTag(t)}
                  >{t}</button>
                ))}
              </div>
            </div>
            <textarea
              className="rv-textarea"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Розкажіть, що сподобалось (або що покращити)…"
              maxLength={600}
              rows={4}
            />
            <div className="rv-form-foot">
              <span className="rv-count">{text.length}/600</span>
              {msg && <span className="rv-msg">{msg}</span>}
              <div className="rv-form-btns">
                {mine && (
                  <button className="btn btn-ghost" onClick={remove} disabled={busy}>Видалити</button>
                )}
                <button className="btn btn-ghost" onClick={() => setEditing(false)} disabled={busy}>Скасувати</button>
                <button className="btn btn-purple" onClick={submit} disabled={busy}>
                  {busy ? "Зберігаємо…" : "Опублікувати"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="rv-cta-login">
            <p>{mine ? "Дякуємо за ваш відгук! Можете оновити його будь-коли." : `${user.name}, поділіться враженнями про студію чи товари!`}</p>
            <button className="btn btn-purple" onClick={startEdit}>
              {mine ? "Редагувати мій відгук" : "Залишити відгук"}
            </button>
          </div>
        )}
      </div>

      {/* ── Реальні відгуки ── */}
      {reviews.length > 0 && (
        <div className="rv-wall reveal">
          {reviews.map((r) => (
            <div key={r.rec_id} className="rv-card">
              <div className="rv-body">
                {r.tag && (
                  <span className="rv-tags-row">
                    {r.tag.split(",").map((t) => t.trim()).filter(Boolean).map((t) => (
                      <span key={t} className="rv-tag">{t}</span>
                    ))}
                  </span>
                )}
                <div className="rv-head">
                  {r.picture ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img className="rv-av rv-av-img" src={r.picture} alt={r.name} referrerPolicy="no-referrer" />
                  ) : (
                    <span className="rv-av" data-initial={r.name[0]}>{r.name[0]?.toUpperCase()}</span>
                  )}
                  <div className="rv-id">
                    <b>{r.name}{mine && r.user_id === mine.user_id ? " (ви)" : ""}</b>
                    <Stars n={r.rating} />
                  </div>
                </div>
                <p>{r.text}</p>
                <span className="rv-date">{fmtDate(r.date)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}


export function LiveReviews() {
  return (
    <Suspense fallback={null}>
      <LiveReviewsInner />
    </Suspense>
  );
}
