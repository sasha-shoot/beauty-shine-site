import Link from "next/link";
import { Sparkle } from "@/components/Logo";

export default function NotFound() {
  return (
    <section className="container-page pt-8 pb-12">
      <div className="bubble rounded-bubble-xl text-center relative overflow-hidden">
        <Sparkle className="absolute top-10 right-14 w-10 opacity-25 animate-twinkle" fill="#F5DE46" />
        <Sparkle className="absolute bottom-12 left-12 w-6 opacity-30 animate-twinkle [animation-delay:1s]" fill="#9D66D6" />

        <div className="relative w-52 h-52 mx-auto mb-7">
          <div className="absolute inset-[10%] bg-gradient-to-br from-primary-light to-primary rounded-[46%_54%_58%_42%/48%_44%_56%_52%] animate-morph" />
          <div className="absolute inset-0 flex items-center justify-center font-serif text-[78px] font-bold text-white z-10">404</div>
          <Sparkle className="absolute top-0 right-3 w-10 animate-twinkle z-20" fill="#F5DE46" />
          <Sparkle className="absolute bottom-1 left-2 w-7 animate-twinkle [animation-delay:1.2s] z-20" fill="#fff" />
        </div>

        <span className="pill mb-4">404 · сторінку загубили</span>
        <h1 className="section-heading mt-2">Тут поки що порожньо</h1>
        <p className="text-ink text-[15.5px] mt-3 max-w-md mx-auto">
          Можливо, ця сторінка переїхала або її ще не створили. Спробуйте
          повернутись на головну.
        </p>
        <div className="mt-7 flex gap-3 flex-wrap justify-center">
          <Link href="/"        className="btn-primary">На головну</Link>
          <Link href="/catalog" className="btn-ghost">До каталогу</Link>
        </div>
      </div>
    </section>
  );
}
