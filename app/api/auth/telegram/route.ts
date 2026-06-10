// Старий ендпоінт авторизації (legacy HMAC widget) — більше не використовується.
// Замість нього: /api/auth/telegram/login + /api/auth/telegram/callback (OIDC потік).
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.redirect(new URL("/api/auth/telegram/login", "https://beauty-shine-site.vercel.app"));
}

export async function POST() {
  return NextResponse.json(
    { ok: false, error: "Deprecated endpoint. Use OIDC flow via /api/auth/telegram/login" },
    { status: 410 }
  );
}
