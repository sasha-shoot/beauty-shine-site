import Link from "next/link";

export const metadata = {
  title: "Каталог — Beauty & Shine",
};

export default function CatalogPage() {
  return (
    <section className="container-page py-12">
      <div className="mb-8">
        <div className="eyebrow">Каталог</div>
        <h1 className="section-heading mt-2">Усі товари</h1>
      </div>

      <div className="bg-white rounded-2xl-soft py-16 px-6 text-center">
        <div className="text-5xl mb-4">🛍</div>
        <h2 className="font-serif text-2xl font-semibold">Каталог наповнюємо</h2>
        <p className="text-ink mt-2 max-w-md mx-auto">
          Готуємо описи й фотографії товарів від брендів divapharm та Veratin.
          Поки що — пишіть нам напряму, ми оформимо замовлення вручну.
        </p>
        <div className="mt-6 flex gap-3 flex-wrap justify-center">
          <Link href="/contacts" className="btn-primary">Написати нам</Link>
          <Link href="/"         className="btn-ghost">На головну</Link>
        </div>
      </div>
    </section>
  );
}
