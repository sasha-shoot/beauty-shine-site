import Link from "next/link";

export const metadata = { title: "Оформлення — Beauty & Shine" };

export default function CheckoutPage() {
  return (
    <section className="container-page pt-6 pb-10">
      <div className="bubble rounded-bubble-lg text-center">
        <div className="text-5xl mb-3">⏳</div>
        <span className="pill mb-3">Скоро</span>
        <h1 className="font-serif text-3xl font-semibold mt-3">Оформлення розробляємо</h1>
        <p className="text-ink mt-2 max-w-md mx-auto">
          Цей екран зʼявиться разом із запуском каталогу і прийому замовлень.
        </p>
        <Link href="/" className="btn-primary mt-6">На головну</Link>
      </div>
    </section>
  );
}
