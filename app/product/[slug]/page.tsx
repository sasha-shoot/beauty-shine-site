import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, getAllProducts } from "@/lib/airtable";
import { ImageSlot } from "@/components/ImageSlot";
import { ProductCard } from "@/components/ProductCard";
import { ProductReviews } from "@/components/ProductReviews";
import { ProductDetailClient } from "@/components/ProductDetailClient";

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
  const similar = all
    .filter((p) => p.slug !== product.slug && p.category === product.category && p.in_stock)
    .slice(0, 4);

  return (
    <section className="screen active" data-screen="product">
      <div className="container">
        <Link href="/catalog" className="back-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          Назад
        </Link>

        <ProductDetailClient product={product} />

        {similar.length > 0 && (
          <section className="section">
            <div className="section-head">
              <div>
                <div className="eyebrow" style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: ".14em", color: "var(--purple-deep)", fontWeight: 700 }}>Схожі товари</div>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: "clamp(28px, 3.6vw, 40px)", color: "var(--ink)" }}>Можливо, сподобається</h2>
              </div>
            </div>
            <div className="grid">
              {similar.map((p) => <ProductCard key={p.rec_id} product={p} />)}
            </div>
          </section>
        )}

        <ProductReviews productId={product.rec_id} productName={product.name} />
      </div>
    </section>
  );
}
