"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type UIContextType = {
  cartOpen: boolean;
  profileOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  openProfile: () => void;
  closeProfile: () => void;
};

const UIContext = createContext<UIContextType | null>(null);

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // Блокуємо скрол коли будь-який drawer відкритий
  useEffect(() => {
    if (cartOpen || profileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [cartOpen, profileOpen]);

  // ESC закриває
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setCartOpen(false);
        setProfileOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <UIContext.Provider value={{
      cartOpen, profileOpen,
      openCart: () => setCartOpen(true),
      closeCart: () => setCartOpen(false),
      openProfile: () => setProfileOpen(true),
      closeProfile: () => setProfileOpen(false),
    }}>
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI має використовуватись усередині UIProvider");
  return ctx;
}
