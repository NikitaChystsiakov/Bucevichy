import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SITE_URL } from "@/lib/site";

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

// Общий корень двух версий страницы свадеб: только html/body, metadata и noindex.
// Шрифты, заявка и оформление у каждой версии свои: app/(v1)/layout.tsx и app/(v2)/layout.tsx —
// так /svadby-2 не грузит шрифты v1 и наоборот.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: инлайн-скрипты прелоадера v1 и интро v2 ставят атрибуты на <html>
    // до гидратации
    <html lang="ru" className="antialiased" suppressHydrationWarning>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
