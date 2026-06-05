import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, getAllProducts } from "@/lib/airtable";
import { ProductCard } from "@/components/ProductCard";

export const revalidate = 60;

// Генеруємо список slug'ів для SSG
export async function generateStaticParams() {
  try {
    const products = await getAllProducts();
    return products.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  if (!product) return { title: "Товар не знайдено" };
  return {
    title: `${product.name} — Beauty & Shine`,
    description: product.short,
  };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  // Схожі товари — з тієї ж категорії
  const all = await getAllProducts();
  const related = all
    .filter((p) => p.slug !== product.slug && p.category === product.category && p.in_stock)
    .slice(0, 4);

  return (
    <div className="space-y-4 sm:space-y-6 pt-6 pb-10">
      {/* Хлібні крихти */}
      <div className="container-page">
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 text-ink hover:text-primary font-semibold text-sm px-4 py-2 bg-white rounded-full shadow-pill transition-colors"
        >
          ← До каталогу
        </Link>
      </div>

      {/* Основна картка товару */}
      <section className="container-page">
        <div className="bubble rounded-bubble-lg">
          <div className="grid lg:grid-cols-[1.05fr,0.95fr] gap-8 lg:gap-12">
            {/* Зображення */}
            <div className="bg-lavender rounded-bubble overflow-hidden aspect-square flex items-center justify-center relative">
              {product.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-6xl">📦</div>
              )}
              <span className="absolute top-4 left-4 pill-light">{product.brand}</span>
            </div>

            {/* Інфо */}
            <div>
              <span className="pill mb-3">{product.category}</span>
              <h1 className="font-serif font-semibold text-[clamp(24px,3vw,36px)] leading-tight tracking-tight mt-3">
                {product.name}
              </h1>
              <p className="text-ink mt-4 text-[15.5px] leading-relaxed">
                {product.short}
              </p>

              {/* Ціна */}
              <div className="mt-6 flex items-baseline gap-3">
                {product.price_uah ? (
                  <span className="font-serif font-semibold text-4xl text-navy">
                    {product.price_uah} грн
                  </span>
                ) : (
                  <span className="text-ink text-lg">Ціна за запитом</span>
                )}
              </div>

              {/* Варіанти (поки що текстом) */}
              {product.variants_display && (
                <div className="mt-4 bg-lavender rounded-2xl p-3">
                  <div className="text-[11px] font-bold tracking-wide text-ink uppercase mb-1">Варіанти</div>
                  <div className="text-[13px]">{product.variants_display}</div>
                </div>
              )}

              {/* CTA */}
              <div className="mt-6 flex gap-3 flex-wrap">
                <button
                  className="btn-primary"
                  disabled={!product.in_stock}
                  // TODO: підключити до кошика (Етап 3)
                >
                  🛒 В кошик
                </button>
                <Link href="/contacts" className="btn-ghost">
                  Запитати про товар
                </Link>
              </div>

              {!product.in_stock && (
                <p className="mt-3 text-[13px] text-primary font-semibold">
                  ⚠️ Зараз немає в наявності — напишіть нам, повідомимо при поповненні
                </p>
              )}

              {/* Теги */}
              {product.tags.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {product.tags.map((t) => (
                    <span key={t} className="pill text-[11px]">{t}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Опис, склад, спосіб застосування */}
      <section className="container-page grid sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="bubble-sm">
          <span className="pill mb-3">Опис</span>
          <h3 className="font-serif text-xl font-semibold mt-2 mb-3">Про засіб</h3>
          <p className="text-[14.5px] text-ink leading-relaxed whitespace-pre-line">
            {product.long}
          </p>
        </div>
        <div className="bubble-sm">
          <span className="pill mb-3">Застосування</span>
          <h3 className="font-serif text-xl font-semibold mt-2 mb-3">Як використовувати</h3>
          <p className="text-[14.5px] text-ink leading-relaxed whitespace-pre-line">
            {product.usage}
          </p>
        </div>
      </section>

      {/* Склад INCI (якщо є) */}
      {product.inci && !product.inci.startsWith("TODO") && !product.inci.startsWith("Не застосовується") && (
        <section className="container-page">
          <div className="bubble-sm">
            <span className="pill mb-3">Склад</span>
            <h3 className="font-serif text-xl font-semibold mt-2 mb-3">Активні компоненти (INCI)</h3>
            <p className="text-[12.5px] text-ink leading-relaxed font-mono">
              {product.inci}
            </p>
          </div>
        </section>
      )}

      {/* Схожі товари */}
      {related.length > 0 && (
        <section className="container-page">
          <div className="bubble rounded-bubble-lg">
            <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
              <div>
                <span className="pill">Схожі</span>
                <h3 className="section-heading mt-2 text-[clamp(24px,3vw,32px)]">З цієї ж категорії</h3>
              </div>
              <Link href={`/catalog?cat=${encodeURIComponent(product.category)}`} className="btn-light">
                Усі в категорії →
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {related.map((p) => <ProductCard key={p.rec_id} product={p} />)}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
