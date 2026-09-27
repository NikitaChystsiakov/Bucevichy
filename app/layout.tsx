import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "@/lib/site";
import { BookingProvider } from "@/components/site/booking-provider";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { MobileDock } from "@/components/site/mobile-dock";
import { Preloader } from "@/components/site/preloader";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600"],
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
  themeColor: "#141c17",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: инлайн-скрипт прелоадера ставит data-preloader до гидратации
    <html
      lang="ru"
      className={`${manrope.variable} ${cormorant.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh">
        {/* Первым в body: инлайн-скрипт решает про шторку до отрисовки остального */}
        <Preloader />
        <BookingProvider>
          <Header />
          {/* Страница лежит поверх футера и при докрутке «открывает» его (sticky reveal) */}
          <div className="relative z-10 bg-forest-deep shadow-[0_30px_60px_-10px_rgb(0_0_0/0.6)]">
            {children}
            {/* Метка конца страницы: якорь «Контакты» (#kontakty) и сигнал нижней панели,
                что открывается футер. Сам футер sticky, поэтому якорь стоит здесь, а не на нём */}
            <div id="kontakty" aria-hidden />
          </div>
          <Footer />
          <MobileDock />
        </BookingProvider>
        <div className="grain" aria-hidden />
      </body>
    </html>
  );
}
