import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Onest } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "@/lib/site";
import { BookingProvider } from "@/components/site/booking-provider";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { MobileDock } from "@/components/site/mobile-dock";

const onest = Onest({
  variable: "--font-onest",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Конная усадьба «Буцевичи» под Минском",
    template: "%s | Конная усадьба «Буцевичи»",
  },
  applicationName: "Конная усадьба «Буцевичи»",
  // Демо на временном домене не должно попасть в поиск. TODO(запуск): убрать на verhom.by
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#0d1611",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${onest.variable} ${cormorant.variable} antialiased`}>
      <body className="min-h-dvh">
        <BookingProvider>
          <Header />
          {children}
          <Footer />
          <MobileDock />
        </BookingProvider>
        <div className="grain" aria-hidden />
      </body>
    </html>
  );
}
