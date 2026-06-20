import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const UKR_BEARER = process.env.UKRPOSHTA_BEARER;
const UKR_BASE = "https://www.ukrposhta.ua/address-classifier-ws";

/**
 * Відділення Укрпошти для обраного міста.
 * GET /api/ukr/offices?cityId=<CITY_ID>
 * → { ok, configured, items: [{ index, name }] }
 * Без bearer-токена → configured:false.
 * ⚠️ Перевірити вживу після активації токена.
 */
export async function GET(req: NextRequest) {
  const cityId = (req.nextUrl.searchParams.get("cityId") || "").trim().slice(0, 30);

  if (!UKR_BEARER) {
    return NextResponse.json({ ok: true, configured: false, items: [] });
  }
  if (!cityId) {
    return NextResponse.json({ ok: true, configured: true, items: [] });
  }

  try {
    const url = `${UKR_BASE}/get_postoffices_by_cityid?city_id=${encodeURIComponent(cityId)}`;
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
      .map((o: any) => {
        const index = String(o.POSTINDEX ?? o.POSTCODE ?? "");
        const label = String(o.PO_LONG || o.PO_SHORT || o.POSTOFFICE_UA || "").trim();
        const name = index ? `${index} — ${label}` : label;
        return { index, name };
      })
      .filter((o: any) => o.index && o.name)
      .slice(0, 100);

    return NextResponse.json({ ok: true, configured: true, items });
  } catch (e) {
    console.error("/api/ukr/offices error:", e);
    return NextResponse.json({ ok: false, configured: true, items: [] }, { status: 502 });
  }
}
