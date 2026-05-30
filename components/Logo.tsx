import Link from "next/link";

export function Sparkle({ className = "w-5 h-5", fill = "#9D66D6" }: { className?: string; fill?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path
        d="M12 0l2.2 9.8L24 12l-9.8 2.2L12 24l-2.2-9.8L0 12l9.8-2.2L12 0Z"
        fill={fill}
      />
    </svg>
  );
}

export function Logo({ size = "md" }: { size?: "sm" | "md" }) {
  const sizes = {
    sm: "text-lg",
    md: "text-[21px]",
  };
  return (
    <Link href="/" className="flex items-center gap-2.5 font-serif font-semibold">
      <Sparkle className="w-5 h-5 flex-shrink-0" />
      <span className={sizes[size]}>
        beauty <span className="italic text-primary">&amp;</span> shine
      </span>
    </Link>
  );
}
