import Link from "next/link";
import { getAllProducts, getCategories } from "@/lib/airtable";
import { ProductCard } from "@/components/ProductCard";
import { CatalogTools } from "@/components/CatalogTools";

export const metadata = { title: "Каталог — Beauty & Shine" };
export const revalidate = 60;

export default async function CatalogPage({
  searchParams,
}: {
  searchParams?: { cat?: string; q?: string; sort?: string };
}) {
  const [allProducts, categories] = await Promise.all([
    getAllProducts(),
    getCategories(),
  ]);

  const inStock = allProducts.filter((p) => p.in_stock);
  const q = (searchParams?.q || "").toLowerCase().trim();
  const sort = searchParams?.sort || "popular";

  let filtered = inStock.filter((p) => {
    if (searchParams?.cat && searchParams.cat !== "all" && p.category !== searchParams.cat) return false;
    if (q && !(p.name.toLowerCase().includes(q) || p.short.toLowerCase().includes(q))) return false;
    return true;
  });

  // Сортування
  if (sort === "price-asc") filtered = [...filtered].sort((a, b) => (a.price_uah || 0) - (b.price_uah || 0));
  else if (sort === "price-desc") filtered = [...filtered].sort((a, b) => (b.price_uah || 0) - (a.price_uah || 0));
  else if (sort === "name") filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name, "uk"));

  const activeCat = searchParams?.cat || "all";

  return (
    <section className="screen active" data-screen="catalog">
      <div className="container">
        <div className="catalog-head reveal">
          <h1>Каталог <em>засобів</em></h1>
          <p>Догляд за руками й ногами від divapharm та Veratin. Все, чим ми користуємось у студії.</p>

          <CatalogTools
            categories={categories.map((c) => c.name)}
            activeCat={activeCat}
            defaultQuery={q}
            defaultSort={sort}
          />

          <div className="count-info" style={{ textAlign: "center", padding: "28px 4px 12px" }}>
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
