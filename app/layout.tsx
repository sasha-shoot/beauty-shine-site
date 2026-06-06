import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Providers } from "@/components/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Beauty & Shine — догляд за руками й ногами",
  description:
    "Студія краси та здоров'я в Ізмаїлі. Професійний догляд за руками й ногами " +
    "від брендів divapharm та Veratin. Доставка по всій Україні.",
  openGraph: {
    title: "Beauty & Shine",
    description: "Студія краси та здоров'я. Догляд за руками й ногами.",
    type: "website",
    locale: "uk_UA",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Manrope:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>
          <Header />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
