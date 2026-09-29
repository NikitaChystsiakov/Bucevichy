import type { Metadata } from "next";
import { Hero } from "@/components/v2/hero";
import { Territory } from "@/components/v2/territory";
import { Horses } from "@/components/v2/horses";
import { Program } from "@/components/v2/program";
import { Hall } from "@/components/v2/hall";
import { Pricing } from "@/components/v2/pricing";
import { Gallery } from "@/components/v2/gallery";
import { Reviews } from "@/components/v2/reviews";
import { BookingSteps } from "@/components/v2/booking-steps";
import { Faq } from "@/components/v2/faq";
import { Directions } from "@/components/v2/directions";
import { Rsvp } from "@/components/v2/rsvp";

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
      <Horses />
      <Program />
      <Hall />
      <Pricing />
      <Gallery />
      <Reviews />
      <BookingSteps />
      <Faq />
      <Directions />
      <Rsvp />
    </main>
  );
}
