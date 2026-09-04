import { Barlow_Condensed, JetBrains_Mono, Manrope } from "next/font/google";
import "./globals.css";

const barlow = Barlow_Condensed({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
  variable: "--font-barlow",
  display: "swap",
});

const instrument = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-instrument",
  display: "swap",
});

const chivoMono = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
  variable: "--font-chivo",
  display: "swap",
});

export const metadata = {
  title: "SportDigital — Sport tashkilotlari uchun raqamli boshqaruv platformasi",
  description:
    "SportDigital sport tashkilotlarining xizmatlari, moliyasi, marketingi va muxlislar faolligini yagona tabloda monitoring qiladi, raqamli rivojlanish indeksini hisoblaydi va boshqaruv qarorlari uchun tavsiyalar beradi.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b110e",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="uz"
      className={`${barlow.variable} ${instrument.variable} ${chivoMono.variable}`}
      data-scroll-behavior="smooth"
    >
      <body>{children}</body>
    </html>
  );
}
