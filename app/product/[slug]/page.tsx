import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, getAllProducts } from "@/lib/airtable";
import { ImageSlot } from "@/components/ImageSlot";
import { AddToCartButton } from "@/components/AddToCartButton";
import { ProductCard } from "@/components/ProductCard";

export const revalidate = 60;

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
  return { title: `${product.name} — Beauty & Shine`, description: product.short };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const all = await getAllProducts();
  const related = all
    .filter((p) => p.slug !== product.slug && p.category === product.category && p.in_stock)
    .slice(0, 4);

  return (
    <section className="screen active" data-screen="product">
      <div className="container prod">
        <Link href="/catalog" className="back-btn">
          <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          Назад
        </Link>

        <div className="prod-view">
          <div className="prod-media">
            <ImageSlot
              shape="rounded"
              radius={28}
              placeholder={product.name}
              src={product.image}
              alt={product.name}
            />
          </div>

          <div className="prod-info">
            <div className="prod-brand">{product.brand}</div>
            <h1 className="prod-title">{product.name}</h1>

            <div className="prod-meta">
              <span className="stars">★★★★★</span>
              <span className="reviews">(0 відгуків)</span>
            </div>

            <p className="prod-lead">{product.short}</p>

            {product.variants_display && (
              <div className="prod-variants">
                <div className="eyebrow" style={{marginBottom: 6}}>Варіанти</div>
                <div>{product.variants_display}</div>
              </div>
            )}

            <div className="prod-price-row">
              <span className="prod-price num">
                {product.price_uah ? `${product.price_uah} грн` : "Ціна за запитом"}
              </span>
            </div>

            <div className="prod-cta">
              <AddToCartButton
                product={{
                  slug: product.slug,
                  name: product.name,
                  brand: product.brand,
                  image: product.image,
                  price_uah: product.price_uah || 0,
                  variants_display: product.variants_display,
                }}
                disabled={!product.in_stock}
              />
            </div>

            {!product.in_stock && (
              <p style={{marginTop:12, color:"var(--purple-deep)", fontSize:13.5, fontWeight:600}}>
                ⚠ Зараз немає в наявності — напишіть нам, повідомимо при поповненні
              </p>
            )}
          </div>
        </div>

        {/* Опис + застосування */}
        <div className="prod-tabs">
          <div className="prod-tab">
            <div className="eyebrow">Опис</div>
            <h3 className="block-title">Про засіб</h3>
            <p style={{whiteSpace:"pre-line", color:"var(--ink-2)", lineHeight:1.7, marginTop:12}}>{product.long}</p>
          </div>
          <div className="prod-tab">
            <div className="eyebrow">Застосування</div>
            <h3 className="block-title">Як використовувати</h3>
            <p style={{whiteSpace:"pre-line", color:"var(--ink-2)", lineHeight:1.7, marginTop:12}}>{product.usage}</p>
          </div>
        </div>

        {product.inci && !product.inci.startsWith("TODO") && !product.inci.startsWith("Не застосовується") && (
          <div className="prod-tab" style={{marginTop:16}}>
            <div className="eyebrow">Склад</div>
            <h3 className="block-title">Активні компоненти (INCI)</h3>
            <p style={{fontFamily:"monospace", fontSize:12.5, color:"var(--ink-3)", lineHeight:1.7, marginTop:12}}>{product.inci}</p>
          </div>
        )}

        {related.length > 0 && (
          <section className="section" style={{marginTop:40}}>
            <div className="head-row">
              <div><div className="eyebrow">Схожі</div><h2 className="block-title">З цієї ж категорії</h2></div>
              <Link className="link" href={`/catalog?cat=${encodeURIComponent(product.category)}`}>
                Усі в категорії <svg className="arr" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </Link>
            </div>
            <div className="grid">
              {related.map((p) => <ProductCard key={p.rec_id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </section>
  );
}
