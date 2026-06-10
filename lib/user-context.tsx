"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type AuthUser = {
  id: string;
  name: string;
  initial: string;
  username?: string;
  phone?: string;
  city?: string;
  method: "tg" | "phone";
  bonus: number;
};

type UserContextType = {
  user: AuthUser | null;
  isHydrated: boolean;
  loginPhoneDemo: (phone: string) => void;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const UserContext = createContext<UserContextType | null>(null);
const PHONE_DEMO_KEY = "bs_phone_demo_v1";

function toAuthUser(api: any): AuthUser {
  const name = api.name || "Користувач";
  return {
    id: String(api.id || ""),
    name,
    initial: name[0]?.toUpperCase() || "B",
    username: api.username || "",
    phone: api.phone || "",
    city: api.city || "",
    method: (api.method === "phone" ? "phone" : "tg"),
    bonus: Number(api.bonus) || 0,
  };
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // 1. Сесійний cookie (Telegram OIDC) АБО
  // 2. localStorage phone-демо
  async function refresh() {
    try {
      const res = await fetch("/api/me", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setUser(toAuthUser(data.user));
          return;
        }
      }
      const raw = localStorage.getItem(PHONE_DEMO_KEY);
      if (raw) {
        setUser(JSON.parse(raw));
        return;
      }
      setUser(null);
    } catch {
      setUser(null);
    }
  }

  useEffect(() => {
    refresh().finally(() => setIsHydrated(true));
  }, []);

  function loginPhoneDemo(phone: string) {
    const u: AuthUser = {
      id: `ph_${phone}`,
      name: "Клієнт",
      initial: "К",
      phone,
      method: "phone",
      bonus: 0,
    };
    try { localStorage.setItem(PHONE_DEMO_KEY, JSON.stringify(u)); } catch {}
    setUser(u);
  }

  async function logout() {
    try { await fetch("/api/auth/logout", { method: "POST" }); } catch {}
    try { localStorage.removeItem(PHONE_DEMO_KEY); } catch {}
    setUser(null);
  }

  return (
    <UserContext.Provider value={{ user, isHydrated, loginPhoneDemo, logout, refresh }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser має використовуватись усередині UserProvider");
  return ctx;
}
