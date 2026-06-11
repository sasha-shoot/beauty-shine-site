/** @type {import('next').NextConfig} */

// ── Security headers ──────────────────────────────────────
// CSP дозволяє тільки те, що сайт реально використовує:
// Google Fonts, Telegram CDN (аватарки), Airtable (фото товарів), oauth.telegram.org
const securityHeaders = [
  {
    // Захист від clickjacking — сайт не можна вбудувати в iframe
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    // Браузер не вгадує MIME-типи — захист від підміни контенту
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    // Не передавати повний referrer на чужі сайти
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    // HSTS: тільки HTTPS, на 2 роки, включно з піддоменами
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    // Вимикаємо непотрібні браузерні API
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  {
    // Content Security Policy — головний захист від XSS
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Next.js потребує inline-скриптів для гідрації; unsafe-eval НЕ даємо
      "script-src 'self' 'unsafe-inline'",
      // Стилі: свої + Google Fonts + inline (React style props)
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      // Зображення: свої + data URI + Telegram CDN + Airtable
      "img-src 'self' data: blob: https://*.telesco.pe https://t.me https://*.airtableusercontent.com https://dl.airtable.com",
      // API-запити: свої + Airtable + Telegram
      "connect-src 'self' https://api.airtable.com https://api.telegram.org https://oauth.telegram.org",
      // Куди можна сабмітити форми
      "form-action 'self' https://oauth.telegram.org",
      // Заборона вбудовування (дублює X-Frame-Options для сучасних браузерів)
      "frame-ancestors 'none'",
      // Заборона flash та інших плагінів
      "object-src 'none'",
      "base-uri 'self'",
    ].join("; "),
  },
];

const nextConfig = {
  reactStrictMode: true,
  // Прибираємо X-Powered-By: Next.js — менше інформації для атакуючого
  poweredByHeader: false,
  images: {
    remotePatterns: [
      // Telegram CDN для аватарок
      { protocol: "https", hostname: "cdn1.telesco.pe" },
      { protocol: "https", hostname: "cdn2.telesco.pe" },
      { protocol: "https", hostname: "cdn3.telesco.pe" },
      { protocol: "https", hostname: "cdn4.telesco.pe" },
      { protocol: "https", hostname: "cdn5.telesco.pe" },
      { protocol: "https", hostname: "t.me" },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

module.exports = nextConfig;
