/**
 * Авторизація: перевірка Telegram Login Widget hash + підписаний cookie-сесія.
 *
 * Env vars (Vercel):
 *   TELEGRAM_BOT_TOKEN     — токен бота (НЕ викладати у клієнт)
 *   TELEGRAM_BOT_USERNAME  — наприклад "beauty_shine_izmayil_bot" (без @)
 *   SESSION_SECRET         — будь-який довгий випадковий рядок для підпису cookie
 */

import crypto from "crypto";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const SESSION_SECRET = process.env.SESSION_SECRET || "dev-only-secret-change-in-prod";
const COOKIE_NAME = "bs_session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 днів

export type TelegramAuthPayload = {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
};

export type SessionPayload = {
  tg_user_id: string;
  first_name: string;
  last_name: string;
  username: string;
  issued_at: number;
};

/**
 * Перевіряє hash від Telegram Login Widget.
 * За інструкцією: https://core.telegram.org/widgets/login#checking-authorization
 */
export function verifyTelegramHash(payload: TelegramAuthPayload): boolean {
  if (!BOT_TOKEN) {
    console.error("TELEGRAM_BOT_TOKEN не налаштовано");
    return false;
  }

  const { hash, ...rest } = payload;

  // data_check_string: усі поля окрім hash, key=value, відсортовані по ключу, через \n
  const dataCheckString = Object.keys(rest)
    .sort()
    .filter((k) => (rest as any)[k] !== undefined && (rest as any)[k] !== null)
    .map((k) => `${k}=${(rest as any)[k]}`)
    .join("\n");

  // secret_key = SHA256(bot_token)
  const secretKey = crypto.createHash("sha256").update(BOT_TOKEN).digest();

  // expected = HMAC-SHA256(data_check_string, secret_key)
  const expected = crypto.createHmac("sha256", secretKey).update(dataCheckString).digest("hex");

  if (expected !== hash) return false;

  // Перевірка свіжості — не старіше 24 год (захист від replay)
  const ageSec = Math.floor(Date.now() / 1000) - payload.auth_date;
  if (ageSec > 60 * 60 * 24) return false;

  return true;
}

/**
 * Підписує JSON payload HMAC-ключем і повертає cookie-значення.
 * Формат: base64(json).hex(hmac)
 */
export function signSession(payload: SessionPayload): string {
  const json = JSON.stringify(payload);
  const b64 = Buffer.from(json, "utf-8").toString("base64url");
  const sig = crypto.createHmac("sha256", SESSION_SECRET).update(b64).digest("hex");
  return `${b64}.${sig}`;
}

/**
 * Перевіряє підпис і повертає payload або null.
 */
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

export const SESSION_COOKIE = COOKIE_NAME;
export const SESSION_MAX_AGE = COOKIE_MAX_AGE;
