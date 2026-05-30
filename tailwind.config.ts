import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Бренд Beauty & Shine ─────────────────────
        primary:       "#9D66D6",   // фіолетовий — головний
        "primary-dark":"#7E4CB8",
        "primary-light":"#B48BE0",
        accent:        "#F5DE46",   // жовтий — акцент / іскри
        navy:          "#16213E",   // основний текст
        ink:           "#5B5570",   // допоміжний текст
        lavender: {
          DEFAULT: "#F3EEFF",       // основний фон
          deep:    "#E7DCF8",       // межі, кнопки-привиди
        },
      },
      fontFamily: {
        serif: ["'Playfair Display'", "Georgia", "serif"],
        sans:  ["Manrope", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
      boxShadow: {
        soft:  "0 16px 38px -18px rgba(22, 33, 62, 0.28)",
        glow:  "0 10px 24px -10px rgba(157, 102, 214, 0.65)",
      },
      borderRadius: {
        "2xl-soft": "22px",
      },
      maxWidth: {
        page: "1180px",
      },
      keyframes: {
        morph: {
          "0%, 100%": { borderRadius: "46% 54% 58% 42% / 48% 44% 56% 52%" },
          "50%":      { borderRadius: "54% 46% 42% 58% / 56% 52% 48% 44%" },
        },
        twinkle: {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%":      { transform: "scale(.82)", opacity: ".7" },
        },
        rise: {
          from: { opacity: "0", transform: "translateY(22px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        morph:   "morph 15s ease-in-out infinite",
        twinkle: "twinkle 3s ease-in-out infinite",
        rise:    "rise .7s cubic-bezier(.2,.7,.2,1) both",
      },
    },
  },
  plugins: [],
};

export default config;
