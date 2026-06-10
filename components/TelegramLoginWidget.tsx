"use client";

import { useEffect, useRef, useState } from "react";
import { useUser, type TelegramRawData } from "@/lib/user-context";

// Bot username береться з NEXT_PUBLIC env var (доступне в браузері)
const BOT_USERNAME = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || "";

declare global {
  interface Window {
    onTelegramAuth?: (user: TelegramRawData) => void;
  }
}

export function TelegramLoginWidget() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { loginTelegram } = useUser();
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!BOT_USERNAME) {
      setError("Bot username не налаштовано");
      return;
    }
    if (!containerRef.current) return;

    // Реєструємо глобальний callback, який Telegram буде викликати
    window.onTelegramAuth = async (raw: TelegramRawData) => {
      setError("");
      const result = await loginTelegram(raw);
      if (!result.ok) {
        setError(result.error || "Не вдалося увійти");
      }
    };

    // Підвантажуємо офіційний Telegram script
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.async = true;
    script.setAttribute("data-telegram-login", BOT_USERNAME);
    script.setAttribute("data-size", "large");
    script.setAttribute("data-radius", "20");
    script.setAttribute("data-onauth", "onTelegramAuth(user)");
    script.setAttribute("data-request-access", "write");
    containerRef.current.appendChild(script);

    return () => {
      try {
        window.onTelegramAuth = undefined;
      } catch {}
    };
  }, [loginTelegram]);

  if (!BOT_USERNAME) {
    return (
      <div className="pf-hint" style={{ color: "var(--ink-3)", fontSize: 12.5, textAlign: "center", padding: "8px 0" }}>
        Telegram-авторизація поки не налаштована. Спробуйте вхід за номером телефону.
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <div ref={containerRef} className="tg-widget-container" />
      {error && (
        <p style={{ color: "#b00020", fontSize: 12.5, textAlign: "center", margin: 0 }}>{error}</p>
      )}
    </div>
  );
}
