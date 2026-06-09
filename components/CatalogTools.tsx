"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

type Props = {
  categories: string[];
  activeCat: string;
  defaultQuery: string;
  defaultSort: string;
};

export function CatalogTools({ categories, activeCat, defaultQuery, defaultSort }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [query, setQuery] = useState(defaultQuery);

  // Debounce search — оновлюємо URL через 400ms тиші
  useEffect(() => {
    if (query === defaultQuery) return;
    const t = setTimeout(() => {
      const params = new URLSearchParams(sp?.toString());
      if (query) params.set("q", query); else params.delete("q");
      router.push(`${pathname}?${params.toString()}`);
    }, 400);
    return () => clearTimeout(t);
  }, [query]); // eslint-disable-line

  function setParam(key: string, value: string | null) {
    const params = new URLSearchParams(sp?.toString());
    if (value === null || value === "") params.delete(key);
    else params.set(key, value);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="tools" style={{ borderRadius: 40 }}>
      <div className="search">
        <svg viewBox="0 0 24 24" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><line x1="20" y1="20" x2="16.5" y2="16.5"/></svg>
        <input
          type="text"
          placeholder="Знайти товар…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="chips">
        <button className={`chip ${activeCat === "all" ? "active" : ""}`} onClick={() => setParam("cat", null)}>
          Усі
        </button>
        {categories.slice(0, 6).map((c) => (
          <button
            key={c}
            className={`chip ${activeCat === c ? "active" : ""}`}
            onClick={() => setParam("cat", c)}
          >
            {c}
          </button>
        ))}
      </div>
      <select
        className="sort"
        defaultValue={defaultSort}
        onChange={(e) => setParam("sort", e.target.value === "popular" ? null : e.target.value)}
      >
        <option value="popular">За популярністю</option>
        <option value="price-asc">Ціна ↑</option>
        <option value="price-desc">Ціна ↓</option>
        <option value="name">За назвою</option>
      </select>
    </div>
  );
}
