import { NextRequest, NextResponse } from "next/server";
import {
  exchangeCodeForTokens,
  signSession,
  verifyOauthState,
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  STATE_COOKIE,
} from "@/lib/auth";
import { getUserByTgId, createUser, updateUser } from "@/lib/airtable";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const stateParam = req.nextUrl.searchParams.get("state");
  const errorParam = req.nextUrl.searchParams.get("error");

  // 1. Telegram повернув помилку
  if (errorParam) {
    return redirectToHome(req, { authError: errorParam });
  }
  if (!code || !stateParam) {
    return redirectToHome(req, { authError: "missing_params" });
  }

  // 2. Перевіряємо state з cookie (CSRF + дістаємо verifier для PKCE)
  const stateCookie = req.cookies.get(STATE_COOKIE)?.value;
  if (!stateCookie) {
    return redirectToHome(req, { authError: "state_missing" });
  }
  const stateData = verifyOauthState(stateCookie);
  if (!stateData || stateData.state !== stateParam) {
    return redirectToHome(req, { authError: "state_mismatch" });
  }

  // 3. Обмінюємо code на токени через Telegram /token
  let claims;
  try {
    const result = await exchangeCodeForTokens({ code, codeVerifier: stateData.verifier });
    claims = result.claims;
  } catch (e: any) {
    console.error("token exchange error:", e?.message || e);
    return redirectToHome(req, { authError: "token_exchange_failed" });
  }

  // 4. Отримуємо/створюємо юзера в Airtable
  const tgUserId = String(claims.id);
  // preferred_username може бути "John Doe" або "@johndoe" — Telegram повертає username без @
  const fullName = claims.name || claims.preferred_username || "Користувач";
  const [firstName, ...rest] = fullName.split(" ");
  const lastName = rest.join(" ");
  const username = claims.preferred_username || "";
  const phone = claims.phone_number || "";

  let user = await getUserByTgId(tgUserId);
  if (!user) {
    user = await createUser({
      tg_user_id: tgUserId,
      first_name: firstName,
      last_name: lastName,
      username,
      phone,
    });
  } else {
    // Оновлюємо актуальні дані з Telegram (раптом юзер змінив username/name)
    const updates: any = {};
    if (firstName && user.first_name !== firstName) updates.first_name = firstName;
    if (lastName  && user.last_name !== lastName)   updates.last_name = lastName;
    if (username  && user.username !== username)    updates.username = username;
    if (phone     && !user.phone)                   updates.phone = phone;
    if (Object.keys(updates).length > 0) {
      await updateUser(user.rec_id, updates);
      Object.assign(user, updates);
    }
  }

  if (!user) {
    return redirectToHome(req, { authError: "user_create_failed" });
  }

  // 5. Сесійний cookie
  const session = signSession({
    tg_user_id: user.tg_user_id,
    name: `${user.first_name} ${user.last_name}`.trim() || user.username || "Користувач",
    username: user.username,
    issued_at: Math.floor(Date.now() / 1000),
  });

  // 6. Редірект на головну з відкритим профілем
  const redirectUrl = new URL("/", req.url);
  redirectUrl.searchParams.set("auth", "ok");
  const res = NextResponse.redirect(redirectUrl.toString(), { status: 302 });

  res.cookies.set(SESSION_COOKIE, session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  // прибираємо тимчасовий state cookie
  res.cookies.set(STATE_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return res;
}

function redirectToHome(req: NextRequest, params: Record<string, string>) {
  const url = new URL("/", req.url);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  return NextResponse.redirect(url.toString(), { status: 302 });
}
