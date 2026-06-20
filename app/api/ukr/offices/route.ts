import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const UKR_BEARER = process.env.UKRPOSHTA_BEARER;
const UKR_BASE = "https://www.ukrposhta.ua/address-classifier-ws";

function ukrHeaders(): Record<string, string> {
  const h: Record<string, string> = { Accept: "application/json" };
  if (UKR_BEARER) h.Authorization = `Bearer ${UKR_BEARER}`;
  return h;
}

async function ukrGet(path: string): Promise<Response> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 8000);
  try {
    return await fetch(`${UKR_BASE}${path}`, { headers: ukrHeaders(), signal: ctrl.signal });
  } finally {
    clearTimeout(t);
  }
}

function entries(data: any): any[] {
  return Array.isArray(data?.Entries?.Entry) ? data.Entries.Entry : [];
}

/**
 * Відділення Укрпошти для обраного населеного пункту (за CITY_ID).
 * GET /api/ukr/offices?cityId=10952
 * → { ok, configured, items: [{ index, name }] }   (index = POSTCODE)
 * Відфільтровано: лише активні (LOCK_CODE=0) і не закритого типу (IS_SECURITY≠1).
 */
export async function GET(req: NextRequest) {
  const cityId = (req.nextUrl.searchParams.get("cityId") || "").trim().slice(0, 30);

  if (!cityId) {
    return NextResponse.json({ ok: true, configured: true, items: [] });
  }

  try {
    const res = await ukrGet(
      `/get_postoffices_by_postcode_cityid_cityvpzid?city_id=${encodeURIComponent(cityId)}`
    );
    if (res.status === 401 || res.status === 403) {
      return NextResponse.json({ ok: true, configured: false, items: [] });
    }
    if (!res.ok) {
      return NextResponse.json({ ok: false, configured: true, items: [] }, { status: 502 });
    }

    const items = entries(await res.json())
      .filter((o: any) => String(o.LOCK_CODE ?? "0") === "0" && String(o.IS_SECURITY ?? "0") !== "1")
      .map((o: any) => {
        const index = String(o.POSTCODE || "");
        const street = String(o.STREET_UA_VPZ || "").trim();
        const label = street || String(o.POSTOFFICE_UA || "").trim();
        const name = index ? (label ? `${index} — ${label}` : index) : label;
        return { index, name };
      })
      .filter((o: any) => o.index && o.name)
      .slice(0, 150);

    return NextResponse.json({ ok: true, configured: true, items });
  } catch (e) {
    console.error("/api/ukr/offices error:", e);
    return NextResponse.json({ ok: false, configured: true, items: [] }, { status: 502 });
  }
}
