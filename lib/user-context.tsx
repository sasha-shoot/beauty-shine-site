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

export type TelegramRawData = {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
};

type UserContextType = {
  user: AuthUser | null;
  isHydrated: boolean;
  loading: boolean;
  loginTelegram: (raw: TelegramRawData) => Promise<{ ok: boolean; error?: string }>;
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
  const [loading, setLoading] = useState(false);

  // При маунті: тягнемо поточного юзера з cookie через /api/me
  // АБО з localStorage якщо це phone-демо-логін
  async function refresh() {
    try {
      // 1. Спершу пробуємо реальну Telegram-сесію
      const res = await fetch("/api/me", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setUser(toAuthUser(data.user));
          return;
        }
      }
      // 2. Якщо нема — пробуємо phone-демо з localStorage
      const raw = localStorage.getItem(PHONE_DEMO_KEY);
      if (raw) {
        const u = JSON.parse(raw);
        setUser(u);
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

  async function loginTelegram(raw: TelegramRawData): Promise<{ ok: boolean; error?: string }> {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(raw),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        return { ok: false, error: data.error || "Помилка авторизації" };
      }
      setUser(toAuthUser(data.user));
      return { ok: true };
    } catch (e) {
      return { ok: false, error: "Мережева помилка" };
    } finally {
      setLoading(false);
    }
  }

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
    <UserContext.Provider value={{ user, isHydrated, loading, loginTelegram, loginPhoneDemo, logout, refresh }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser має використовуватись усередині UserProvider");
  return ctx;
}
