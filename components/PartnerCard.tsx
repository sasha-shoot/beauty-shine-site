"use client";

import { useState } from "react";

export type Certificate = { name: string; file?: string };

type Props = {
  name: string;
  logoSrc: string;
  description: string;
  certificates: Certificate[];
};

export function PartnerCard({ name, logoSrc, description, certificates }: Props) {
  // open — для кліку (мобільний/тач). На десктопі розкриває hover (CSS).
  const [open, setOpen] = useState(false);

  return (
    <div className={`partner-block ${open ? "open" : ""}`}>
      <div
        className="partner-card"
        role="button"
        tabIndex={0}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen((v) => !v);
          }
        }}
      >
        <span className="partner-logo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} alt={name} />
        </span>
        <div className="partner-tx">
          <h4>{name}</h4>
          <p className="partner-desc">{description}</p>
          <span className="partner-tag">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            Офіційний партнер
          </span>
        </div>
        <span className="partner-toggle" aria-hidden="true">
          <svg className="pt-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
          <svg className="pt-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" /></svg>
        </span>
      </div>
      <div className="partner-detail">
        <div className="partner-detail-inner">
          <h5>Сертифікати та документи</h5>
          {certificates.length > 0 ? (
            <ul className="partner-certs">
              {certificates.map((c, i) => {
                const inner = (
                  <>
                    <svg className="cert-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="9" y1="13" x2="15" y2="13" /><line x1="9" y1="17" x2="13" y2="17" /></svg>
                    <span>{c.name}</span>
                  </>
                );
                return (
                  <li key={i}>
                    {c.file ? (
                      <a className="partner-cert" href={c.file} target="_blank" rel="noreferrer">
                        {inner}
                      </a>
                    ) : (
                      <span className="partner-cert">{inner}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="partner-empty">Сертифікати додаються найближчим часом.</p>
          )}
        </div>
      </div>
    </div>
  );
}
