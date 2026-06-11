import { NextRequest, NextResponse } from "next/server";

/**
 * Rate-limiting middleware (in-memory, на edge-інстанс).
 *
 * Ліміти:
 *   /api/auth/*  — 10 запитів / хв з одного IP (захист від брутфорсу OAuth)
 *   /api/orders  — 5 запитів / хв з одного IP (захист від спам-замовлень)
 *   /api/*       — 60 запитів / хв з одного IP (загальний захист)
 *
 * Обмеження: пам'ять очищається при перезапуску інстансу Vercel і не
 * шариться між регіонами. Для нашого трафіку (сотні клієнтів) цього достатньо.
 * Якщо виростемо — перейдемо на Upstash Redis.
 */

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

const WINDOW_MS = 60_000; // 1 хвилина

const LIMITS: { prefix: string; max: number }[] = [
  { prefix: "/api/auth/", max: 10 },
  { prefix: "/api/orders", max: 5 },
  { prefix: "/api/", max: 60 },
];

function getClientIp(req: NextRequest): string {
  // Vercel ставить реальний IP у x-forwarded-for (перший у списку)
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

function checkLimit(key: string, max: number): { ok: boolean; retryAfter: number } {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now >= bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true, retryAfter: 0 };
  }

  bucket.count += 1;
  if (bucket.count > max) {
    return { ok: false, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) };
  }
  return { ok: true, retryAfter: 0 };
}

// Періодичне прибирання застарілих записів (захист від розростання Map)
let lastCleanup = Date.now();
function cleanupIfNeeded() {
  const now = Date.now();
  if (now - lastCleanup < 5 * 60_000) return; // раз на 5 хв
  lastCleanup = now;
  buckets.forEach((bucket, key) => {
    if (now >= bucket.resetAt) buckets.delete(key);
  });
}

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Rate-limiting тільки для API
  if (path.startsWith("/api/")) {
    cleanupIfNeeded();
    const ip = getClientIp(req);

    // Знаходимо найжорсткіший застосовний ліміт (перший збіг — найспецифічніший)
    const rule = LIMITS.find((l) => path.startsWith(l.prefix));
    if (rule) {
      const key = `${rule.prefix}|${ip}`;
      const { ok, retryAfter } = checkLimit(key, rule.max);
      if (!ok) {
        return new NextResponse(
          JSON.stringify({ ok: false, error: "Забагато запитів. Спробуйте за хвилину." }),
          {
            status: 429,
            headers: {
              "Content-Type": "application/json",
              "Retry-After": String(retryAfter),
            },
          }
        );
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
