import Link from "next/link";

export const metadata = { title: "Дякуємо — Beauty & Shine" };

export default function ConfirmationPage() {
  return (
    <section className="container-page pt-6 pb-10">
      <div className="bubble rounded-bubble-lg text-center">
        <div className="w-20 h-20 rounded-full bg-primary text-white text-3xl mx-auto mb-5 flex items-center justify-center">✓</div>
        <span className="pill-accent mb-3">Замовлення прийнято</span>
        <h1 className="section-heading mt-3">Дякуємо за довіру!</h1>
        <p className="text-ink mt-3 max-w-md mx-auto">
          Майстер звʼяжеться з вами найближчим часом для уточнення деталей.
        </p>
        <Link href="/" className="btn-primary mt-6">На головну</Link>
      </div>
    </section>
  );
}
