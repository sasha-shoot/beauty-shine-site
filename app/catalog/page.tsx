import Link from "next/link";
import { getAllProducts, getCategories } from "@/lib/airtable";
import { ProductCard } from "@/components/ProductCard";

export const metadata = { title: "Каталог — Beauty & Shine" };
// Кожні 60 секунд сторінка регенерується (ISR)
export const revalidate = 60;

export default async function CatalogPage({
  searchParams,
}: {
  searchParams?: { cat?: string; brand?: string };
}) {
  const [allProducts, categories] = await Promise.all([
    getAllProducts(),
    getCategories(),
  ]);

  // Фільтрація
  const inStock = allProducts.filter((p) => p.in_stock);
  const filtered = inStock.filter((p) => {
    if (searchParams?.cat && p.category !== searchParams.cat) return false;
    if (searchParams?.brand && p.brand !== searchParams.brand) return false;
    return true;
  });

  const activeCat = searchParams?.cat;
  const activeBrand = searchParams?.brand;

  // ── Порожній стан (немає товарів узагалі) ──
  if (inStock.length === 0) {
    return (
      <section className="container-page pt-6 pb-10">
        <div className="bubble rounded-bubble-lg">
          <div className="mb-8">
            <span className="pill">Каталог</span>
            <h1 className="section-heading mt-3">Усі товари</h1>
          </div>
          <div className="bg-lavender rounded-bubble py-14 px-6 text-center">
            <div className="text-5xl mb-3">🛍</div>
            <h2 className="font-serif text-2xl font-semibold">Каталог наповнюємо</h2>
            <p className="text-ink mt-2 max-w-md mx-auto">
              Готуємо фотографії та описи від брендів divapharm і Veratin.
            </p>
            <Link href="/contacts" className="btn-primary mt-6">Написати нам</Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 pt-6 pb-10">
      {/* Хедер каталогу */}
      <section className="container-page">
        <div className="bubble rounded-bubble-lg">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <div>
              <span className="pill">Каталог</span>
              <h1 className="section-heading mt-3">
                {activeCat || "Усі товари"}
              </h1>
              <p className="text-ink mt-2 text-[14.5px]">
                {filtered.length} з {inStock.length} товарів
              </p>
            </div>
          </div>

          {/* Фільтр-pills: категорії */}
          <div className="flex flex-wrap gap-2 mb-3">
            <Link
              href="/catalog"
              className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-colors ${
                !activeCat ? "bg-navy text-white" : "bg-lavender text-navy hover:bg-lavender-deep"
              }`}
            >
              Усі ({inStock.length})
            </Link>
            {categories.map((c) => (
              <Link
                key={c.name}
                href={`/catalog?cat=${encodeURIComponent(c.name)}`}
                className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-colors ${
                  activeCat === c.name ? "bg-navy text-white" : "bg-lavender text-navy hover:bg-lavender-deep"
                }`}
              >
                {c.name} ({c.count})
              </Link>
            ))}
          </div>

          {/* Фільтр-pills: бренди */}
          <div className="flex flex-wrap gap-2">
            <span className="text-[12px] text-ink font-semibold self-center mr-1">Бренд:</span>
            {["Veratin", "DivaPharm"].map((b) => (
              <Link
                key={b}
                href={`/catalog?${activeCat ? `cat=${encodeURIComponent(activeCat)}&` : ""}brand=${b}`}
                className={`px-3.5 py-1.5 rounded-full text-[12px] font-bold transition-colors ${
                  activeBrand === b ? "bg-primary text-white" : "bg-white border border-navy/10 text-navy hover:bg-lavender"
                }`}
              >
                {b}
              </Link>
            ))}
            {activeBrand && (
              <Link
                href={`/catalog${activeCat ? `?cat=${encodeURIComponent(activeCat)}` : ""}`}
                className="px-3.5 py-1.5 rounded-full text-[12px] font-bold bg-white border border-navy/10 text-ink hover:text-navy"
              >
                ✕ скинути
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Грід товарів */}
      <section className="container-page">
        {filtered.length === 0 ? (
          <div className="bubble rounded-bubble-lg text-center">
            <p className="text-ink">Немає товарів за обраними фільтрами</p>
            <Link href="/catalog" className="btn-light mt-4">Скинути фільтри</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {filtered.map((p) => (
              <ProductCard key={p.rec_id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
