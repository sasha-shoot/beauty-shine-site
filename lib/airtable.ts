/**
 * Airtable-клієнт. Тягне товари з бази через REST API.
 * Кешує відповіді 60 секунд (Next.js fetch revalidate).
 *
 * Env vars (виставляти у Vercel → Settings → Environment Variables):
 *   AIRTABLE_TOKEN    — Personal Access Token з прав scope data.records:read
 *   AIRTABLE_BASE_ID  — ID бази (у адресі: airtable.com/appXXXXX → це appXXXXX)
 */

const TOKEN = process.env.AIRTABLE_TOKEN;
const BASE_ID = process.env.AIRTABLE_BASE_ID;
const TABLE = "Товари";
const CACHE_SECONDS = 60;

export type Product = {
  rec_id: string;         // внутрішній Airtable ID запису
  slug: string;           // URL-slug (поле "id" у таблиці)
  name: string;
  brand: string;
  category: string;
  tags: string[];
  variants_display: string;
  price_uah: number | null;       // ваша роздрібна ціна
  supplier_min_price: number;
  supplier_max_price: number;
  currency: string;
  short: string;
  long: string;
  usage: string;
  inci: string;
  image: string;
  source: string;
  status: string;
  in_stock: boolean;
  featured: boolean;
};

async function airtableFetch(query: string = ""): Promise<{ records: any[]; offset?: string }> {
  if (!TOKEN || !BASE_ID) {
    // Якщо env vars не налаштовано — повертаємо порожньо.
    // Дозволяє зробити перший білд на Vercel ще до того як ти додав ключі.
    console.warn("AIRTABLE_TOKEN/BASE_ID не налаштовано — повертаю порожній каталог");
    return { records: [] };
  }
  const url = `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(TABLE)}${query}`;
  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${TOKEN}` },
      next: { revalidate: CACHE_SECONDS },
    });
    if (!res.ok) {
      console.error(`Airtable ${res.status}: ${await res.text()}`);
      return { records: [] };
    }
    return res.json();
  } catch (e) {
    console.error("Airtable fetch error:", e);
    return { records: [] };
  }
}

function recordToProduct(rec: any): Product {
  const f = rec.fields || {};
  // Поле "image" в Airtable може бути або URL рядком, або Attachment-полем
  let imageUrl = "";
  if (typeof f.image === "string") {
    imageUrl = f.image;
  } else if (Array.isArray(f.image) && f.image.length > 0) {
    imageUrl = f.image[0].url || f.image[0].thumbnails?.large?.url || "";
  }
  return {
    rec_id: rec.id,
    slug: f.id || rec.id,
    name: f.name || "",
    brand: f.brand || "",
    category: f.category || "",
    tags: typeof f.tags === "string" ? f.tags.split(",").map((x: string) => x.trim()) : f.tags || [],
    variants_display: f.variants_display || "",
    price_uah: typeof f.price_uah === "number" ? f.price_uah : null,
    supplier_min_price: f.supplier_min_price || 0,
    supplier_max_price: f.supplier_max_price || 0,
    currency: f.currency || "USD",
    short: f.short || "",
    long: f.long || "",
    usage: f.usage || "",
    inci: f.inci || "",
    image: imageUrl,
    source: f.source || "",
    status: f.status || "",
    in_stock: f.in_stock === true,
    featured: f.featured === true,
  };
}

/** Усі товари з Airtable (з пагінацією до 100 записів за запит). */
export async function getAllProducts(): Promise<Product[]> {
  const out: Product[] = [];
  let offset = "";
  do {
    const q = offset
      ? `?pageSize=100&offset=${encodeURIComponent(offset)}`
      : `?pageSize=100`;
    const data = await airtableFetch(q);
    out.push(...data.records.map(recordToProduct));
    offset = data.offset || "";
  } while (offset);
  return out;
}

/** Один товар за slug (поле "id" у таблиці). Без filterByFormula — фільтруємо в JS. */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const all = await getAllProducts();
  return all.find((p) => p.slug === slug) || null;
}

/** Хіти продажів — featured + у наявності. Без filterByFormula — фільтруємо в JS. */
export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  const all = await getAllProducts();
  return all.filter((p) => p.featured && p.in_stock).slice(0, limit);
}

/** Категорії з підрахунком к-сті товарів. */
export async function getCategories(): Promise<{ name: string; count: number }[]> {
  const all = await getAllProducts();
  const counts = new Map<string, number>();
  for (const p of all) {
    if (p.in_stock && p.category) {
      counts.set(p.category, (counts.get(p.category) || 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}
