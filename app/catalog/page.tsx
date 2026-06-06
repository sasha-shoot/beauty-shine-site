import Link from "next/link";
import { getAllProducts, getCategories } from "@/lib/airtable";
import { ProductCard } from "@/components/ProductCard";

export const metadata = { title: "Каталог — Beauty & Shine" };
export const revalidate = 60;

export default async function CatalogPage({
  searchParams,
}: {
  searchParams?: { cat?: string; q?: string };
}) {
  const [allProducts, categories] = await Promise.all([
    getAllProducts(),
    getCategories(),
  ]);

  const inStock = allProducts.filter((p) => p.in_stock);
  const q = (searchParams?.q || "").toLowerCase().trim();
  const filtered = inStock.filter((p) => {
    if (searchParams?.cat && p.category !== searchParams.cat) return false;
    if (q && !(p.name.toLowerCase().includes(q) || p.short.toLowerCase().includes(q))) return false;
    return true;
  });

  const activeCat = searchParams?.cat;

  return (
    <section className="screen active" data-screen="catalog">
      <div className="container">
        <div className="catalog-head reveal">
          <h1>Каталог <em>засобів</em></h1>
          <p>Догляд за руками й ногами від divapharm та Veratin. Все, чим ми користуємось у студії.</p>

          <div className="tools">
            <form className="search">
              <svg viewBox="0 0 24 24" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><line x1="20" y1="20" x2="16.5" y2="16.5"/></svg>
              <input
                name="q"
                type="text"
                placeholder="Знайти товар…"
                defaultValue={q}
              />
              {activeCat && <input type="hidden" name="cat" value={activeCat} />}
            </form>
            <div className="chips">
              <Link
                href="/catalog"
                className={`chip ${!activeCat ? "active" : ""}`}
              >
                Усі
              </Link>
              {categories.slice(0, 6).map((c) => (
                <Link
                  key={c.name}
                  href={`/catalog?cat=${encodeURIComponent(c.name)}`}
                  className={`chip ${activeCat === c.name ? "active" : ""}`}
                >
                  {c.name}
                </Link>
              ))}
            </div>
            <select className="sort" defaultValue="popular">
              <option value="popular">За популярністю</option>
              <option value="price-asc">Ціна ↑</option>
              <option value="price-desc">Ціна ↓</option>
              <option value="name">За назвою</option>
            </select>
          </div>

          <div className="count-info">
            {filtered.length === 0
              ? "Нічого не знайдено"
              : `${filtered.length} ${filtered.length === 1 ? "товар" : filtered.length < 5 ? "товари" : "товарів"} у наявності`}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="empty">
            <div className="empty-emoji">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><line x1="20" y1="20" x2="16.5" y2="16.5"/></svg>
            </div>
            <h3>Нічого не знайшлось</h3>
            <p>Спробуйте іншу назву або скиньте фільтри — можливо, шуканий товар у іншій категорії.</p>
            <Link href="/catalog" className="btn btn-ghost">Скинути фільтри</Link>
          </div>
        ) : (
          <div className="grid">
            {filtered.map((p) => <ProductCard key={p.rec_id} product={p} />)}
          </div>
        )}
      </div>
    </section>
  );
}
