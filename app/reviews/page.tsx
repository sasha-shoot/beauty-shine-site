import Link from "next/link";
import { ImageSlot } from "@/components/ImageSlot";

export const metadata = { title: "Відгуки — Beauty & Shine" };

const REVIEWS = [
  { name: "Марія Г.", initial: "М", tag: "Манікюр",          text: "Найкраща студія в Ізмаїлі! Прийшла з геть запущеними нігтями, а вийшла наче з обкладинки. Ірина — золоті руки.", date: "квітень 2026", photo: true },
  { name: "Олена П.", initial: "О", tag: "Педикюр",          text: "Професійні майстри, які знають свою справу. Іван Петрович допоміг із проблемою, з якою я мучилась роками. Результат перевершив очікування!", date: "березень 2026" },
  { name: "Катерина В.", initial: "К", tag: "Подологія",     text: "Догляд на найвищому рівні. Шкіра після процедур просто сяє!", date: "лютий 2026", photo: true },
  { name: "Анна Т.",  initial: "А", tag: "Догляд за ногами", text: "Замовляла гель для втомлених ніг — справді працює після довгого дня на роботі. Доставка Новою Поштою прийшла за день.", date: "грудень 2025" },
  { name: "Ірина С.", initial: "І", tag: "Манікюр",          text: "Дизайн, який тримається. Дівчата завжди підкажуть форму й колір під настрій. Виходжу щоразу в чудовому гуморі.", date: "грудень 2025", photo: true },
  { name: "Тетяна К.", initial: "Т", tag: "Догляд за руками", text: "Делікатний скраб і сироватка для нігтів — мій must-have. Майстри не продають зайвого, радять тільки те, що справді потрібно.", date: "листопад 2025" },
];

export default function ReviewsPage() {
  return (
    <section className="screen active" data-screen="reviews">
      <div className="container">
        <Link href="/" className="back-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          Назад
        </Link>

        <div className="reviews-head reveal">
          <h1>Відгуки <em>наших клієнтів</em></h1>
          <p>Реальні історії та результати тих, хто довірив нам свої руки й ноги. Деякі — з фото до/після, деякі — просто від щирого серця.</p>
          <div className="rv-stats">
            <div className="rv-stat">
              <span className="big num">4.9</span>
              <span className="lbl"><span className="stars">★★★★★</span><br/>середня оцінка</span>
            </div>
            <div className="rv-stat">
              <span className="big num">300+</span>
              <span className="lbl">клієнтів<br/>щомісяця</span>
            </div>
            <div className="rv-stat">
              <span className="big num">8</span>
              <span className="lbl">років<br/>досвіду</span>
            </div>
          </div>
        </div>

        <div className="rv-wall reveal">
          {REVIEWS.map((r, i) => (
            <div key={i} className="rv-card">
              {r.photo && (
                <ImageSlot className="rv-photo" shape="rect" placeholder="Фото результату" />
              )}
              <div className="rv-body">
                <span className="rv-tag">{r.tag}</span>
                <div className="rv-head">
                  <span className="rv-av" data-initial={r.initial}>{r.initial}</span>
                  <div className="rv-id">
                    <b>{r.name}</b>
                    <span className="stars">★★★★★</span>
                  </div>
                </div>
                <p>{r.text}</p>
                <span className="rv-date">{r.date}</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", padding: "8px 0 16px" }}>
          <Link href="/catalog" className="btn btn-purple btn-lg">Обрати засоби для себе</Link>
        </div>
      </div>
    </section>
  );
}
