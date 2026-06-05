import Link from "next/link";

export const metadata = { title: "Каталог — Beauty & Shine" };

export default function CatalogPage() {
  return (
    <section className="container-page pt-6 pb-10">
      <div className="bubble rounded-bubble-lg">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
          <div>
            <span className="pill">Каталог</span>
            <h1 className="section-heading mt-3">Усі товари</h1>
          </div>
        </div>

        <div className="bg-lavender rounded-bubble py-14 px-6 text-center">
          <div className="text-5xl mb-3">🛍</div>
          <h2 className="font-serif text-2xl font-semibold">Скоро наповнимо</h2>
          <p className="text-ink mt-2 max-w-md mx-auto">
            Готуємо фотографії та описи від брендів divapharm і Veratin.
            Поки що — пишіть напряму, оформимо вручну.
          </p>
          <div className="mt-6 flex gap-3 flex-wrap justify-center">
            <Link href="/contacts" className="btn-primary">Написати нам</Link>
            <Link href="/"         className="btn-ghost">На головну</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
