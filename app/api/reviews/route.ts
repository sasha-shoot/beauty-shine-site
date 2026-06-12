import { NextRequest, NextResponse } from "next/server";
import { verifySession, SESSION_COOKIE } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const TOKEN = process.env.AIRTABLE_TOKEN;
const BASE_ID = process.env.AIRTABLE_BASE_ID;
const TABLE = "Відгуки";

const MAX_TEXT = 600;
const MIN_TEXT = 10;
const MAX_TAG = 40;

function cleanStr(s: unknown, maxLen: number): string {
  if (typeof s !== "string") return "";
  return s.trim().slice(0, maxLen).replace(/[\x00-\x08\x0B-\x1F\x7F]/g, "");
}

function tableUrl(params = ""): string {
  const u = `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(TABLE)}`;
  return params ? `${u}?${params}` : u;
}

const headers = () => ({
  Authorization: `Bearer ${TOKEN}`,
  "Content-Type": "application/json",
});

type ReviewFields = {
  tg_user_id: string; name: string; picture?: string;
  text: string; rating: number; tag?: string;
  product_id?: string; date: string;
};

async function findByUser(userId: string, productId: string): Promise<{ id: string; fields: any } | null> {
  const uid = userId.replace(/'/g, "");
  const pid = productId.replace(/'/g, "");
  // Салонний відгук: product_id порожній; товарний: точний збіг product_id
  const formula = encodeURIComponent(
    pid
      ? `AND({tg_user_id}='${uid}', {product_id}='${pid}')`
      : `AND({tg_user_id}='${uid}', OR({product_id}='', {product_id}=BLANK()))`
  );
  const res = await fetch(tableUrl(`filterByFormula=${formula}&maxRecords=1`), {
    headers: headers(), cache: "no-store",
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.records?.[0] || null;
}

/* ── GET: всі відгуки (+ свій, якщо авторизований) ── */
export async function GET(req: NextRequest) {
  if (!TOKEN || !BASE_ID) {
    return NextResponse.json({ ok: false, reviews: [] }, { status: 500 });
  }
  const res = await fetch(tableUrl("pageSize=100"), { headers: headers(), cache: "no-store" });
  if (!res.ok) {
    return NextResponse.json({ ok: false, reviews: [] }, { status: 502 });
  }
  const data = await res.json();
  const productFilter = cleanStr(req.nextUrl.searchParams.get("product"), 100);
  const reviews = (data.records || [])
    .map((r: any) => ({
      rec_id: r.id,
      user_id: String(r.fields?.tg_user_id || ""),
      name: r.fields?.name || "Клієнт",
      picture: r.fields?.picture || "",
      text: r.fields?.text || "",
      rating: Math.min(5, Math.max(1, Number(r.fields?.rating) || 5)),
      tag: r.fields?.tag || "",
      product_id: String(r.fields?.product_id || ""),
      date: r.fields?.date || "",
    }))
    .filter((r: any) => r.text)
    .filter((r: any) => productFilter ? r.product_id === productFilter : !r.product_id)
    .sort((a: any, b: any) => (b.date || "").localeCompare(a.date || ""));

  // якщо є сесія — позначаємо свій відгук
  const cookie = req.cookies.get(SESSION_COOKIE)?.value;
  const session = cookie ? verifySession(cookie) : null;
  const mine = session ? reviews.find((r: any) => r.user_id === session.tg_user_id) || null : null;

  return NextResponse.json({ ok: true, reviews, mine });
}

/* ── POST: створити або оновити СВІЙ відгук ── */
export async function POST(req: NextRequest) {
  const cookie = req.cookies.get(SESSION_COOKIE)?.value;
  const session = cookie ? verifySession(cookie) : null;
  if (!session) {
    return NextResponse.json({ ok: false, error: "Потрібна авторизація" }, { status: 401 });
  }

  let body: any;
  try {
    const raw = await req.text();
    if (raw.length > 10_000) {
      return NextResponse.json({ ok: false, error: "Запит завеликий" }, { status: 413 });
    }
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: false, error: "Невалідний JSON" }, { status: 400 });
  }

  const text = cleanStr(body?.text, MAX_TEXT);
  if (text.length < MIN_TEXT) {
    return NextResponse.json({ ok: false, error: `Відгук закороткий (мінімум ${MIN_TEXT} символів)` }, { status: 400 });
  }
  const rating = Math.min(5, Math.max(1, Math.round(Number(body?.rating)) || 5));
  // Теги: масив рядків → зберігаємо через кому (до 5 тегів)
  const tagsArr: string[] = Array.isArray(body?.tags)
    ? body.tags.map((t: unknown) => cleanStr(t, MAX_TAG)).filter(Boolean).slice(0, 5)
    : [];
  const legacyTag = cleanStr(body?.tag, MAX_TAG);
  const tag = tagsArr.length ? tagsArr.join(", ") : legacyTag;
  const productId = cleanStr(body?.product_id, 100);

  // Аватарка — з таблиці «Користувачі» (в сесії її нема)
  let picture = "";
  try {
    const uf = encodeURIComponent(`{tg_user_id}='${session.tg_user_id.replace(/'/g, "")}'`);
    const ures = await fetch(
      `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent("Користувачі")}?filterByFormula=${uf}&maxRecords=1`,
      { headers: headers(), cache: "no-store" }
    );
    if (ures.ok) {
      const udata = await ures.json();
      picture = udata.records?.[0]?.fields?.picture || "";
    }
  } catch { /* без аватарки — не критично */ }

  const fields: ReviewFields = {
    tg_user_id: session.tg_user_id,
    name: session.name || "Клієнт",
    picture,
    text, rating, tag,
    product_id: productId,
    date: new Date().toISOString().slice(0, 10),
  };

  const existing = await findByUser(session.tg_user_id, productId);
  const res = existing
    ? await fetch(`${tableUrl()}/${existing.id}`, {
        method: "PATCH", headers: headers(), body: JSON.stringify({ fields }),
      })
    : await fetch(tableUrl(), {
        method: "POST", headers: headers(), body: JSON.stringify({ fields }),
      });

  if (!res.ok) {
    console.error("reviews write error:", res.status, await res.text());
    return NextResponse.json({ ok: false, error: "Не вдалося зберегти відгук" }, { status: 502 });
  }
  return NextResponse.json({ ok: true, updated: Boolean(existing) });
}

/* ── DELETE: видалити СВІЙ відгук ── */
export async function DELETE(req: NextRequest) {
  const cookie = req.cookies.get(SESSION_COOKIE)?.value;
  const session = cookie ? verifySession(cookie) : null;
  if (!session) {
    return NextResponse.json({ ok: false, error: "Потрібна авторизація" }, { status: 401 });
  }
  const productId = cleanStr(req.nextUrl.searchParams.get("product"), 100);
  const existing = await findByUser(session.tg_user_id, productId);
  if (!existing) {
    return NextResponse.json({ ok: true, deleted: false });
  }
  const res = await fetch(`${tableUrl()}/${existing.id}`, { method: "DELETE", headers: headers() });
  if (!res.ok) {
    return NextResponse.json({ ok: false, error: "Не вдалося видалити" }, { status: 502 });
  }
  return NextResponse.json({ ok: true, deleted: true });
}
