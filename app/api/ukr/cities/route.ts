import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const UKR_BEARER = process.env.UKRPOSHTA_BEARER;
const UKR_BASE = "https://www.ukrposhta.ua/address-classifier-ws";

/**
 * Пошук населеного пункту в адресному класифікаторі Укрпошти.
 * GET /api/ukr/cities?q=Київ
 * → { ok, configured, items: [{ id, name }] }
 * Без bearer-токена → configured:false (клієнт переходить на ручний ввід).
 * ⚠️ Перевірити вживу після активації токена (структуру Entries.Entry).
 */
export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get("q") || "").trim().slice(0, 60);

  if (!UKR_BEARER) {
    return NextResponse.json({ ok: true, configured: false, items: [] });
  }
  if (q.length < 2) {
    return NextResponse.json({ ok: true, configured: true, items: [] });
  }

  try {
    const url = `${UKR_BASE}/get_city_by_region_id_and_district_id_and_city_ua?city_ua=${encodeURIComponent(q)}`;
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 8000);
    const res = await fetch(url, {
      method: "GET",
      headers: { Authorization: `Bearer ${UKR_BEARER}`, Accept: "application/json" },
      signal: ctrl.signal,
    });
    clearTimeout(t);

    if (!res.ok) {
      return NextResponse.json({ ok: false, configured: true, items: [] }, { status: 502 });
    }
    const data = await res.json();
    const entries: any[] = Array.isArray(data?.Entries?.Entry) ? data.Entries.Entry : [];

    const items = entries
      .map((c: any) => {
        const id = String(c.CITY_ID ?? c.CITY_KOATUU ?? "");
        const region = c.REGION_UA ? `, ${c.REGION_UA}` : "";
        const district = c.DISTRICT_UA ? ` (${c.DISTRICT_UA} р-н)` : "";
        return { id, name: `${c.CITY_UA || ""}${district}${region}`.trim() };
      })
      .filter((c: any) => c.id && c.name)
      .slice(0, 20);

    return NextResponse.json({ ok: true, configured: true, items });
  } catch (e) {
    console.error("/api/ukr/cities error:", e);
    return NextResponse.json({ ok: false, configured: true, items: [] }, { status: 502 });
  }
}
