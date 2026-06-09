"use client";

import { useState } from "react";
import { ImageSlot } from "./ImageSlot";

type Props = {
  name: string;
  role: string;
  experience: string;
  photoSrc?: string;
  education: string[];
  certificates: string[];
  diplomas: string[];
};

export function MasterCard({ name, role, experience, photoSrc, education, certificates, diplomas }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="master-block">
      <div
        className="master-card"
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
        <ImageSlot className="master-av" shape="circle" placeholder="Фото" src={photoSrc} alt={name} />
        <div className="master-tx">
          <h4>{name}</h4>
          <p className="role">{role}</p>
          <span className="exp">{experience}</span>
        </div>
        <span className="master-toggle" aria-hidden="true">
          {open ? (
            <svg className="mt-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>
          ) : (
            <svg className="mt-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
          )}
        </span>
      </div>
      <div className="master-detail" style={{ display: open ? "block" : "none" }}>
        <div className="master-detail-inner">
          <div className="md-group">
            <h5>Навчання</h5>
            <ul>{education.map((e, i) => <li key={i}>{e}</li>)}</ul>
          </div>
          <div className="md-group">
            <h5>Сертифікати</h5>
            <ul>{certificates.map((c, i) => <li key={i}>{c}</li>)}</ul>
          </div>
          <div className="md-group">
            <h5>Дипломи та грамоти</h5>
            <ul>{diplomas.map((d, i) => <li key={i}>{d}</li>)}</ul>
          </div>
        </div>
      </div>
    </div>
  );
}
