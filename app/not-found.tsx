import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-page py-20 flex flex-col items-center text-center">
      <div className="relative w-44 h-44 mb-8">
        <div className="absolute inset-[10%] bg-gradient-to-br from-primary-light to-primary rounded-[46%_54%_58%_42%/48%_44%_56%_52%] animate-morph" />
        <div className="absolute inset-0 flex items-center justify-center font-serif text-[68px] font-bold text-white z-10">404</div>
        <svg className="absolute top-0 right-2 w-9 animate-twinkle" viewBox="0 0 24 24">
          <path d="M12 0l2.2 9.8L24 12l-9.8 2.2L12 24l-2.2-9.8L0 12l9.8-2.2L12 0Z" fill="#F5DE46" />
        </svg>
        <svg className="absolute bottom-0 left-1 w-6 animate-twinkle" viewBox="0 0 24 24" style={{ animationDelay: "1s" }}>
          <path d="M12 0l2.2 9.8L24 12l-9.8 2.2L12 24l-2.2-9.8L0 12l9.8-2.2L12 0Z" fill="#fff" />
        </svg>
      </div>
      <h1 className="section-heading">Сторінку загубили</h1>
      <p className="text-ink text-[16px] mt-3 max-w-md">
        Можливо, ця сторінка переїхала або її ще не створили. Спробуйте повернутись
        на головну або заглянути в каталог.
      </p>
      <div className="mt-7 flex gap-3 flex-wrap justify-center">
        <Link href="/"        className="btn-primary">На головну</Link>
        <Link href="/catalog" className="btn-ghost">До каталогу</Link>
      </div>
    </section>
  );
}
