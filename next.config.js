/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
};

module.exports = nextConfig;
