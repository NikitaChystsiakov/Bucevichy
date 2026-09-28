import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "@/lib/site";
import { BookingProvider } from "@/components/site/booking-provider";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
});

// Вариативный шрифт (300–700): один файл на начертание вместо восьми статических.
// Латиницу тоже предзагружаем: в ней пробел и цифры, она нужна с первой отрисовки
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "cyrillic"],
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

// Общий корень двух версий страницы свадеб: только html/body, шрифты v1 и заявка.
// Оформление v1 (шапка, футер, прелоадер, курсор, зерно) — в app/(v1)/layout.tsx,
// v2 — в app/(v2)/layout.tsx со своими шрифтами и заявкой в стиле v2.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: инлайн-скрипты прелоадера v1 и интро v2 ставят атрибуты на <html>
    // до гидратации
    <html
      lang="ru"
      className={`${manrope.variable} ${cormorant.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh">
        <BookingProvider>{children}</BookingProvider>
      </body>
    </html>
  );
}
