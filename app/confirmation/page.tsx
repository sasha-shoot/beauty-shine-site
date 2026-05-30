import Link from "next/link";

export const metadata = { title: "Beauty & Shine" };

export default function Page() {
  return (
    <section className="container-page py-12">
      <div className="bg-white rounded-2xl-soft py-14 px-6 text-center">
        <div className="text-5xl mb-3">⏳</div>
        <h1 className="font-serif text-2xl font-semibold">Скоро будемо тут</h1>
        <p className="text-ink mt-2 max-w-md mx-auto">
          Ця сторінка зʼявиться разом із запуском каталогу і прийому замовлень.
        </p>
        <Link href="/" className="btn-primary mt-6">На головну</Link>
      </div>
    </section>
  );
}
