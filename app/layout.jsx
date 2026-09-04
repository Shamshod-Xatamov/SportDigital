import { Barlow_Condensed, Chivo_Mono, Instrument_Sans } from "next/font/google";
import "./globals.css";

const barlow = Barlow_Condensed({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
  variable: "--font-barlow",
  display: "swap",
});

const instrument = Instrument_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-instrument",
  display: "swap",
});

const chivoMono = Chivo_Mono({
  subsets: ["latin", "latin-ext"],
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
