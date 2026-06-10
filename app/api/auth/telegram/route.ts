import { NextRequest, NextResponse } from "next/server";
import {
  verifyTelegramHash,
  signSession,
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  type TelegramAuthPayload,
} from "@/lib/auth";
import { getUserByTgId, createUser, updateUser } from "@/lib/airtable";

export const dynamic = "force-dynamic";
export const runtime = "nodejs"; // потрібен Node для crypto

export async function POST(req: NextRequest) {
  let body: TelegramAuthPayload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Невалідний JSON" }, { status: 400 });
  }

  if (!body || !body.id || !body.hash || !body.auth_date) {
    return NextResponse.json({ ok: false, error: "Бракує обов'язкових полів" }, { status: 400 });
  }

  // 1. Перевірка hash через bot token
  if (!verifyTelegramHash(body)) {
    return NextResponse.json({ ok: false, error: "Невалідний підпис Telegram" }, { status: 401 });
  }

  const tgUserId = String(body.id);
  const firstName = body.first_name || "";
  const lastName = body.last_name || "";
  const username = body.username || "";

  // 2. Знайти / створити користувача в Airtable
  let user = await getUserByTgId(tgUserId);
  if (!user) {
    user = await createUser({
      tg_user_id: tgUserId,
      first_name: firstName,
      last_name: lastName,
      username,
    });
  } else {
    // Оновлюємо актуальні дані з Telegram (раптом юзер змінив username)
    if (user.first_name !== firstName || user.last_name !== lastName || user.username !== username) {
      await updateUser(user.rec_id, { first_name: firstName, last_name: lastName, username });
      user.first_name = firstName;
      user.last_name = lastName;
      user.username = username;
    }
  }

  if (!user) {
    return NextResponse.json({ ok: false, error: "Не вдалося створити запис у базі" }, { status: 500 });
  }

  // 3. Підписаний cookie
  const session = signSession({
    tg_user_id: user.tg_user_id,
    first_name: user.first_name,
    last_name: user.last_name,
    username: user.username,
    issued_at: Math.floor(Date.now() / 1000),
  });

  const res = NextResponse.json({
    ok: true,
    user: {
      id: user.tg_user_id,
      name: `${user.first_name} ${user.last_name}`.trim() || user.username || "Користувач",
      username: user.username ? `@${user.username}` : "",
      phone: user.phone,
      city: user.city,
      bonus: user.bonus,
      method: "tg",
    },
  });

  res.cookies.set(SESSION_COOKIE, session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  return res;
}
