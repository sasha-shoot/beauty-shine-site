"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type AuthUser = {
  id: string;           // Telegram user ID або згенерований
  name: string;         // Ім'я
  initial: string;      // Перша літера для аватара
  username?: string;    // @telegram username
  phone?: string;       // +380... якщо вхід через телефон
  city?: string;
  method: "tg" | "phone";
  bonus: number;        // ✦ бонусів
};

type UserContextType = {
  user: AuthUser | null;
  isHydrated: boolean;
  loginTelegram: (data: Partial<AuthUser>) => void;
  loginPhone: (phone: string) => void;
  logout: () => void;
};

const UserContext = createContext<UserContextType | null>(null);
const USER_KEY = "bs_user_v1";

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(USER_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {}
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
      else localStorage.removeItem(USER_KEY);
    } catch {}
  }, [user, isHydrated]);

  // ДЕМО-логін через Telegram. Реальна верифікація через bot token буде в Етапі В
  function loginTelegram(data: Partial<AuthUser>) {
    const name = data.name || "Користувач Telegram";
    setUser({
      id: data.id || `tg_${Date.now()}`,
      name,
      initial: name[0]?.toUpperCase() || "B",
      username: data.username || "@user",
      method: "tg",
      bonus: 250, // демо-стартові бонуси
      ...data,
    });
  }

  function loginPhone(phone: string) {
    setUser({
      id: `ph_${phone}`,
      name: "Клієнт",
      initial: "К",
      phone,
      method: "phone",
      bonus: 0,
    });
  }

  function logout() {
    setUser(null);
  }

  return (
    <UserContext.Provider value={{ user, isHydrated, loginTelegram, loginPhone, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser має використовуватись усередині UserProvider");
  return ctx;
}
