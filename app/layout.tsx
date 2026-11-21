import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif", weight: ["500", "600", "700"] });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-sans", weight: ["400", "500", "700"] });

export const metadata: Metadata = {
  title: "Maryam's Glam Beauty Studio | Luxury Cosmetics Boutique",
  description: "Curated velvet lipsticks, rose-gold eyeshadow palettes, luminous foundations & blush sets. Order via WhatsApp at 0316-8242863.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable} scroll-smooth`}>
      <body className="font-sans antialiased bg-[#FBF6F5] text-[#2D1418]">{children}</body>
    </html>
  );
}
