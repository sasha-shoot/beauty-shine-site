import Link from "next/link";

export default function ProductPage({ params }: { params: { slug: string } }) {
  return (
    <section className="container-page pt-6 pb-10">
      <Link href="/catalog" className="inline-flex items-center gap-2 text-ink hover:text-primary font-semibold text-sm mb-4 px-4 py-2 bg-white rounded-full shadow-pill transition-colors">
        ← До каталогу
      </Link>
      <div className="bubble rounded-bubble-lg text-center">
        <div className="text-5xl mb-3">📦</div>
        <span className="pill mb-3">{params.slug}</span>
        <h1 className="font-serif text-3xl font-semibold mt-3">Картка товару</h1>
        <p className="text-ink mt-2 max-w-md mx-auto">
          Каталог ще наповнюємо. Скоро тут будуть фото, опис, склад, спосіб
          застосування та кнопка «В кошик».
        </p>
        <Link href="/contacts" className="btn-primary mt-6">Запитати про товар</Link>
      </div>
    </section>
  );
}
