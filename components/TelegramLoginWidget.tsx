"use client";

export function TelegramLoginWidget() {
  function handleClick() {
    // Server-route ініціює OIDC потік: створює state+PKCE, ставить cookie,
    // 302 редіректить на oauth.telegram.org/auth
    window.location.href = "/api/auth/telegram/login";
  }

  return (
    <button className="pf-tg-btn" onClick={handleClick} type="button">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M21 4L3 11l5 2 2 6 3-4 4 3z"/></svg>
      Продовжити через Telegram
    </button>
  );
}
