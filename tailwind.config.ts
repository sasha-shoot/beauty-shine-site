import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary:       "#9D66D6",
        "primary-dark":"#7E4CB8",
        "primary-light":"#B48BE0",
        accent:        "#F5DE46",
        navy:          "#16213E",
        ink:           "#5B5570",
        lavender: {
          DEFAULT: "#F3EEFF",
          deep:    "#E7DCF8",
          mist:    "#FAF7FF",
        },
      },
      fontFamily: {
        serif: ["'Playfair Display'", "Georgia", "serif"],
        sans:  ["Manrope", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
      borderRadius: {
        bubble:      "32px",
        "bubble-lg": "44px",
        "bubble-xl": "56px",
      },
      boxShadow: {
        bubble:        "0 24px 60px -28px rgba(22,33,62,0.18), 0 0 0 1px rgba(22,33,62,0.04)",
        "bubble-hover":"0 36px 80px -28px rgba(157,102,214,0.4), 0 0 0 1px rgba(157,102,214,0.06)",
        soft:          "0 12px 30px -15px rgba(22,33,62,0.15)",
        pill:          "0 8px 22px -8px rgba(22,33,62,0.15), 0 0 0 1px rgba(22,33,62,0.05)",
        glow:          "0 12px 30px -8px rgba(157,102,214,0.55)",
      },
      maxWidth: {
        page: "1200px",
      },
      keyframes: {
        morph: {
          "0%, 100%": { borderRadius: "46% 54% 58% 42% / 48% 44% 56% 52%" },
          "50%":      { borderRadius: "54% 46% 42% 58% / 56% 52% 48% 44%" },
        },
        twinkle: {
          "0%, 100%": { transform: "scale(1)",   opacity: "1" },
          "50%":      { transform: "scale(.82)", opacity: ".7" },
        },
        rise: {
          from: { opacity: "0", transform: "translateY(28px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%":      { transform: "translateY(-10px)" },
        },
      },
      animation: {
        morph:   "morph 16s ease-in-out infinite",
        twinkle: "twinkle 3s ease-in-out infinite",
        rise:    "rise .8s cubic-bezier(.2,.7,.2,1) both",
        float:   "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
