import { NextRequest, NextResponse } from "next/server";
import { verifySession, SESSION_COOKIE } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const TOKEN = process.env.AIRTABLE_TOKEN;
const BASE_ID = process.env.AIRTABLE_BASE_ID;
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ADMIN_TG_CHAT_ID = process.env.ADMIN_TG_CHAT_ID;

type Item = { name: string; qty: number; price: number; variant?: string };
type Body = {
  customer_name: string;
  customer_phone: string;
  city: string;
  branch: string;
  comment?: string;
  items: Item[];
  total: number;
};

/* ── Ліміти валідації ─────────────────────────────────────── */
const MAX_NAME = 100;
const MAX_PHONE = 20;
const MAX_CITY = 80;
const MAX_BRANCH = 120;
const MAX_COMMENT = 500;
const MAX_ITEMS = 50;
const MAX_ITEM_NAME = 200;
const MAX_QTY = 99;
const MAX_PRICE = 1_000_000; // 1 млн грн за одиницю — стеля проти сміття
const MAX_TOTAL = 10_000_000;

/* ── Санітизація ──────────────────────────────────────────── */
/** Екранує HTML-спецсимволи — захист від ін'єкцій у Telegram HTML-повідомлення. */
function escHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Обрізає, прибирає керуючі символи (крім \n у коментарі). */
function cleanStr(s: unknown, maxLen: number, keepNewlines = false): string {
  if (typeof s !== "string") return "";
  let out = s.trim().slice(0, maxLen);
  out = keepNewlines
    ? out.replace(/[\x00-\x09\x0B-\x1F\x7F]/g, "")
    : out.replace(/[\x00-\x1F\x7F]/g, " ");
  return out;
}

function isFiniteNum(n: unknown): n is number {
  return typeof n === "number" && Number.isFinite(n);
}

function genOrderNo(): string {
  return `BS-${String(Math.floor(Math.random() * 1000000)).padStart(6, "0")}`;
}

function formatItemsForDB(items: Item[]): string {
  return items.map((i) => `${i.name}${i.variant ? ` (${i.variant})` : ""} ×${i.qty}`).join(", ");
}

function formatItemsForBot(items: Item[]): string {
  return items
    .map((i) => `  • ${escHtml(i.name)}${i.variant ? ` (${escHtml(i.variant)})` : ""} ×${i.qty} — ${i.price * i.qty} грн`)
    .join("\n");
}

