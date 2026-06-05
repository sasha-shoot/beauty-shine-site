import Link from "next/link";

export const metadata = { title: "Кошик — Beauty & Shine" };

export default function CartPage() {
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
