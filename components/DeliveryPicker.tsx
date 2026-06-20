"use client";

import { useEffect, useRef, useState } from "react";

export type DeliveryMethod = "np_branch" | "np_postomat" | "ukr_office" | "pickup";

export type DeliveryValue = {
  method: DeliveryMethod;
  city: string;
  point: string;
};

type SuggestItem = { value: string; label: string };

const METHODS: { id: DeliveryMethod; label: string; hint: string }[] = [
  { id: "np_branch", label: "Нова Пошта — відділення", hint: "Доставка у відділення НП" },
  { id: "np_postomat", label: "Нова Пошта — поштомат", hint: "Самостійне отримання з поштомату" },
  { id: "ukr_office", label: "Укрпошта — відділення", hint: "Доставка у відділення Укрпошти" },
  { id: "pickup", label: "Самовивіз зі студії", hint: "Забрати в Ізмаїлі особисто" },
];

const STUDIO = "ТЦ «Дельта», 2 поверх, Ізмаїл, Одеська обл.";

/** Інпут з автодоповненням + ручний фолбек, якщо провайдер ще не налаштований. */
function Suggest({
  label,
  placeholder,
  value,
  disabled,
  manual,
  fetcher,
  onText,
  onPick,
}: {
  label: string;
  placeholder: string;
  value: string;
  disabled?: boolean;
  manual?: boolean;
  fetcher: (q: string) => Promise<SuggestItem[]>;
  onText: (text: string) => void;
  onPick: (item: SuggestItem) => void;
}) {
  const [items, setItems] = useState<SuggestItem[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const qRef = useRef("");

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  useEffect(() => {
    if (manual || disabled) return;
    const q = value.trim();
    qRef.current = q;
    if (q.length < 2) { setItems([]); return; }
    setLoading(true);
    const tmr = setTimeout(async () => {
      try {
        const res = await fetcher(q);
        if (qRef.current === q) { setItems(res); setOpen(res.length > 0); }
      } catch { setItems([]); }
      finally { if (qRef.current === q) setLoading(false); }
    }, 280);
    return () => clearTimeout(tmr);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, manual, disabled]);

  return (
    <div className="field dp-suggest" ref={boxRef}>
      <label>{label}</label>
      <input
        type="text"
        autoComplete="off"
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        onChange={(e) => onText(e.target.value)}
        onFocus={() => { if (items.length) setOpen(true); }}
      />
      {loading && <span className="dp-loading">…</span>}
      {open && !manual && items.length > 0 && (
        <ul className="dp-list">
          {items.map((it, i) => (
            <li key={`${it.value}-${i}`}>
              <button
                type="button"
                onClick={() => { onPick(it); setOpen(false); }}
              >
                {it.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Області для класифікатора Укрпошти (передаються як region_name)
const UKR_REGIONS = [
  "Вінницька", "Волинська", "Дніпропетровська", "Донецька", "Житомирська",
  "Закарпатська", "Запорізька", "Івано-Франківська", "Київ", "Київська",
  "Кіровоградська", "Луганська", "Львівська", "Миколаївська", "Одеська",
  "Полтавська", "Рівненська", "Сумська", "Тернопільська", "Харківська",
  "Херсонська", "Хмельницька", "Черкаська", "Чернівецька", "Чернігівська",
];

export function DeliveryPicker({ onChange }: { onChange: (v: DeliveryValue) => void }) {
  const [method, setMethod] = useState<DeliveryMethod>("np_branch");

  // Назва міста (відображувана) + технічний реф/ід для ланцюжка запитів
  const [city, setCity] = useState("");
  const [cityRef, setCityRef] = useState(""); // NP CityRef або Ukrposhta CITY_ID
  const [point, setPoint] = useState("");
  const [ukrRegion, setUkrRegion] = useState(""); // обрана область для Укрпошти

  // Чи налаштовані ключі провайдерів (дізнаємось із відповіді API)
  const [npManual, setNpManual] = useState(false);
  const [ukrManual, setUkrManual] = useState(false);

  const isNp = method === "np_branch" || method === "np_postomat";
  const isUkr = method === "ukr_office";
  const isPickup = method === "pickup";
  const manual = isNp ? npManual : isUkr ? ukrManual : false;

  // Підняти стан нагору при будь-якій зміні
  useEffect(() => {
    if (isPickup) onChange({ method, city: "", point: STUDIO });
    else onChange({ method, city: city.trim(), point: point.trim() });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [method, city, point]);

  function switchMethod(m: DeliveryMethod) {
    setMethod(m);
    setCity(""); setCityRef(""); setPoint(""); setUkrRegion("");
  }

  async function fetchCities(q: string): Promise<SuggestItem[]> {
    const base = isUkr ? "/api/ukr/cities" : "/api/np/cities";
    const extra = isUkr ? `&region=${encodeURIComponent(ukrRegion)}` : "";
    const res = await fetch(`${base}?q=${encodeURIComponent(q)}${extra}`, { cache: "no-store" });
    const data = await res.json();
    if (data.configured === false) {
      if (isUkr) setUkrManual(true); else setNpManual(true);
      return [];
    }
    return (data.items || []).map((c: any) => ({
      value: String(c.ref ?? c.id ?? ""),
      label: String(c.name ?? ""),
    }));
  }

  async function fetchPoints(q: string): Promise<SuggestItem[]> {
    if (!cityRef) return [];
    if (isUkr) {
      const res = await fetch(`/api/ukr/offices?cityId=${encodeURIComponent(cityRef)}`, { cache: "no-store" });
      const data = await res.json();
      if (data.configured === false) { setUkrManual(true); return []; }
      const all = (data.items || []).map((o: any) => ({ value: String(o.index ?? ""), label: String(o.name ?? "") }));
      const qq = q.trim().toLowerCase();
      return qq ? all.filter((o: SuggestItem) => o.label.toLowerCase().includes(qq)) : all.slice(0, 50);
    }
    const kind = method === "np_postomat" ? "postomat" : "branch";
    const res = await fetch(`/api/np/warehouses?cityRef=${encodeURIComponent(cityRef)}&kind=${kind}&q=${encodeURIComponent(q)}`, { cache: "no-store" });
    const data = await res.json();
    if (data.configured === false) { setNpManual(true); return []; }
    return (data.items || []).map((w: any) => ({ value: String(w.ref ?? ""), label: String(w.name ?? "") }));
  }

  const pointLabel =
    method === "np_postomat" ? "Поштомат" :
    method === "ukr_office" ? "Відділення Укрпошти" :
    "Відділення Нової Пошти";

  return (
    <div className="form-card">
      <h3><span className="num-circle">2</span> Спосіб доставки</h3>

      <div className="dp-methods">
        {METHODS.map((m) => (
          <button
            key={m.id}
            type="button"
            className={`dp-method ${method === m.id ? "active" : ""}`}
            onClick={() => switchMethod(m.id)}
          >
            <span className="dp-method-label">{m.label}</span>
            <span className="dp-method-hint">{m.hint}</span>
          </button>
        ))}
      </div>

      {isPickup ? (
        <div className="dp-pickup">
          <div className="dp-pickup-ic">📍</div>
          <div>
            <b>{STUDIO}</b>
            <p>Замовлення буде підготовлено до видачі. Менеджер повідомить, коли можна забрати.</p>
          </div>
        </div>
      ) : (
        <>
          {manual && (
            <p className="dp-manual-note">
              Онлайн-довідник тимчасово недоступний — впишіть місто й {method === "ukr_office" ? "індекс/№ відділення" : "№ відділення"} вручну, ми все одно приймемо замовлення.
            </p>
          )}

          {isUkr && !manual && (
            <div className="field dp-region">
              <label>Область</label>
              <select
                value={ukrRegion}
                onChange={(e) => { setUkrRegion(e.target.value); setCity(""); setCityRef(""); setPoint(""); }}
              >
                <option value="">Оберіть область…</option>
                {UKR_REGIONS.map((r) => (
                  <option key={r} value={r}>{r === "Київ" ? "м. Київ" : `${r} обл.`}</option>
                ))}
              </select>
            </div>
          )}

          <div className="row2">
            <Suggest
              label="Місто"
              placeholder={isUkr && !manual && !ukrRegion ? "Спочатку оберіть область" : "Почніть вводити — Київ, Львів…"}
              value={city}
              disabled={isUkr && !manual && !ukrRegion}
              manual={manual}
              fetcher={fetchCities}
              onText={(t) => { setCity(t); setCityRef(""); setPoint(""); }}
              onPick={(it) => { setCity(it.label); setCityRef(it.value); setPoint(""); }}
            />
            <Suggest
              label={pointLabel}
              placeholder={manual ? "Напр.: № 12 або індекс 01001" : "Спочатку оберіть місто"}
              value={point}
              disabled={!manual && !cityRef}
              manual={manual}
              fetcher={fetchPoints}
              onText={(t) => setPoint(t)}
              onPick={(it) => setPoint(it.label)}
            />
          </div>

          <p className="dp-foot">
            Посилку відправляє наш постачальник напряму до вас. Оплата доставки — за тарифом перевізника при отриманні.
          </p>
        </>
      )}
    </div>
  );
}
