import Link from "next/link";
import type { Product } from "@/lib/airtable";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/product/${product.slug}`}
      className="bubble-sm bubble-sm-hover block group"
    >
      {/* Зображення */}
      <div className="aspect-square rounded-bubble overflow-hidden bg-lavender mb-4 relative">
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">📦</div>
        )}
        {/* Лейбл бренду */}
        <span className="absolute top-3 left-3 pill-light text-[10px]">
          {product.brand}
        </span>
        {!product.in_stock && (
          <span className="absolute top-3 right-3 pill-dark text-[10px]">
            Немає в наявності
          </span>
        )}
      </div>

      {/* Інфо */}
      <h3 className="font-extrabold text-[15px] leading-tight line-clamp-2 min-h-[2.5em]">
        {product.name}
      </h3>
      <p className="text-[12.5px] text-ink mt-1.5 leading-snug line-clamp-2">
        {product.short}
      </p>

      {/* Ціна + CTA */}
      <div className="mt-4 flex items-center justify-between">
        <div>
          {product.price_uah ? (
            <span className="font-serif font-semibold text-xl text-navy">
              {product.price_uah} грн
            </span>
          ) : (
            <span className="text-[12px] text-ink">Ціна за запитом</span>
          )}
        </div>
        <span className="w-9 h-9 rounded-full bg-lavender group-hover:bg-primary group-hover:text-white text-navy flex items-center justify-center transition-colors">
          →
        </span>
      </div>
    </Link>
  );
}
