import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const NP_KEY = process.env.NOVAPOSHTA_API_KEY;
const NP_URL = "https://api.novaposhta.ua/v2.0/json/";

/**
 * Автодоповнення міст Нової Пошти.
 * GET /api/np/cities?q=Київ
 * → { ok, configured, items: [{ ref, name }] }
 * Якщо ключ НП не налаштовано — повертає configured:false (клієнт переходить на ручний ввід).
 */
export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get("q") || "").trim().slice(0, 60);

  if (!NP_KEY) {
    return NextResponse.json({ ok: true, configured: false, items: [] });
  }
  if (q.length < 2) {
    return NextResponse.json({ ok: true, configured: true, items: [] });
  }

  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 8000);
    const res = await fetch(NP_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        apiKey: NP_KEY,
        modelName: "Address",
        calledMethod: "getCities",
        methodProperties: { FindByString: q, Limit: "20", Page: "1" },
      }),
      signal: ctrl.signal,
    });
    clearTimeout(t);

    if (!res.ok) {
      return NextResponse.json({ ok: false, configured: true, items: [] }, { status: 502 });
    }
    const data = await res.json();
    const items = Array.isArray(data?.data)
      ? data.data
          .map((c: any) => ({ ref: String(c.Ref || ""), name: String(c.Description || "") }))
          .filter((c: any) => c.ref && c.name)
      : [];
    return NextResponse.json({ ok: true, configured: true, items });
  } catch (e) {
    console.error("/api/np/cities error:", e);
    return NextResponse.json({ ok: false, configured: true, items: [] }, { status: 502 });
  }
}
