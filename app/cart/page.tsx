import Link from "next/link";

export const metadata = { title: "Кошик — Beauty & Shine" };

export default function CartPage() {
  return (
    <section className="container-page py-12">
      <div className="mb-6">
        <div className="eyebrow">Кошик</div>
        <h1 className="section-heading mt-2">Ваше замовлення</h1>
      </div>
      <div className="bg-white rounded-2xl-soft py-14 px-6 text-center">
        <div className="text-5xl mb-3">🛒</div>
        <h2 className="font-serif text-2xl font-semibold">Кошик поки порожній</h2>
        <p className="text-ink mt-2 max-w-md mx-auto">
          Саме час подивитись каталог і обрати щось для догляду.
        </p>
        <Link href="/catalog" className="btn-primary mt-6">До каталогу</Link>
      </div>
    </section>
  );
}