async function writeToAirtable(record: any): Promise<string | null> {
  if (!TOKEN || !BASE_ID) {
    console.error("Airtable env vars не налаштовано");
    return null;
  }
  try {
    const res = await fetch(
      `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent("Замовлення")}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fields: record }),
      }
    );
    if (!res.ok) {
      console.error("Airtable POST помилка:", res.status, await res.text());
      return null;
    }
    const data = await res.json();
    return data.id;
  } catch (e) {
    console.error("Airtable POST exception:", e);
    return null;
  }
}

async function notifyAdminInBot(text: string): Promise<void> {
  if (!BOT_TOKEN || !ADMIN_TG_CHAT_ID) {
    console.warn("TELEGRAM_BOT_TOKEN або ADMIN_TG_CHAT_ID не налаштовано");
    return;
  }
  try {
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: ADMIN_TG_CHAT_ID,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });
    if (!res.ok) {
      console.error("Telegram sendMessage помилка:", res.status, await res.text());
    }
  } catch (e) {
    console.error("Telegram sendMessage exception:", e);
  }
}

export async function POST(req: NextRequest) {
  /* 1. Парсинг JSON з лімітом розміру (захист від величезних payload) */
  let raw: string;
  try {
    raw = await req.text();
    if (raw.length > 50_000) {
      return NextResponse.json({ ok: false, error: "Запит завеликий" }, { status: 413 });
    }
  } catch {
    return NextResponse.json({ ok: false, error: "Помилка читання запиту" }, { status: 400 });
  }

  let body: Body;
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: false, error: "Невалідний JSON" }, { status: 400 });
  }
  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false, error: "Невалідне тіло запиту" }, { status: 400 });
  }

  /* 2. Санітизація текстових полів */
  const customerName = cleanStr(body.customer_name, MAX_NAME);
  const customerPhone = cleanStr(body.customer_phone, MAX_PHONE);
  const city = cleanStr(body.city, MAX_CITY);
  const branch = cleanStr(body.branch, MAX_BRANCH);
  const comment = cleanStr(body.comment, MAX_COMMENT, true);

  /* 3. Валідація обов'язкових полів */
  if (!customerName) {
    return NextResponse.json({ ok: false, error: "Бракує імені" }, { status: 400 });
  }
  const phoneDigits = customerPhone.replace(/\D/g, "");
  if (phoneDigits.length < 10 || phoneDigits.length > 15) {
    return NextResponse.json({ ok: false, error: "Невалідний номер телефону" }, { status: 400 });
  }
  if (!city) {
    return NextResponse.json({ ok: false, error: "Вкажіть місто" }, { status: 400 });
  }
  if (!branch) {
    return NextResponse.json({ ok: false, error: "Вкажіть відділення" }, { status: 400 });
  }

  /* 4. Валідація items: типи, межі, санітизація назв */
  if (!Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json({ ok: false, error: "Кошик порожній" }, { status: 400 });
  }
  if (body.items.length > MAX_ITEMS) {
    return NextResponse.json({ ok: false, error: "Забагато позицій у кошику" }, { status: 400 });
  }

  const items: Item[] = [];
  for (const it of body.items) {
    if (!it || typeof it !== "object") {
      return NextResponse.json({ ok: false, error: "Невалідна позиція" }, { status: 400 });
    }
    const name = cleanStr(it.name, MAX_ITEM_NAME);
    if (!name) {
      return NextResponse.json({ ok: false, error: "Позиція без назви" }, { status: 400 });
    }
    if (!isFiniteNum(it.qty) || !Number.isInteger(it.qty) || it.qty < 1 || it.qty > MAX_QTY) {
      return NextResponse.json({ ok: false, error: "Невалідна кількість" }, { status: 400 });
    }
    if (!isFiniteNum(it.price) || it.price < 0 || it.price > MAX_PRICE) {
      return NextResponse.json({ ok: false, error: "Невалідна ціна" }, { status: 400 });
    }
    const variant = cleanStr(it.variant, 60);
    items.push({ name, qty: it.qty, price: Math.round(it.price), variant });
  }

  /* 5. Верифікація total — сервер рахує сам, клієнту не довіряємо */
  const computedTotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  if (!isFiniteNum(body.total) || body.total > MAX_TOTAL) {
    return NextResponse.json({ ok: false, error: "Невалідна сума" }, { status: 400 });
  }
  // Дозволяємо невелику розбіжність на округлення; якщо більша — беремо серверну
  const total = Math.abs(computedTotal - body.total) <= 1 ? Math.round(body.total) : computedTotal;

  /* 6. Юзер з cookie (якщо авторизований) */
  const cookie = req.cookies.get(SESSION_COOKIE)?.value;
  const session = cookie ? verifySession(cookie) : null;
  const userId = session?.tg_user_id || "guest";

  /* 7. Запис в Airtable */
  const orderNo = genOrderNo();
  const dateIso = new Date().toISOString();
  const address = `${city}, ${branch}`;

  const recordId = await writeToAirtable({
    order_no: orderNo,
    user_id: userId,
    customer_name: customerName,
    customer_phone: customerPhone,
    items: formatItemsForDB(items),
    total,
    address,
    comment,
    date: dateIso,
  });

  if (!recordId) {
    return NextResponse.json({ ok: false, error: "Не вдалося зберегти замовлення" }, { status: 500 });
  }

  /* 8. Нотифікація адміну (все екрановано) */
  const botText = [
    `🛍 <b>Нове замовлення ${orderNo}</b>`,
    ``,
    `👤 ${escHtml(customerName)}`,
    `📞 ${escHtml(customerPhone)}`,
    session ? `🆔 tg_user_id: <code>${escHtml(userId)}</code>` : `👻 Гість (без реєстрації)`,
    ``,
    `<b>Товари:</b>`,
    formatItemsForBot(items),
    ``,
    `💰 <b>Сума: ${total} грн</b>`,
    ``,
    `📦 Куди: ${escHtml(address)}`,
    comment ? `💬 Коментар: ${escHtml(comment)}` : ``,
  ].filter(Boolean).join("\n");

  notifyAdminInBot(botText).catch((e) => console.error("notify error:", e));

  return NextResponse.json({ ok: true, order_no: orderNo });
}
