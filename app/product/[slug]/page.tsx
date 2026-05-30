import Link from "next/link";

export default function ProductPage({ params }: { params: { slug: string } }) {
  return (
    <section className="container-page py-12">
      <Link href="/catalog" className="text-ink hover:text-primary font-semibold text-sm mb-5 inline-flex items-center gap-1.5">
        ← Назад до каталогу
      </Link>
      <div className="bg-white rounded-2xl-soft py-16 px-6 text-center">
        <div className="text-5xl mb-4">📦</div>
        <h1 className="font-serif text-2xl font-semibold">Товар «{params.slug}»</h1>
        <p className="text-ink mt-2 max-w-md mx-auto">
          Каталог ще наповнюємо. Скоро тут будуть фото, опис, склад, спосіб
          застосування та кнопка «В кошик».
        </p>
        <Link href="/contacts" className="btn-primary mt-6">Запитати про товар</Link>
      </div>
    </section>
  );
}
