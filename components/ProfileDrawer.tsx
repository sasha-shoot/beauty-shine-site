"use client";

import { useEffect, useState } from "react";
import { useUI } from "@/lib/ui-context";
import { useUser } from "@/lib/user-context";

type Tab = "orders" | "visits" | "fav" | "data";

type Order = {
  rec_id: string;
  order_no: string;
  date: string;
  items: string;
  total: number;
};

type Visit = {
  rec_id: string;
  service: string;
  master: string;
  date: string;
  price: number;
};

const UA_MONTHS = ["січня","лютого","березня","квітня","травня","червня","липня","серпня","вересня","жовтня","листопада","грудня"];

function fmtDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return `${d.getDate()} ${UA_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export function ProfileDrawer() {
  const { profileOpen, closeProfile } = useUI();
  const { user, isHydrated, loginTelegram, loginPhone, logout } = useUser();
  const [authStep, setAuthStep] = useState<"choice" | "otp">("choice");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [tab, setTab] = useState<Tab>("orders");

  function handleTelegramLogin() {
    loginTelegram({
      name: "Олександр",
      initial: "О",
      username: "@sasha_shoot",
    });
  }

  function handlePhoneSubmit() {
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length < 10) {
      alert("Введіть коректний номер");
      return;
    }
    setAuthStep("otp");
  }

  function handleOtpVerify() {
    if (otp.replace(/\D/g, "").length !== 4) {
      alert("Введіть 4 цифри");
      return;
    }
    loginPhone(phone);
    setAuthStep("choice");
  }

  return (
    <div className={`drawer-root ${profileOpen ? "open" : ""}`} onClick={(e) => {
      if ((e.target as HTMLElement).hasAttribute("data-close-profile")) closeProfile();
    }}>
      <div className="drawer-backdrop" data-close-profile />
      <aside className="drawer" role="dialog" aria-label="Профіль">
        <span className="drawer-grab"></span>
        <header className="drawer-head">
          <h3>{!user ? (authStep === "otp" ? "Підтвердження" : "Вхід у профіль") : "Мій профіль"}</h3>
          <button className="icon-btn" onClick={closeProfile} aria-label="Закрити">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>
          </button>
        </header>

        <div className="drawer-body" style={{ padding: 0 }}>
          {!isHydrated ? null : !user ? (
            authStep === "choice" ? (
              <div className="pf-auth">
                <div className="pf-auth-hero">
                  <div className="pf-logo">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/designer/logo-mark.png" alt="" />
                  </div>
                  <h4>Вітаємо у Beauty &amp; Shine</h4>
                  <p>Увійдіть, щоб зберігати обране, бачити історію покупок та накопичувати бонуси.</p>
                </div>
                <button className="pf-tg-btn" onClick={handleTelegramLogin}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M21 4L3 11l5 2 2 6 3-4 4 3z"/></svg>
                  Продовжити через Telegram
                </button>
                <div className="pf-or"><span>або за номером телефону</span></div>
                <div className="pf-field">
                  <label>Номер телефону</label>
                  <input
                    type="tel"
                    inputMode="tel"
                    placeholder="+380 __ ___ __ __"
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <button className="btn btn-primary btn-lg btn-full" onClick={handlePhoneSubmit}>Отримати код</button>
                <p className="pf-legal">
                  Натискаючи, ви погоджуєтесь з <a href="#">умовами</a> та <a href="#">політикою конфіденційності</a>.
                </p>
              </div>
            ) : (
              <div className="pf-auth">
                <button className="pf-back" onClick={() => setAuthStep("choice")}>
                  <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg> Змінити номер
                </button>
                <div className="pf-auth-hero" style={{ paddingTop: 8 }}>
                  <div className="pf-logo">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#7A47B8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ width: 32, height: 32 }}>
                      <rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>
                    </svg>
                  </div>
                  <h4>Введіть код</h4>
                  <p>Ми надіслали SMS із кодом на <b>{phone}</b></p>
                </div>
                <div className="pf-otp">
                  {[0, 1, 2, 3].map((i) => (
                    <input
                      key={i}
                      type="tel"
                      inputMode="numeric"
                      maxLength={1}
                      value={otp[i] || ""}
                      onChange={(e) => {
                        const v = e.target.value.replace(/\D/g, "");
                        const next = otp.split("");
                        next[i] = v;
                        setOtp(next.join(""));
                        if (v && i < 3) {
                          const inputs = document.querySelectorAll<HTMLInputElement>(".pf-otp input");
                          inputs[i + 1]?.focus();
                        }
                      }}
                    />
                  ))}
                </div>
                <button className="btn btn-purple btn-lg btn-full" onClick={handleOtpVerify}>Підтвердити</button>
                <p className="pf-hint" style={{ marginTop: 14, fontSize: 13, color: "var(--ink-3)", textAlign: "center" }}>
                  Демо-режим: введіть будь-які 4 цифри
                </p>
              </div>
            )
          ) : (
            <CabinetView tab={tab} setTab={setTab} onLogout={() => { logout(); setAuthStep("choice"); }} />
          )}
        </div>
      </aside>
    </div>
  );
}

function CabinetView({ tab, setTab, onLogout }: { tab: Tab; setTab: (t: Tab) => void; onLogout: () => void }) {
  const { user } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState({ orders: true, visits: true });

  useEffect(() => {
    if (!user) return;
    setLoading({ orders: true, visits: true });
    fetch(`/api/me/orders?user_id=${encodeURIComponent(user.id)}`)
      .then((r) => r.json())
      .then((d) => setOrders(d.orders || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading((l) => ({ ...l, orders: false })));
    fetch(`/api/me/visits?user_id=${encodeURIComponent(user.id)}`)
      .then((r) => r.json())
      .then((d) => setVisits(d.visits || []))
      .catch(() => setVisits([]))
      .finally(() => setLoading((l) => ({ ...l, visits: false })));
  }, [user]);

  if (!user) return null;

  const next = 500;
  const pct = Math.min(100, Math.round(((user.bonus % next) / next) * 100));

  return (
    <div className="pf-pad">
      <div className="pf-card">
        <div className="pf-av-lg">{user.initial}</div>
        <div className="pf-id">
          <b>{user.name}</b>
          <div>
            {user.method === "tg" ? (
              <span className="pf-badge">✈ {user.username}</span>
            ) : (
              <span className="pf-badge phone">{user.phone}</span>
            )}
          </div>
        </div>
      </div>

      <div className="pf-loyalty">
        <div className="pl-top">
          <div>
            <div className="pl-lbl">Бонусний рахунок</div>
            <div className="pl-val"><span>{user.bonus}</span> ✦</div>
          </div>
          <svg className="pl-star" viewBox="0 0 100 100" fill="currentColor">
            <path d="M50 0 L60 40 L100 50 L60 60 L50 100 L40 60 L0 50 L40 40 Z"/>
          </svg>
        </div>
        <div className="pf-bar"><i style={{ width: `${pct}%` }} /></div>
        <div className="pl-hint">Ще {next - (user.bonus % next)} ✦ до знижки −10% на наступне замовлення</div>
      </div>

      <div className="pf-tabs">
        <button className={`pf-tab ${tab === "orders" ? "active" : ""}`} onClick={() => setTab("orders")}>Замовлення</button>
        <button className={`pf-tab ${tab === "visits" ? "active" : ""}`} onClick={() => setTab("visits")}>Записи</button>
        <button className={`pf-tab ${tab === "fav"    ? "active" : ""}`} onClick={() => setTab("fav")}>Обране</button>
        <button className={`pf-tab ${tab === "data"   ? "active" : ""}`} onClick={() => setTab("data")}>Дані</button>
      </div>

      <div id="pfTabBody">
        {tab === "orders" && (
          loading.orders ? <LoadingHint /> :
          orders.length === 0 ? (
            <EmptyState
              icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 7h14l-1.5 9.5a2 2 0 0 1-2 1.7H8.5a2 2 0 0 1-2-1.7L5 7z"/><path d="M8 7V5a4 4 0 0 1 8 0v2"/></svg>}
              title="Замовлень поки немає"
              text="Оформіть перше замовлення — воно з'явиться тут із датою та переліком товарів."
            />
          ) : (
            <>
              {orders.map((o) => (
                <div key={o.rec_id} className="pf-order">
                  <div className="pf-order-top">
                    <span className="pf-order-no">№ {o.order_no}</span>
                    <span className="pf-order-date" style={{ color: "var(--ink-3)", fontSize: 13 }}>{fmtDate(o.date)}</span>
                  </div>
                  <div className="pf-order-items">{o.items}</div>
                  <div className="pf-order-foot">
                    <span style={{ color: "var(--ink-3)", fontSize: 13 }}>Сума</span>
                    <span className="pf-order-total num">{o.total} грн</span>
                  </div>
                </div>
              ))}
              <p className="pf-note">Доставку здійснює наш постачальник прямо до вас Новою Поштою.</p>
            </>
          )
        )}

        {tab === "visits" && (
          loading.visits ? <LoadingHint /> :
          visits.length === 0 ? (
            <EmptyState
              icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 2v4M16 2v4M9 14l2 2 4-4"/></svg>}
              title="Записів поки немає"
              text="Тут зʼявиться історія Ваших візитів до студії — послуги, дати й вартість."
            />
          ) : (
            <>
              <div className="pf-visit-sum">
                <span>Витрачено за період</span>
                <b className="num">{visits.reduce((s, v) => s + v.price, 0)} грн</b>
              </div>
              {visits.map((v) => (
                <div key={v.rec_id} className="pf-visit">
                  <div className="pf-visit-ic">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2l2.8 6.6 7.2.6-5.5 4.7 1.7 7-6.2-3.8-6.2 3.8 1.7-7L1.7 9.2 9 8.6z"/>
                    </svg>
                  </div>
                  <div className="pf-visit-info">
                    <b>{v.service}</b>
                    <span>{fmtDate(v.date)} · майстер {v.master}</span>
                  </div>
                  <span className="pf-visit-price num">{v.price} грн</span>
                </div>
              ))}
            </>
          )
        )}

        {tab === "fav" && (
          <EmptyState
            icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.5 1-1a5.5 5.5 0 0 0 0-7.9z"/></svg>}
            title="Список обраного порожній"
            text="Тисніть ♥ на товарах у каталозі — і вони збережуться тут."
          />
        )}

        {tab === "data" && (
          <div>
            <div className="pf-data-row"><span className="dl">Імʼя</span><span className="dv">{user.name}</span></div>
            <div className="pf-data-row"><span className="dl">Телефон</span><span className="dv">{user.phone || "—"}</span></div>
            <div className="pf-data-row"><span className="dl">Telegram</span><span className="dv">{user.username || "—"}</span></div>
            <div className="pf-data-row"><span className="dl">Місто доставки</span><span className="dv">{user.city || "Не вказано"}</span></div>
            <div className="pf-data-row"><span className="dl">Спосіб входу</span><span className="dv">{user.method === "tg" ? "Telegram" : "Телефон"}</span></div>
            <p className="pf-hint" style={{ marginTop: 16, textAlign: "left", fontSize: 13, color: "var(--ink-3)" }}>
              Редагування даних буде доступне у наступній версії.
            </p>
          </div>
        )}
      </div>

      <button className="pf-logout" onClick={onLogout}>Вийти з профілю</button>
    </div>
  );
}

function EmptyState({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="pf-empty">
      <div className="pf-empty-ic">{icon}</div>
      <h5>{title}</h5>
      <p>{text}</p>
    </div>
  );
}

function LoadingHint() {
  return (
    <div className="pf-empty">
      <p style={{ color: "var(--ink-3)", fontSize: 13 }}>Завантажуємо…</p>
    </div>
  );
}
