import { Cormorant_Garamond, Manrope } from "next/font/google";
import { BookingProvider } from "@/components/site/booking-provider";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { MobileDock } from "@/components/site/mobile-dock";
import { Preloader } from "@/components/site/preloader";
import { Cursor } from "@/components/site/cursor";

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

// Оформление первой версии (/svadby). Разметка та же, что была в app/layout.tsx до появления v2.
// Обёртка шрифтов — display: contents: на вёрстку не влияет, только несёт переменные шрифтов и Manrope.
// data-portal-root — сюда же монтируются модальные окна (components/ui/modal.tsx), чтобы и у них были шрифты.
export default function V1Layout({ children }: { children: React.ReactNode }) {
  return (
    <div data-portal-root className={`${manrope.variable} ${cormorant.variable} contents font-sans`}>
      <BookingProvider>
        {/* Первым в body: инлайн-скрипт решает про шторку до отрисовки остального */}
        <Preloader />
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
        <Cursor />
        <div className="grain" aria-hidden />
      </BookingProvider>
    </div>
  );
}
