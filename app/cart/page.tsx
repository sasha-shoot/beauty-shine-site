"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";

export default function CartPage() {
  const { items, totalCount, totalPrice, updateQuantity, removeItem, clear, isHydrated } = useCart();

  // Поки не загрузилось з localStorage — показуємо skeleton-стан
  if (!isHydrated) {
    return (
      <section className="container-page pt-6 pb-10">
        <div className="bubble rounded-bubble-lg">
          <span className="pill">Кошик</span>
          <h1 className="section-heading mt-3">Завантаження…</h1>
        </div>
      </section>
    );
  }

  // ── Порожній кошик ──
  if (items.length === 0) {
    return (
      <section className="container-page pt-6 pb-10">
        <div className="bubble rounded-bubble-lg">
          <div className="mb-6">
            <span className="pill">Кошик</span>
            <h1 className="section-heading mt-3">Ваше замовлення</h1>
          </div>
          <div className="bg-lavender rounded-bubble py-14 px-6 text-center">
            <div className="text-5xl mb-3">🛒</div>
            <h2 className="font-serif text-2xl font-semibold">Кошик порожній</h2>
            <p className="text-ink mt-2 max-w-md mx-auto">
              Саме час подивитись каталог і обрати щось для догляду.
            </p>
            <Link href="/catalog" className="btn-primary mt-6">До каталогу</Link>
          </div>
        </div>
      </section>
    );
  }

  // ── Кошик з товарами ──
  return (
    <div className="space-y-4 sm:space-y-6 pt-6 pb-10">
      <section className="container-page">
        <div className="bubble rounded-bubble-lg">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
            <div>
              <span className="pill">Кошик</span>
              <h1 className="section-heading mt-3">Ваше замовлення</h1>
              <p className="text-ink mt-1 text-[14px]">
                {totalCount} {totalCount === 1 ? "товар" : totalCount < 5 ? "товари" : "товарів"}
              </p>
            </div>
            <button
              onClick={clear}
              className="text-[13px] text-ink hover:text-primary font-semibold transition-colors"
            >
              ✕ Очистити кошик
            </button>
          </div>

          {/* Список товарів */}
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.slug}
                className="bg-lavender rounded-bubble p-4 flex gap-4 items-center"
              >
                {/* Фото */}
                <Link
                  href={`/product/${item.slug}`}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white overflow-hidden shrink-0"
                >
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
                  )}
                </Link>

                {/* Назва й бренд */}
                <div className="flex-1 min-w-0">
                  <Link href={`/product/${item.slug}`} className="block group">
                    <span className="pill text-[10px] mb-1">{item.brand}</span>
                    <h3 className="font-extrabold text-[14.5px] leading-tight mt-1.5 group-hover:text-primary transition-colors line-clamp-2">
                      {item.name}
                    </h3>
                  </Link>
                  <div className="mt-1 text-[12px] text-ink">{item.variants_display}</div>
                </div>

                {/* Кількість + ціна (на мобільному внизу, на десктопі поряд) */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <div className="flex items-center gap-1 bg-white rounded-full p-1">
                    <button
                      onClick={() => updateQuantity(item.slug, item.quantity - 1)}
                      className="w-7 h-7 rounded-full bg-lavender text-navy hover:bg-lavender-deep transition-colors text-sm font-bold"
                      aria-label="Менше"
                    >
                      −
                    </button>
                    <span className="px-2 font-bold text-[14px] min-w-[24px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.slug, item.quantity + 1)}
                      className="w-7 h-7 rounded-full bg-lavender text-navy hover:bg-lavender-deep transition-colors text-sm font-bold"
                      aria-label="Більше"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-right">
                    <div className="font-serif font-semibold text-base text-navy whitespace-nowrap">
                      {item.price_uah * item.quantity} грн
                    </div>
                    {item.quantity > 1 && (
                      <div className="text-[11px] text-ink">{item.price_uah} грн × {item.quantity}</div>
                    )}
                  </div>
                  <button
                    onClick={() => removeItem(item.slug)}
                    className="text-[11px] text-ink hover:text-primary font-semibold transition-colors"
                  >
                    Видалити
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Підсумок */}
      <section className="container-page">
        <div className="bubble rounded-bubble-lg">
          <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
            <span className="text-[15px] text-ink">До сплати:</span>
            <span className="font-serif font-semibold text-3xl text-navy">{totalPrice} грн</span>
          </div>
          <div className="text-[12.5px] text-ink mb-5">
            Доставка розраховується на наступному кроці залежно від обраного методу
          </div>
          <div className="flex gap-3 flex-wrap">
            <Link href="/checkout" className="btn-primary flex-1 sm:flex-initial">
              Оформити замовлення →
            </Link>
            <Link href="/catalog" className="btn-ghost">Продовжити покупки</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
