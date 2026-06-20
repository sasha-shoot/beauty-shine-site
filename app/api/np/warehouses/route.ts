import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const NP_KEY = process.env.NOVAPOSHTA_API_KEY;
const NP_URL = "https://api.novaposhta.ua/v2.0/json/";

/**
 * Відділення / поштомати Нової Пошти для обраного міста.
 * GET /api/np/warehouses?cityRef=<Ref>&kind=branch|postomat&q=12
 * → { ok, configured, items: [{ ref, name }] }
 * kind=postomat → лише поштомати (CategoryOfWarehouse === "Postomat")
 * kind=branch   → решта (звичайні відділення)
 */
export async function GET(req: NextRequest) {
  const cityRef = (req.nextUrl.searchParams.get("cityRef") || "").trim().slice(0, 60);
  const kind = req.nextUrl.searchParams.get("kind") === "postomat" ? "postomat" : "branch";
  const q = (req.nextUrl.searchParams.get("q") || "").trim().slice(0, 60);

  if (!NP_KEY) {
    return NextResponse.json({ ok: true, configured: false, items: [] });
  }
  if (!cityRef) {
    return NextResponse.json({ ok: true, configured: true, items: [] });
  }

  try {
    const props: Record<string, string> = { CityRef: cityRef, Limit: "50", Page: "1", Language: "UA" };
    if (q) props.FindByString = q;

    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 8000);
    const res = await fetch(NP_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        apiKey: NP_KEY,
        modelName: "Address",
        calledMethod: "getWarehouses",
        methodProperties: props,
      }),
      signal: ctrl.signal,
    });
    clearTimeout(t);

    if (!res.ok) {
      return NextResponse.json({ ok: false, configured: true, items: [] }, { status: 502 });
    }
    const data = await res.json();
    const raw: any[] = Array.isArray(data?.data) ? data.data : [];

    const items = raw
      .filter((w) => {
        const isPostomat = String(w.CategoryOfWarehouse || "") === "Postomat";
        return kind === "postomat" ? isPostomat : !isPostomat;
      })
      .map((w) => ({ ref: String(w.Ref || ""), name: String(w.Description || "") }))
      .filter((w) => w.ref && w.name)
      .slice(0, 50);

    return NextResponse.json({ ok: true, configured: true, items });
  } catch (e) {
    console.error("/api/np/warehouses error:", e);
    return NextResponse.json({ ok: false, configured: true, items: [] }, { status: 502 });
  }
}
