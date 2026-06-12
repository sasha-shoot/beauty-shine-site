import { NextRequest, NextResponse } from "next/server";
import { getVisitsByUser } from "@/lib/airtable";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("user_id");
  console.log(`[/api/me/visits] requested for user_id="${userId}"`);

  if (!userId) return NextResponse.json({ visits: [] });
  try {
    const visits = await getVisitsByUser(userId);
    console.log(`[/api/me/visits] found ${visits.length} visits for user_id="${userId}"`);
    return NextResponse.json({ visits });
  } catch (e) {
    console.error("/api/me/visits error:", e);
    return NextResponse.json({ visits: [] });
  }
}

/* ── DELETE: скасувати СВІЙ запис ──
   Безпека: rec_id має належати користувачу з сесії (звіряємо ChatID). */
import { verifySession, SESSION_COOKIE } from "@/lib/auth";

const TOKEN = process.env.AIRTABLE_TOKEN;
const BASE_ID = process.env.AIRTABLE_BASE_ID;

export async function DELETE(req: NextRequest) {
  const cookie = req.cookies.get(SESSION_COOKIE)?.value;
  const session = cookie ? verifySession(cookie) : null;
  if (!session) {
    return NextResponse.json({ ok: false, error: "Потрібна авторизація" }, { status: 401 });
  }
  const recId = (req.nextUrl.searchParams.get("id") || "").trim();
  if (!/^rec[A-Za-z0-9]{14}$/.test(recId)) {
    return NextResponse.json({ ok: false, error: "Невалідний id" }, { status: 400 });
  }
  const base = `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent("Записи")}`;
  const h = { Authorization: `Bearer ${TOKEN}` };

  // 1. Перевіряємо власника
  const check = await fetch(`${base}/${recId}`, { headers: h, cache: "no-store" });
  if (!check.ok) {
    return NextResponse.json({ ok: false, error: "Запис не знайдено" }, { status: 404 });
  }
  const rec = await check.json();
  const owner = String(rec.fields?.["ChatID"] || "").trim();
  if (owner !== String(session.tg_user_id).trim()) {
    return NextResponse.json({ ok: false, error: "Це не ваш запис" }, { status: 403 });
  }

  // 2. Видаляємо
  const del = await fetch(`${base}/${recId}`, { method: "DELETE", headers: h });
  if (!del.ok) {
    return NextResponse.json({ ok: false, error: "Не вдалося скасувати" }, { status: 502 });
  }

  // 3. Сповіщаємо майстра в Telegram (fire-and-forget)
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const ADMIN = process.env.ADMIN_TG_CHAT_ID;
  if (BOT_TOKEN && ADMIN) {
    const f = rec.fields || {};
    const esc = (s: string) => String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const text = [
      "❌ <b>Клієнт скасував запис через сайт</b>",
      "",
      `👤 ${esc(f["Імʼя"])}${f["Username"] ? " (@" + esc(f["Username"]) + ")" : ""}`,
      `📅 ${esc(f["Дата"])} о ${esc(f["Час"])}`,
      `💅 ${esc(f["Послуга"])}${f["Деталі"] ? " · " + esc(f["Деталі"]) : ""}`,
    ].join("\n");
    fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: ADMIN, text, parse_mode: "HTML" }),
    }).catch((e) => console.error("cancel notify error:", e));
  }

  return NextResponse.json({ ok: true });
}
