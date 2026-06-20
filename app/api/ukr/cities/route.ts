import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const UKR_BEARER = process.env.UKRPOSHTA_BEARER;
const UKR_BASE = "https://www.ukrposhta.ua/address-classifier-ws";

// Кеш region_name → REGION_ID (на час життя інстансу), щоб не резолвити щоразу
const regionIdCache = new Map<string, string>();

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

const norm = (s: any) => String(s || "").trim().toLowerCase();

/**
 * Пошук населеного пункту в адресному класифікаторі Укрпошти.
 * Класифікатор працює ланцюжком: Область → Населений пункт → Відділення.
 * GET /api/ukr/cities?region=Київська&q=Бровари
 * → { ok, configured, items: [{ id, name }] }   (id = CITY_ID)
 * configured:false → потрібна авторизація (нема токена) → клієнт переходить на ручний ввід.
 */
export async function GET(req: NextRequest) {
  const region = (req.nextUrl.searchParams.get("region") || "").trim().slice(0, 60);
  const q = (req.nextUrl.searchParams.get("q") || "").trim().slice(0, 60);

  if (!region || q.length < 2) {
    return NextResponse.json({ ok: true, configured: true, items: [] });
  }

  try {
    // 1. Область → REGION_ID
    let regionId = regionIdCache.get(norm(region));
    if (!regionId) {
      const rRes = await ukrGet(`/get_regions_by_region_ua?region_name=${encodeURIComponent(region)}`);
      if (rRes.status === 401 || rRes.status === 403) {
        return NextResponse.json({ ok: true, configured: false, items: [] });
      }
      if (!rRes.ok) {
        return NextResponse.json({ ok: false, configured: true, items: [] }, { status: 502 });
      }
      const rList = entries(await rRes.json());
      const chosen = rList.find((r: any) => norm(r.REGION_UA) === norm(region)) || rList[0];
      regionId = chosen ? String(chosen.REGION_ID || "") : "";
      if (regionId) regionIdCache.set(norm(region), regionId);
    }
    if (!regionId) {
      return NextResponse.json({ ok: true, configured: true, items: [] });
    }

    // 2. Населений пункт за region_id + назвою
    const cRes = await ukrGet(
      `/get_city_by_region_id_and_district_id_and_city_ua?region_id=${encodeURIComponent(regionId)}&city_ua=${encodeURIComponent(q)}`
    );
    if (cRes.status === 401 || cRes.status === 403) {
      return NextResponse.json({ ok: true, configured: false, items: [] });
    }
    if (!cRes.ok) {
      return NextResponse.json({ ok: false, configured: true, items: [] }, { status: 502 });
    }

    const items = entries(await cRes.json())
      .map((c: any) => {
        const id = String(c.CITY_ID || "");
        const type = c.SHORTCITYTYPE_UA ? `${c.SHORTCITYTYPE_UA} ` : "";
        const district = c.DISTRICT_UA ? ` (${c.DISTRICT_UA} р-н)` : "";
        const own = c.OWNOF ? `, ${c.OWNOF}` : "";
        return { id, name: `${type}${c.CITY_UA || ""}${district}${own}`.trim() };
      })
      .filter((c: any) => c.id && c.name)
      .slice(0, 30);

    return NextResponse.json({ ok: true, configured: true, items });
  } catch (e) {
    console.error("/api/ukr/cities error:", e);
    return NextResponse.json({ ok: false, configured: true, items: [] }, { status: 502 });
  }
}
