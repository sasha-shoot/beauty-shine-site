/**
 * Авторизація через Telegram OpenID Connect (OIDC).
 * Заміна старого hash-based widget на сучасний OAuth 2.0 + OIDC потік.
 *
 * Документація: https://core.telegram.org/bots/telegram-login
 *
 * Env vars (Vercel):
 *   TELEGRAM_CLIENT_ID         — Client ID з BotFather Login Widget (= bot_id)
 *   TELEGRAM_CLIENT_SECRET     — Client Secret з BotFather Login Widget
 *   TELEGRAM_REDIRECT_URI      — URL колбеку, напр. https://beauty-shine-site.vercel.app/api/auth/telegram/callback
 *   TELEGRAM_BOT_TOKEN         — токен бота (потрібен для sendMessage адміну)
 *   SESSION_SECRET             — довгий випадковий рядок для підпису session cookie
 *   ADMIN_TG_CHAT_ID           — твій Telegram ID для нотифікацій про замовлення
 */

import crypto from "crypto";
import { jwtVerify, createRemoteJWKSet } from "jose";

const CLIENT_ID = process.env.TELEGRAM_CLIENT_ID || "";
const CLIENT_SECRET = process.env.TELEGRAM_CLIENT_SECRET || "";
const REDIRECT_URI = process.env.TELEGRAM_REDIRECT_URI || "";
const SESSION_SECRET = process.env.SESSION_SECRET || "dev-only-secret-change-in-prod";

const OAUTH_BASE = "https://oauth.telegram.org";
const ISSUER = "https://oauth.telegram.org";
const JWKS_URL = "https://oauth.telegram.org/.well-known/jwks.json";

const SESSION_COOKIE = "bs_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 днів

const STATE_COOKIE = "bs_oauth_state";
const STATE_MAX_AGE = 60 * 10; // 10 хв на завершення логіну

export { SESSION_COOKIE, SESSION_MAX_AGE, STATE_COOKIE, STATE_MAX_AGE };

// ── JWKS клієнт — кешує ключі Telegram ───────────────────
const jwks = createRemoteJWKSet(new URL(JWKS_URL));

// ── PKCE ─────────────────────────────────────────────────
function base64url(buf: Buffer): string {
  return buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

export function generatePkcePair(): { verifier: string; challenge: string } {
  const verifier = base64url(crypto.randomBytes(32));
  const challenge = base64url(crypto.createHash("sha256").update(verifier).digest());
  return { verifier, challenge };
}

export function generateState(): string {
  return base64url(crypto.randomBytes(16));
}

// ── Побудова URL для редіректу на Telegram ───────────────
export function buildAuthorizationUrl(opts: {
  state: string;
  codeChallenge: string;
  scope?: string;
}): string {
  if (!CLIENT_ID || !REDIRECT_URI) {
    throw new Error("TELEGRAM_CLIENT_ID або TELEGRAM_REDIRECT_URI не налаштовано");
  }
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: "code",
    scope: opts.scope || "openid profile",
    state: opts.state,
    code_challenge: opts.codeChallenge,
    code_challenge_method: "S256",
  });
  return `${OAUTH_BASE}/auth?${params.toString()}`;
}

// ── Обмін code на токен ──────────────────────────────────
export type TelegramIdTokenClaims = {
  iss: string;
  aud: string | string[];
  sub: string;
  iat: number;
  exp: number;
  id: number;            // Telegram user ID
  name?: string;
  preferred_username?: string;
  picture?: string;
  phone_number?: string;
};

export async function exchangeCodeForTokens(opts: {
  code: string;
  codeVerifier: string;
}): Promise<{ idToken: string; claims: TelegramIdTokenClaims }> {
  if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI) {
    throw new Error("OIDC env vars не налаштовано повністю");
  }

  const basicAuth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code: opts.code,
    redirect_uri: REDIRECT_URI,
    client_id: CLIENT_ID,
    code_verifier: opts.codeVerifier,
  });

  const res = await fetch(`${OAUTH_BASE}/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${basicAuth}`,
    },
    body: body.toString(),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Token exchange failed (${res.status}): ${errText}`);
  }

  const data = await res.json();
  const idToken = data.id_token as string;
  if (!idToken) throw new Error("id_token відсутній у відповіді Telegram");

  // Верифікація JWT через JWKS
  const { payload } = await jwtVerify(idToken, jwks, {
    issuer: ISSUER,
    audience: CLIENT_ID,
  });

  return { idToken, claims: payload as unknown as TelegramIdTokenClaims };
}

// ── Session cookie (підписаний HMAC) ─────────────────────
export type SessionPayload = {
  tg_user_id: string;
  name: string;
  username: string;
  issued_at: number;
};

export function signSession(payload: SessionPayload): string {
  const json = JSON.stringify(payload);
  const b64 = Buffer.from(json, "utf-8").toString("base64url");
  const sig = crypto.createHmac("sha256", SESSION_SECRET).update(b64).digest("hex");
  return `${b64}.${sig}`;
}

export function verifySession(cookieValue: string): SessionPayload | null {
  try {
    const [b64, sig] = cookieValue.split(".");
    if (!b64 || !sig) return null;
    const expected = crypto.createHmac("sha256", SESSION_SECRET).update(b64).digest("hex");
    if (expected !== sig) return null;
    const json = Buffer.from(b64, "base64url").toString("utf-8");
    return JSON.parse(json) as SessionPayload;
  } catch {
    return null;
  }
}

// ── State+verifier cookie для PKCE (на час auth-flow) ───
export type OauthStateData = {
  state: string;
  verifier: string;
};

export function signOauthState(data: OauthStateData): string {
  const json = JSON.stringify(data);
  const b64 = Buffer.from(json, "utf-8").toString("base64url");
  const sig = crypto.createHmac("sha256", SESSION_SECRET).update(b64).digest("hex");
  return `${b64}.${sig}`;
}

export function verifyOauthState(cookieValue: string): OauthStateData | null {
  try {
    const [b64, sig] = cookieValue.split(".");
    if (!b64 || !sig) return null;
    const expected = crypto.createHmac("sha256", SESSION_SECRET).update(b64).digest("hex");
    if (expected !== sig) return null;
    const json = Buffer.from(b64, "base64url").toString("utf-8");
    return JSON.parse(json) as OauthStateData;
  } catch {
    return null;
  }
}
