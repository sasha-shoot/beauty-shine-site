"use client";

import { useRef, useState, useEffect } from "react";
import { ImageSlot } from "./ImageSlot";

type Props = {
  title: string;
  beforeSrc?: string;
  afterSrc?: string;
};

export function BeforeAfterCompare({ title, beforeSrc, afterSrc }: Props) {
  const compareRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50); // у відсотках 0–100
  const [dragging, setDragging] = useState(false);

  // Оновлюємо CSS-змінну --pos на елементі при зміні
  useEffect(() => {
    if (compareRef.current) {
      compareRef.current.style.setProperty("--pos", `${pos}%`);
    }
  }, [pos]);

  function updateFromClientX(clientX: number) {
    const el = compareRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = clientX - rect.left;
    const next = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setPos(next);
  }

  function handlePointerDown(e: React.PointerEvent) {
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setDragging(true);
    updateFromClientX(e.clientX);
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!dragging) return;
    updateFromClientX(e.clientX);
  }

  function handlePointerUp(e: React.PointerEvent) {
    setDragging(false);
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowLeft")  { e.preventDefault(); setPos((p) => Math.max(0, p - 5)); }
    if (e.key === "ArrowRight") { e.preventDefault(); setPos((p) => Math.min(100, p + 5)); }
    if (e.key === "Home")       { e.preventDefault(); setPos(0); }
    if (e.key === "End")        { e.preventDefault(); setPos(100); }
  }

  return (
    <div className="ba-card">
      <div
        ref={compareRef}
        className={`ba-compare ${dragging ? "dragging" : ""}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <ImageSlot className="ba-layer ba-after"  shape="rect" placeholder="Фото «Після»" src={afterSrc} alt={`Після — ${title}`} />
        <ImageSlot className="ba-layer ba-before" shape="rect" placeholder="Фото «До»"    src={beforeSrc} alt={`До — ${title}`} />
        <span className="ba-tag l">До</span>
        <span className="ba-tag r">Після</span>
        <span
          className="ba-divider"
          role="slider"
          tabIndex={0}
          aria-label={`Порівняти до і після — ${title}`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pos)}
          onKeyDown={handleKeyDown}
        >
          <span className="ba-handle">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 5 12 9 18"/><polyline points="15 6 19 12 15 18"/></svg>
          </span>
        </span>
      </div>
      <div className="ba-foot">
        <span className="ba-title">{title}</span>
        <span className="ba-link">Детальніше <svg className="arr" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span>
      </div>
    </div>
  );
}
