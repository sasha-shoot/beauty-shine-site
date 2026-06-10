import { NextRequest, NextResponse } from "next/server";
import { verifySession, SESSION_COOKIE } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const TOKEN = process.env.AIRTABLE_TOKEN;
const BASE_ID = process.env.AIRTABLE_BASE_ID;
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ADMIN_TG_CHAT_ID = process.env.ADMIN_TG_CHAT_ID;

type Body = {
  customer_name: string;
  customer_phone: string;
  city: string;
  branch: string;
  comment?: string;
  items: { name: string; qty: number; price: number }[];
  total: number;
};

function genOrderNo(): string {
  return `BS-${String(Math.floor(Math.random() * 1000000)).padStart(6, "0")}`;
}

function formatItemsForDB(items: Body["items"]): string {
  return items.map((i) => `${i.name} ×${i.qty}`).join(", ");
}

function formatItemsForBot(items: Body["items"]): string {
  return items.map((i) => `  • ${i.name} ×${i.qty} — ${i.price * i.qty} грн`).join("\n");
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
    console.warn("TELEGRAM_BOT_TOKEN або ADMIN_TG_CHAT_ID не налаштовано — сповіщення не надіслано");
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
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Невалідний JSON" }, { status: 400 });
  }

  // Валідація
  if (!body.customer_name?.trim()) return NextResponse.json({ ok: false, error: "Бракує імені" }, { status: 400 });
  if (!body.customer_phone || body.customer_phone.replace(/\D/g, "").length < 10) {
    return NextResponse.json({ ok: false, error: "Невалідний номер телефону" }, { status: 400 });
  }
  if (!Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json({ ok: false, error: "Кошик порожній" }, { status: 400 });
  }

  // Юзер з cookie (якщо авторизований)
  const cookie = req.cookies.get(SESSION_COOKIE)?.value;
  const session = cookie ? verifySession(cookie) : null;
  const userId = session?.tg_user_id || "guest";

  // Записуємо в Airtable
  const orderNo = genOrderNo();
  const dateIso = new Date().toISOString();
  const address = `${body.city.trim()}, ${body.branch.trim()}`;

  const recordId = await writeToAirtable({
    order_no: orderNo,
    user_id: userId,
    customer_name: body.customer_name.trim(),
    customer_phone: body.customer_phone.trim(),
    items: formatItemsForDB(body.items),
    total: body.total,
    address,
    comment: body.comment?.trim() || "",
    date: dateIso,
  });

  if (!recordId) {
    return NextResponse.json({ ok: false, error: "Не вдалося зберегти замовлення" }, { status: 500 });
  }

  // Сповіщення тобі в бот
  const botText = [
    `🛍 <b>Нове замовлення ${orderNo}</b>`,
    ``,
    `👤 ${body.customer_name.trim()}`,
    `📞 ${body.customer_phone.trim()}`,
    session ? `🆔 tg_user_id: <code>${userId}</code>` : `👻 Гість (без реєстрації)`,
    ``,
    `<b>Товари:</b>`,
    formatItemsForBot(body.items),
    ``,
    `💰 <b>Сума: ${body.total} грн</b>`,
    ``,
    `📦 Куди: ${address}`,
    body.comment?.trim() ? `💬 Коментар: ${body.comment.trim()}` : ``,
  ].filter(Boolean).join("\n");

  // Не чекаємо щоб не блокувати респонс — fire-and-forget
  notifyAdminInBot(botText).catch((e) => console.error("notify error:", e));

  return NextResponse.json({ ok: true, order_no: orderNo });
}
