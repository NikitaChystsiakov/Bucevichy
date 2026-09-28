import type { Metadata } from "next";
import { contacts, SITE_URL } from "@/lib/site";
import { faq, MAX_GUESTS, venueDays } from "@/lib/wedding";
import { photos } from "@/lib/photos";
import { Hero } from "@/components/wedding/hero";
import { Marquee } from "@/components/wedding/marquee";
import { WhyHere } from "@/components/wedding/why-here";
import { Facts } from "@/components/wedding/facts";
import { DayStory } from "@/components/wedding/day-story";
import { Ceremony } from "@/components/wedding/ceremony";
import { Horses } from "@/components/wedding/horses";
import { Hall } from "@/components/wedding/hall";
import { EstateMap } from "@/components/wedding/estate-map";
import { Stay } from "@/components/wedding/stay";
import { Pricing } from "@/components/wedding/pricing";
import { Gallery } from "@/components/wedding/gallery";
import { Film } from "@/components/wedding/film";
import { Reviews } from "@/components/wedding/reviews";
import { Faq } from "@/components/wedding/faq";
import { FinalCta } from "@/components/wedding/final-cta";

const title = "Свадьба в усадьбе под Минском в стиле кантри и рустик";
const description =
  "Свадьба в конной усадьбе «Буцевичи» в 23 км от Минска: зал 170 м² с окнами в пол, регистрация у арки из вековой сосны, невеста верхом, ночлег до 40 гостей. Площадка от 2 500 руб.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/svadby" },
  keywords: [
    "свадьба в усадьбе под Минском",
    "свадьба за городом Минск",
    "выездная регистрация Минск",
    "свадьба в стиле кантри",
    "свадьба в стиле рустик",
    "агроусадьба для свадьбы",
  ],
  openGraph: {
    type: "website",
    locale: "ru_BY",
    url: "/svadby",
    siteName: "Конная усадьба «Буцевичи»",
    title,
    description,
    images: [{ url: photos.chaletEvening.src, width: 2048, height: 1536, alt: photos.chaletEvening.alt }],
  },
};

function JsonLd() {
  const minPrice = Math.min(...venueDays.map((d) => d.price));
  const maxPrice = Math.max(...venueDays.map((d) => d.price));
  const data = [
    {
      "@context": "https://schema.org",
      "@type": ["EventVenue", "LodgingBusiness"],
      "@id": `${SITE_URL}/#usadba`,
      name: "Конная усадьба «Буцевичи»",
      description,
      url: `${SITE_URL}/svadby`,
      image: `${SITE_URL}${photos.chaletEvening.src}`,
      telephone: ["+375293222044", "+375297772044"],
      email: contacts.email,
      priceRange: `${minPrice}-${maxPrice} BYN`,
      address: {
        "@type": "PostalAddress",
        addressLocality: "д. Буцевичи",
        addressRegion: "Минская область",
        addressCountry: "BY",
        streetAddress: "23 км от Минска по трассе Р58 (на Мядель)",
      },
      geo: { "@type": "GeoCoordinates", latitude: contacts.geo.lat, longitude: contacts.geo.lng },
      sameAs: [contacts.instagram.href],
      maximumAttendeeCapacity: MAX_GUESTS, // TODO(вместимость): см. lib/wedding.ts
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Главная", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Свадьбы", item: `${SITE_URL}/svadby` },
      ],
    },
  ];
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export default function WeddingPage() {
  return (
    <main>
      <JsonLd />
      <Hero />
      <Marquee />
      <WhyHere />
      <Facts />
      <DayStory />
      <Ceremony />
      <Horses />
      <Hall />
      <EstateMap />
      <Stay />
      <Pricing />
      <Gallery />
      <Film />
      <Reviews />
      <Faq />
      <FinalCta />
    </main>
  );
}
