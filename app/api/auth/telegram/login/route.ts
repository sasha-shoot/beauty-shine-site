import { NextResponse } from "next/server";
import {
  generateState,
  generatePkcePair,
  buildAuthorizationUrl,
  signOauthState,
  STATE_COOKIE,
  STATE_MAX_AGE,
} from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const state = generateState();
    const { verifier, challenge } = generatePkcePair();

    const authUrl = buildAuthorizationUrl({
      state,
      codeChallenge: challenge,
      scope: "openid profile",
    });

    const stateCookieValue = signOauthState({ state, verifier });

    const res = NextResponse.redirect(authUrl, { status: 302 });
    res.cookies.set(STATE_COOKIE, stateCookieValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: STATE_MAX_AGE,
    });
    return res;
  } catch (e: any) {
    console.error("/api/auth/telegram/login error:", e);
    return NextResponse.json(
      { error: e?.message || "Не вдалось ініціювати логін" },
      { status: 500 }
    );
  }
}
