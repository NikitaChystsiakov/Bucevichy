import type { Viewport } from "next";
import { Commissioner, Marck_Script, Prata } from "next/font/google";
import { BookingProvider } from "@/components/site/booking-provider";
import { Header } from "@/components/v2/header";
import { Footer } from "@/components/v2/footer";
import { IntroEnvelope, IntroScript } from "@/components/v2/intro";

// Шрифты v2 — только здесь: /svadby их не загружает. Все с кириллицей.
const prata = Prata({
  variable: "--ff-prata",
  weight: "400",
  subsets: ["latin", "cyrillic"],
});

// Рукописный — только для акцентов в 1–2 слова
const marck = Marck_Script({
  variable: "--ff-marck",
  weight: "400",
  subsets: ["latin", "cyrillic"],
});

const commissioner = Commissioner({
  variable: "--ff-commissioner",
  subsets: ["latin", "cyrillic"],
});

export const viewport: Viewport = {
  themeColor: "#f6efe2",
};

// Вторая версия страницы свадеб (/svadby-2): светлая, «приглашение».
// Своя заявка в стиле v2: вложенный BookingProvider перекрывает корневой (стиль v1).
export default function V2Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`v2 ${prata.variable} ${marck.variable} ${commissioner.variable}`}>
      {/* Первым в обёртке: скрипт решает про интро до отрисовки страницы */}
      <IntroScript />
      <BookingProvider variant="v2">
        <IntroEnvelope />
        <Header />
        {children}
        <Footer />
      </BookingProvider>
    </div>
  );
}
