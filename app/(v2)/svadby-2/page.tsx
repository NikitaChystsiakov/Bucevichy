import type { Metadata } from "next";
import { Hero } from "@/components/v2/hero";
import { Territory } from "@/components/v2/territory";
import { Program } from "@/components/v2/program";

// Вторая версия страницы свадеб — альтернатива для выбора владельцами. Основная — /svadby,
// поэтому canonical указывает на неё, а JSON-LD здесь не дублируем. noindex — из общего layout.
const title = "Свадьба в усадьбе под Минском — приглашение";
const description =
  "Свадьба в конной усадьбе «Буцевичи» в 23 км от Минска: регистрация у арки из вековой сосны, невеста верхом, зал 170 м² с окнами в пол, ночлег до 40 гостей. Площадка от 2 500 руб.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/svadby" },
};

export default function WeddingPageV2() {
  return (
    <main id="top">
      <Hero />
      <Territory />
      <Program />
      {/* Этап 2: стоимость (#stoimost), фото, отзывы, FAQ, «Ждём вас в Буцевичах» */}
    </main>
  );
}
