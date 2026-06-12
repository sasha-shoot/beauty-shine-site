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

function isValidSlug(s: string): boolean {
  // Slug — лише латинські букви, цифри, дефіси, підкреслення.
  // НЕ містить пробілів, крапок, кирилиці чи службових міток типу "TODO".
  if (!s || s.length < 2) return false;
  if (s === "TODO" || s.toLowerCase() === "todo") return false;
  return /^[a-zA-Z0-9_-]+$/.test(s);
}

function isValidImageUrl(s: string): boolean {
  // Image використовуємо як <img src=...> — приймаємо тільки повні http/https URL.
  // Інакше браузер інтерпретує як відносний шлях і робить 404.
  return /^https?:\/\//i.test(s);
}

function recordToProduct(rec: any): Product {
  const f = rec.fields || {};

  // Slug — або валідний id з таблиці, або резерв на Airtable record ID
  const rawSlug = typeof f.id === "string" ? f.id.trim() : "";
  const slug = isValidSlug(rawSlug) ? rawSlug : rec.id;

  // Image — або валідний http(s) URL, або attachment-поле, або пусто
  let imageUrl = "";
  if (typeof f.image === "string" && isValidImageUrl(f.image)) {
    imageUrl = f.image;
  } else if (Array.isArray(f.image) && f.image.length > 0) {
    imageUrl = f.image[0].url || f.image[0].thumbnails?.large?.url || "";
  }

  return {
    rec_id: rec.id,
    slug,
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


/* ────────────────────────────────────────────────────────────────
   ЗАМОВЛЕННЯ та ВІЗИТИ (для кабінету)
   Airtable таблиці:
   - «Замовлення» (Orders): order_no, user_id, customer_name, customer_phone,
                            items, total, address, comment, date
   - «Візити» (Visits): user_id, service, master, date, price

   Статусу/способів доставки/оплати немає — Beauty & Shine виступає посередником,
   реальну відправку робить постачальник. Це просто історія покупок.
─────────────────────────────────────────────────────────────────── */

export type OrderRow = {
  rec_id: string;
  order_no: string;
  user_id: string;
  customer_name: string;
  customer_phone: string;
  items: string;     // "Назва ×2, Друга назва ×1"
  total: number;
  address: string;   // місто + відділення НП (для постачальника)
  comment: string;
  date: string;      // ISO
};

export type VisitRow = {
  rec_id: string;
  user_id: string;
  service: string;
  master: string;
  date: string;
  price: number;
};

async function fetchTable(tableName: string, filterUser?: string) {
  if (!TOKEN || !BASE_ID) {
    console.warn(`${tableName}: env vars не налаштовано`);
    return { records: [] as any[] };
  }
  const baseUrl = `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(tableName)}?pageSize=100`;
  try {
    const res = await fetch(baseUrl, {
      headers: { Authorization: `Bearer ${TOKEN}` },
      cache: "no-store",
    });
    if (!res.ok) {
      console.error(`${tableName} ${res.status}: ${await res.text()}`);
      return { records: [] as any[] };
    }
    return res.json();
  } catch (e) {
    console.error(`${tableName} fetch error:`, e);
    return { records: [] as any[] };
  }
}

export async function getOrdersByUser(userId: string): Promise<OrderRow[]> {
  const data = await fetchTable("Замовлення");
  const all = (data.records as any[]).map((rec: any): OrderRow => {
    const f = rec.fields || {};
    return {
      rec_id: rec.id,
      order_no: f.order_no || "",
      user_id: String(f.user_id || ""),
      customer_name: f.customer_name || "",
      customer_phone: f.customer_phone || "",
      items: f.items || "",
      total: Number(f.total) || 0,
      address: f.address || "",
      comment: f.comment || "",
      date: f.date || rec.createdTime || "",
    };
  });

  // Діагностика: яких user_id маємо vs за яким фільтруємо
  const uniqueUserIds = Array.from(new Set(all.map((o) => o.user_id))).slice(0, 10);
  console.log(`[getOrdersByUser] looking for "${userId}" (type=${typeof userId}, len=${userId.length})`);
  console.log(`[getOrdersByUser] total records=${all.length}, unique user_ids in DB:`, JSON.stringify(uniqueUserIds));

  const filtered = all.filter((o) => o.user_id === userId);
  console.log(`[getOrdersByUser] after filter: ${filtered.length} matches`);

  return filtered.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
}

export async function getVisitsByUser(userId: string): Promise<VisitRow[]> {
  // Таблиця «Записи» — її заповнює Telegram-бот при записі на процедуру.
  // Поля: ChatID (telegram id), Послуга, Деталі, Дата (YYYY-MM-DD), Час, Ціна
  const data = await fetchTable("Записи");
  return (data.records as any[])
    .map((rec: any): VisitRow => {
      const f = rec.fields || {};
      const service = f["Послуга"] || "";
      // Майстра в таблиці нема — виводимо з послуги
      const master =
        service.toLowerCase().includes("манік") ? "Ірина" :
        service ? "Іван" : "";
      const date = f["Дата"] || "";
      const time = f["Час"] || "";
      return {
        rec_id: rec.id,
        user_id: String(f["ChatID"] || "").trim(),
        service: f["Деталі"] && f["Деталі"] !== service ? `${service} · ${f["Деталі"]}` : service,
        master,
        date: time ? `${date}T${time}` : date,
        price: Number(f["Ціна"]) || 0,
      };
    })
    .filter((v: VisitRow) => v.user_id === String(userId).trim())
    .sort((a: VisitRow, b: VisitRow) => (b.date || "").localeCompare(a.date || ""));
}


/* ────────────────────────────────────────────────────────────────
   КОРИСТУВАЧІ
   Airtable таблиця «Користувачі»:
   - tg_user_id (Single line text)  — Telegram ID, primary lookup
   - first_name (Single line text)
   - last_name (Single line text)
   - username (Single line text)
   - phone (Phone number)
   - city (Single line text)
   - bonus (Number)                 — баланс ✦ бонусів
   - created_at (Created time)
   - last_login (Last modified time або вручну при логіні)
─────────────────────────────────────────────────────────────────── */

export type UserRow = {
  rec_id: string;
  tg_user_id: string;
  first_name: string;
  last_name: string;
  username: string;
  phone: string;
  city: string;
  bonus: number;
  picture: string;
};

export async function getUserByTgId(tgUserId: string): Promise<UserRow | null> {
  if (!TOKEN || !BASE_ID) return null;
  try {
    const res = await fetch(
      `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent("Користувачі")}?pageSize=100`,
      { headers: { Authorization: `Bearer ${TOKEN}` }, cache: "no-store" }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const found = (data.records as any[]).find(
      (r) => String(r.fields?.tg_user_id || "") === String(tgUserId)
    );
    if (!found) return null;
    const f = found.fields || {};
    return {
      rec_id: found.id,
      tg_user_id: String(f.tg_user_id || ""),
      first_name: f.first_name || "",
      last_name: f.last_name || "",
      username: f.username || "",
      phone: f.phone || "",
      city: f.city || "",
      bonus: Number(f.bonus) || 0,
      picture: f.picture || "",
    };
  } catch (e) {
    console.error("getUserByTgId error:", e);
    return null;
  }
}

export async function createUser(data: {
  tg_user_id: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  phone?: string;
  picture?: string;
}): Promise<UserRow | null> {
  if (!TOKEN || !BASE_ID) return null;
  try {
    const res = await fetch(
      `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent("Користувачі")}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: {
            tg_user_id: data.tg_user_id,
            first_name: data.first_name || "",
            last_name: data.last_name || "",
            username: data.username || "",
            phone: data.phone || "",
            picture: data.picture || "",
            bonus: 100, // welcome-бонус
          },
        }),
      }
    );
    if (!res.ok) {
      console.error("createUser failed:", res.status, await res.text());
      return null;
    }
    const rec = await res.json();
    const f = rec.fields || {};
    return {
      rec_id: rec.id,
      tg_user_id: String(f.tg_user_id || ""),
      first_name: f.first_name || "",
      last_name: f.last_name || "",
      username: f.username || "",
      phone: f.phone || "",
      city: f.city || "",
      bonus: Number(f.bonus) || 0,
      picture: f.picture || "",
    };
  } catch (e) {
    console.error("createUser error:", e);
    return null;
  }
}

export async function updateUser(recId: string, fields: Partial<{
  first_name: string;
  last_name: string;
  username: string;
  phone: string;
  city: string;
  bonus: number;
  picture: string;
}>): Promise<boolean> {
  if (!TOKEN || !BASE_ID) return false;
  try {
    const res = await fetch(
      `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent("Користувачі")}/${recId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fields }),
      }
    );
    return res.ok;
  } catch (e) {
    console.error("updateUser error:", e);
    return false;
  }
}
